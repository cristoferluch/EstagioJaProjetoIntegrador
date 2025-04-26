package models

import "gorm.io/gorm"

type Job struct {
	gorm.Model
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Salary      float64  `json:"salary"`
	CompanyId   uint     `json:"company_id"`
	CategoryId  uint     `json:"category_id"`
	Category    Category `json:"category" gorm:"foreignKey:CategoryId"`
	Company     Company  `json:"company" gorm:"foreignKey:CompanyId"`
}

type JobResponse struct {
	ID            uint    `json:"id"`
	Title         string  `json:"title"`
	Description   string  `json:"description"`
	Salary        float64 `json:"salary"`
	CompanyName   string  `json:"company_name"`
	CategoryTitle string  `json:"category_title"`
	CompanyId     uint    `json:"company_id"`
	CategoryId    uint    `json:"category_id"`
}
