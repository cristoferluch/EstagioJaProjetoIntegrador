package controllers

import (
	"backend/database"
	"backend/internal/models"
	"backend/internal/service"
	"backend/utils/validation"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetAllCompanys(c *gin.Context) {
	var company []models.Company
	database.DB.Find(&company)
	c.JSON(200, company)
}

func GetCompanyById(c *gin.Context) {

	id := c.Params.ByName("id")
	userId, _ := service.GetUserSession(c)

	if id != strconv.Itoa(int(userId)) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Você não tem permissão para essa ação",
		})
		return
	}

	var company models.Company

	database.DB.First(&company, id)

	if company.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Empresa não encontrada",
		})
		return
	}

	c.JSON(http.StatusOK, company)
}

func CreateCompany(c *gin.Context) {
	var company models.Company

	err := c.ShouldBindJSON(&company)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}

	if !validation.IsEmailValid(company.Email) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email inválido",
		})
		return
	}

	database.DB.Create(&company)
	c.JSON(http.StatusOK, company)
}

func DeleteCompanyById(c *gin.Context) {

	id := c.Params.ByName("id")
	userId, _ := service.GetUserSession(c)

	if id != strconv.Itoa(int(userId)) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não tem permissão para essa ação"})
		return
	}

	var company models.Company
	database.DB.First(&company, id)

	if company.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"Not found": "Empresa não encontrada",
		})
		return
	}

	database.DB.Delete(&company, id)

	c.JSON(http.StatusOK, gin.H{
		"success": "Empresa deletada",
	})
}

func UpdateCompanyById(c *gin.Context) {

	id := c.Params.ByName("id")
	userId, _ := service.GetUserSession(c)

	if id != strconv.Itoa(int(userId)) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Você não tem permissão para essa ação"})
		return
	}

	var company models.Company

	database.DB.First(&company, id)

	if company.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Empresa não encontrada",
		})
		return
	}

	err := c.ShouldBindJSON(&company)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	database.DB.Model(&company).UpdateColumns(company)
	c.JSON(http.StatusOK, company)
}
