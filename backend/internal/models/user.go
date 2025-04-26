package models

import "gorm.io/gorm"

type Users struct {
	gorm.Model
	Name       string `json:"name"`
	LastName   string `json:"last_name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Phone      string `json:"phone"`
	CPF        string `json:"cpf"`
	State      string `json:"state"`
	City       string `json:"city"`
	Street     string `json:"street"`
	PostalCode string `json:"postal_code"`
	District   string `json:"district"`
	Number     int    `json:"number"`
	Gender     int    `json:"gender"`
	BirthDate  string `json:"birth_date"`
}
