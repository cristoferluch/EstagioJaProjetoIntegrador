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

func GetAllUsers(c *gin.Context) {
	var users []models.UsersNew
	database.DB.Find(&users)
	c.JSON(200, users)
}

func GetUserById(c *gin.Context) {

	id := c.Params.ByName("id")
	userId, _ := service.GetUserSession(c)

	if id != strconv.Itoa(int(userId)) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Você não tem permissão para essa ação",
		})
		return
	}

	var user models.UsersNew

	database.DB.First(&user, id)

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Usuário não encontrado",
		})
		return
	}

	c.JSON(http.StatusOK, user)
}

func CreateUser(c *gin.Context) {
	var user models.UsersNew

	err := c.ShouldBindJSON(&user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error()})
		return
	}

	if !validation.IsEmailValid(user.Email) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email inválido",
		})
		return
	}

	if !validation.IsCpfValid(user.CPF) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "CPF inválido",
		})
		return
	}

	if len(user.State) != 2 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Estado inválido",
		})
		return
	}

	database.DB.Create(&user)
	c.JSON(http.StatusOK, user)
}

func DeleteUserById(c *gin.Context) {

	id := c.Params.ByName("id")
	userId, _ := service.GetUserSession(c)

	if id != strconv.Itoa(int(userId)) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Você não tem permissão para essa ação",
		})
		return
	}

	var user models.UsersNew

	database.DB.First(&user, id)

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Usuário não encontrado",
		})
		return
	}

	database.DB.Delete(&user, id)

	c.JSON(http.StatusOK, gin.H{
		"success": "Usuário deletado",
	})
}

func UpdateUserById(c *gin.Context) {

	id := c.Params.ByName("id")
	userId, _ := service.GetUserSession(c)

	if id != strconv.Itoa(int(userId)) {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Você não tem permissão para essa ação",
		})
		return
	}

	var user models.UsersNew

	database.DB.First(&user, id)

	if user.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Usuário não encontrado",
		})
		return
	}

	err := c.ShouldBindJSON(&user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	if len(user.State) != 2 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Estado inválido",
		})
		return
	}

	database.DB.Model(&user).UpdateColumns(user)
	c.JSON(http.StatusOK, user)
}
