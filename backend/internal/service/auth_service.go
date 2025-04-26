package service

import (
	"backend/database"
	"backend/internal/models"
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetUserSession(c *gin.Context) (uint, error) {

	userID, exists := c.Get("userID")
	if !exists {
		return 0, nil
	}

	return userID.(uint), nil
}

func AuthenticateUser(email, password string) (models.Users, error) {
	var user models.Users

	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.Users{}, fmt.Errorf("usuário não encontrado")
		}
		return models.Users{}, fmt.Errorf("erro ao buscar usuário: %v", err)
	}

	if user.Password != password {
		return models.Users{}, fmt.Errorf("credenciais inválidas")
	}

	return user, nil
}

func AuthenticateCompany(email, password string) (models.Company, error) {
	var company models.Company

	if err := database.DB.Where("email = ?", email).First(&company).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.Company{}, fmt.Errorf("empresa não encontrada")
		}
		return models.Company{}, fmt.Errorf("erro ao buscar empresa: %v", err)
	}

	if company.Password != password {
		return models.Company{}, fmt.Errorf("credenciais inválidas")
	}

	return company, nil
}
