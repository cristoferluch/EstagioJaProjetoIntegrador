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

func AuthenticateUser(email, password string) (models.UsersNew, error) {
	var user models.UsersNew

	if err := database.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.UsersNew{}, fmt.Errorf("usuário não encontrado")
		}
		return models.UsersNew{}, fmt.Errorf("erro ao buscar usuário: %v", err)
	}

	if user.Password != password {
		return models.UsersNew{}, fmt.Errorf("credenciais inválidas")
	}

	return user, nil
}

func AuthenticateCompany(email, password string) (models.CompanyNew, error) {
	var company models.CompanyNew

	if err := database.DB.Where("email = ?", email).First(&company).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return models.CompanyNew{}, fmt.Errorf("empresa não encontrada")
		}
		return models.CompanyNew{}, fmt.Errorf("erro ao buscar empresa: %v", err)
	}

	if company.Password != password {
		return models.CompanyNew{}, fmt.Errorf("credenciais inválidas")
	}

	return company, nil
}
