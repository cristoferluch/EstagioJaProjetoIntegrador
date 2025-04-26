package controllers

import (
	"backend/database"
	"backend/internal/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetAllCategories(c *gin.Context) {
	var category []models.Category
	database.DB.Find(&category)
	c.JSON(200, category)
}

func GetCategoryById(c *gin.Context) {
	var category models.Category
	id := c.Params.ByName("id")
	database.DB.First(&category, id)

	if category.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Categoria não encontrada",
		})
		return
	}

	c.JSON(http.StatusOK, category)
}

func CreateCategory(c *gin.Context) {
	var category models.Category

	err := c.ShouldBindJSON(&category)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}

	if strings.TrimSpace(category.Title) == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Titulo para categoria invalido",
		})
		return
	}

	database.DB.Create(&category)
	c.JSON(http.StatusOK, category)
}

func DeleteCategoryById(c *gin.Context) {
	var category models.Category

	id := c.Params.ByName("id")

	database.DB.First(&category, id)

	if category.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Categoria não encontrada",
		})
		return
	}

	query, err := database.DB.Raw("SELECT category_id FROM job WHERE category_id = ?", id).Rows()

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Categoria não encontrada",
		})
		return
	}
	defer query.Close()

	if query.Next() {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Essa categoria esta vinculado a uma vaga",
		})
		return
	}

	database.DB.Delete(&category, id)

	c.JSON(http.StatusOK, gin.H{
		"success": "Categoria deletada",
	})
}

func UpdateCategoryById(c *gin.Context) {
	var category models.Category

	id := c.Params.ByName("id")

	database.DB.First(&category, id)

	if category.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Categoria não encontrada",
		})
		return
	}

	err := c.ShouldBindJSON(&category)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if strings.TrimSpace(category.Title) == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Titulo para categoria invalido",
		})
		return
	}

	database.DB.Model(&category).UpdateColumns(category)
	c.JSON(http.StatusOK, category)
}
