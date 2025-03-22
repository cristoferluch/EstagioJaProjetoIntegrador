package models

import "gorm.io/gorm"

type CategoryNew struct {
	gorm.Model
	Title string `json:"title"`
}
