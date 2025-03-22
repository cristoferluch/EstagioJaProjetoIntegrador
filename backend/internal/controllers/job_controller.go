package controllers

import (
	"backend/database"
	"backend/internal/models"
	"backend/internal/service"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAllJobs(c *gin.Context) {
	var jobs []models.JobNew

	if err := database.DB.Preload("Category").Preload("Company").Find(&jobs).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao buscar jobs",
		})
		return
	}

	response := formatJobsResponse(jobs)
	c.JSON(http.StatusOK, response)
}

func GetJobById(c *gin.Context) {
	var job models.JobNew
	id := c.Params.ByName("id")

	if err := database.DB.Preload("Category").Preload("Company").First(&job, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Vaga não encontrada",
		})
		return
	}

	response := formatJobsResponse([]models.JobNew{job})
	c.JSON(http.StatusOK, response)
}

func CreateJob(c *gin.Context) {

	userId, _ := service.GetUserSession(c)

	var job models.JobNew

	err := c.ShouldBindJSON(&job)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}

	job.CompanyId = userId

	var company models.CompanyNew
	database.DB.First(&company, userId)
	if company.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Empresa não encontrada",
		})
		return
	}

	var category models.CategoryNew
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

	response := formatJobsResponse([]models.JobNew{job})
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

	var job models.JobNew
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

	var job models.JobNew
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

	var company models.CompanyNew
	database.DB.First(&company, userId)
	if company.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Empresa não encontrada",
		})
		return
	}

	var category models.CategoryNew
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

	response := formatJobsResponse([]models.JobNew{job})
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

	var job models.JobNew
	jobId := c.Params.ByName("jobId")

	database.DB.First(&job, jobId)

	if job.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Vaga não encontrada",
		})
		return
	}

	var user models.UsersNew
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

func formatJobsResponse(jobs []models.JobNew) []models.JobResponse {
	var response []models.JobResponse
	for _, job := range jobs {
		response = append(response, models.JobResponse{
			ID:            job.ID,
			Title:         job.Title,
			Description:   job.Description,
			Salary:        job.Salary,
			CompanyName:   job.Company.Name,
			CategoryTitle: job.Category.Title,
		})
	}
	return response
}
