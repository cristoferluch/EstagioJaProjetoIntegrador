package utils

import "github.com/dgrijalva/jwt-go"

type Claims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.StandardClaims
}
