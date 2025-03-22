package controllers

import (
	"backend/internal/service"
	"backend/utils"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

var jwtKey = []byte(os.Getenv("JWT_KEY"))

func Login(c *gin.Context) {
	var credentials struct {
		Email     string `json:"email"`
		Password  string `json:"password"`
		IsCompany bool   `json:"is_company"`
	}

	if err := c.ShouldBindJSON(&credentials); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Dados inválidos",
		})
		return
	}

	var id uint
	var role string

	if credentials.IsCompany {

		company, err := service.AuthenticateCompany(credentials.Email, credentials.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Credenciais inválidas",
			})
			return
		}
		id = company.ID
		role = "company"
	} else {

		user, err := service.AuthenticateUser(credentials.Email, credentials.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Credenciais inválidas",
			})
			return
		}
		id = user.ID
		role = "user"
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &utils.Claims{
		UserID: id,
		Role:   role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		log.Println("ERRO NewWithClaims: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Erro ao gerar o token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"id":    id,
	})
}
