package controllers

import (
	"backend/database"
	"backend/internal/models"
	"backend/internal/service"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAllJobs(c *gin.Context) {
	var jobs []models.JobResponse
	var args []interface{}
	var conditions []string

	title := c.Query("title")
	minSalaryStr := c.Query("minSalary")
	maxSalaryStr := c.Query("maxSalary")
	category := c.Query("category")

	minSalary, _ := strconv.ParseFloat(minSalaryStr, 64)
	maxSalary, _ := strconv.ParseFloat(maxSalaryStr, 64)

	query := `
		SELECT 
			j.id,
			j.title,
			j.description,
			j.salary,
			c.name AS company_name,
			COALESCE(ca.title, '') AS category_title,
			c.id,
			ca.id
		FROM jobs AS j
		INNER JOIN companies AS c ON c.id = j.company_id
		LEFT JOIN categories ca ON ca.id = j.category_id
		WHERE j.deleted_at IS NULL
	`

	if strings.TrimSpace(title) != "" {
		conditions = append(conditions, fmt.Sprintf("j.title ILIKE $%d", len(args)+1))
		args = append(args, "%"+title+"%")
	}
	if minSalary > 0 {
		conditions = append(conditions, fmt.Sprintf("j.salary >= $%d", len(args)+1))
		args = append(args, minSalary)
	}
	if maxSalary > 0 {
		conditions = append(conditions, fmt.Sprintf("j.salary <= $%d", len(args)+1))
		args = append(args, maxSalary)
	}
	if len(conditions) > 0 {
		query += " AND " + strings.Join(conditions, " AND ")
	}
	if strings.TrimSpace(category) != "" {
		query += " AND ca.id in (" + category + ")"
	}
	query += " ORDER BY j.salary DESC"

	rows, err := database.SQLDB.Query(query, args...)
	if err != nil {
		log.Println("ERRO [GetAllJobs][Query]:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar vagas"})
		return
	}
	defer rows.Close()

	for rows.Next() {
		var job models.JobResponse
		if err := rows.Scan(&job.ID, &job.Title, &job.Description, &job.Salary, &job.CompanyName, &job.CategoryTitle, &job.CompanyId, &job.CategoryId); err != nil {
			log.Println("ERRO [GetAllJobs][Scan]:", err)
			continue
		}
		jobs = append(jobs, job)
	}

	c.JSON(http.StatusOK, jobs)
}

func GetJobById(c *gin.Context) {
	var job models.Job
	id := c.Params.ByName("id")

	if err := database.DB.Preload("Category").Preload("Company").First(&job, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Vaga não encontrada",
		})
		return
	}

	response := models.JobResponse{
		ID:            job.ID,
		Title:         job.Title,
		Description:   job.Description,
		Salary:        job.Salary,
		CompanyName:   job.Company.Name,
		CategoryTitle: job.Category.Title,
		CompanyId:     job.Company.ID,
		CategoryId:    job.Category.ID,
	}

	c.JSON(http.StatusOK, response)
}

func CreateJob(c *gin.Context) {

	userId, _ := service.GetUserSession(c)

	var job models.Job

	err := c.ShouldBindJSON(&job)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}

	job.CompanyId = userId

	var company models.Company
	database.DB.First(&company, userId)
	if company.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Empresa não encontrada",
		})
		return
	}

	var category models.Category
	database.DB.First(&category, job.CategoryId)
	if category.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Categoria não encontrada",
		})
		return
	}

	if job.Salary <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Salário inválido",
		})
		return
	}

	if strings.TrimSpace(job.Description) == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "descrição inválida",
		})
		return
	}

	if strings.TrimSpace(job.Title) == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Título inválido",
		})
		return
	}

	database.DB.Create(&job)

	if err := database.DB.Preload("Category").Preload("Company").First(&job, job.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Vaga não encontrada",
		})
		return
	}

	response := formatJobsResponse([]models.Job{job})
	c.JSON(http.StatusOK, response)

}

func DeleteJobById(c *gin.Context) {

	userId, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Você não tem permissão para essa ação",
		})
		return
	}

	var job models.Job
	jobId := c.Params.ByName("id")
	database.DB.First(&job, jobId)

	if job.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Vaga não encontrada",
		})
		return
	}

	if job.CompanyId != userId {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Você não tem permissão para editar esta vaga",
		})
		return
	}

	database.DB.Delete(&job, jobId)

	c.JSON(http.StatusOK, gin.H{
		"success": "Vaga deletada",
	})
}

func UpdateJobById(c *gin.Context) {

	userId, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Você não tem permissão para essa ação",
		})
		return
	}

	var job models.Job
	id := c.Params.ByName("id")

	database.DB.First(&job, id)

	if job.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Vaga não encontrada",
		})
		return
	}

	if job.CompanyId != userId {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Você não tem permissão para editar esta vaga",
		})
		return
	}

	err := c.ShouldBindJSON(&job)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	var company models.Company
	database.DB.First(&company, userId)
	if company.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Empresa não encontrada",
		})
		return
	}

	var category models.Category
	database.DB.First(&category, job.CategoryId)
	if category.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Categoria não encontrada",
		})
		return
	}

	if job.Salary <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Salário inválido",
		})
		return
	}

	if strings.TrimSpace(job.Description) == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "descrição inválida",
		})
		return
	}

	if strings.TrimSpace(job.Title) == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Título inválido",
		})
		return
	}

	database.DB.Model(&job).UpdateColumns(job)

	if err := database.DB.Preload("Category").Preload("Company").First(&job, job.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Vaga não encontrada",
		})
		return
	}

	response := formatJobsResponse([]models.Job{job})
	c.JSON(http.StatusOK, response)

}

func ApplyForJob(c *gin.Context) {

	userId, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Você não tem permissão para essa ação",
		})
		return
	}

	var job models.Job
	jobId := c.Params.ByName("jobId")

	database.DB.First(&job, jobId)

	if job.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Vaga não encontrada",
		})
		return
	}

	var user models.Users
	if err := database.DB.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Usuário não encontrado",
		})
		return
	}

	var existingApplication models.JobApplication
	if err := database.DB.Where("user_id = ? AND job_id = ?", userId, jobId).First(&existingApplication).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"error": "Usuário já se inscreveu nesta vaga",
		})
		return
	}

	jobApplication := models.JobApplication{
		UserId:    userId.(uint),
		JobId:     job.ID,
		AppliedAt: time.Now(),
		Status:    "pending",
	}

	database.DB.Create(&jobApplication)

	c.JSON(http.StatusOK, gin.H{"success": "inscrição realizada com sucesso"})
}

func formatJobsResponse(jobs []models.Job) []models.JobResponse {
	var response []models.JobResponse
	for _, job := range jobs {
		response = append(response, models.JobResponse{
			ID:            job.ID,
			Title:         job.Title,
			Description:   job.Description,
			Salary:        job.Salary,
			CompanyName:   job.Company.Name,
			CategoryTitle: job.Category.Title,
			CompanyId:     job.Company.ID,
			CategoryId:    job.Category.ID,
		})
	}
	return response
}
