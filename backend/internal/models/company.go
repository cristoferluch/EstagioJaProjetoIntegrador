package models

import "gorm.io/gorm"

type CompanyNew struct {
	gorm.Model
	Name       string `json:"name"`
	Email      string `json:"email"`
	Password   string `json:"password"`
	Phone      string `json:"phone"`
	CNPJ       string `json:"cnpj"`
	State      string `json:"state"`
	City       string `json:"city"`
	Street     string `json:"street"`
	PostalCode string `json:"postal_code"`
	District   string `json:"district"`
	Number     int    `json:"number"`
}
