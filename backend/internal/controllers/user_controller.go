package controllers

import (
	"backend/database"
	"backend/internal/models"
	"backend/internal/service"
	"backend/utils/validation"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetAllUsers(c *gin.Context) {
	var users []models.Users
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

	var user models.Users

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
	var user models.Users

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

	var user models.Users

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

	var user models.Users

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

func UserDocumentUpload(c *gin.Context) {

	userId, _ := service.GetUserSession(c)

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nenhum arquivo enviado"})
		return
	}
	defer file.Close()

	if header.Header.Get("Content-Type") != "application/pdf" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Apenas arquivos PDF são permitidos"})
		return
	}

	fileData, err := io.ReadAll(file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao ler o arquivo"})
		return
	}

	document := models.Document{
		UserID:       userId,
		FileName:     header.Filename,
		FileType:     header.Header.Get("Content-Type"),
		FileData:     fileData,
		DocumentType: c.PostForm("document_type"),
	}

	if err := database.DB.Create(&document).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar no banco de dados"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":       "Documento salvo com sucesso",
		"id":            document.ID,
		"file_name":     document.FileName,
		"document_type": document.DocumentType,
	})
}

func UserDocumentDownload(c *gin.Context) {

	id := c.Param("id")

	var document models.Document
	if err := database.DB.First(&document, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Documento não encontrado"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar documento"})
		}
		return
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", document.FileName))
	c.Header("Content-Type", document.FileType)
	c.Header("Content-Length", fmt.Sprintf("%d", len(document.FileData)))

	c.Data(http.StatusOK, document.FileType, document.FileData)
}

func UserDocumentList(c *gin.Context) {
	userId, _ := service.GetUserSession(c)

	var documents []models.Document
	if err := database.DB.Where("user_id = ?", userId).Find(&documents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar documentos"})
		return
	}

	type SafeDocument struct {
		ID           uint   `json:"id"`
		CreatedAt    string `json:"created_at"`
		FileName     string `json:"file_name"`
		FileType     string `json:"file_type"`
		DocumentType string `json:"document_type"`
	}

	var safeDocuments []SafeDocument
	for _, doc := range documents {
		safeDocuments = append(safeDocuments, SafeDocument{
			ID:           doc.ID,
			CreatedAt:    doc.CreatedAt.Format(time.RFC3339),
			FileName:     doc.FileName,
			FileType:     doc.FileType,
			DocumentType: doc.DocumentType,
		})
	}

	c.JSON(http.StatusOK, safeDocuments)
}
