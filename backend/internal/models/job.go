package models

import "gorm.io/gorm"

type JobNew struct {
	gorm.Model
	Title       string      `json:"title"`
	Description string      `json:"description"`
	Salary      float64     `json:"salary"`
	CompanyId   uint        `json:"company_id"`
	CategoryId  uint        `json:"category_id"`
	Category    CategoryNew `json:"category" gorm:"foreignKey:CategoryId"`
	Company     CompanyNew  `json:"company" gorm:"foreignKey:CompanyId"`
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
