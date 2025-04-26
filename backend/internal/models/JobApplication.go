package models

import (
	"time"

	"gorm.io/gorm"
)

type JobApplication struct {
	gorm.Model
	UserId    uint      `json:"user_id"`
	JobId     uint      `json:"job_id"`
	AppliedAt time.Time `json:"applied_at"`
	Status    string    `json:"status"`
	User      Users     `json:"user" gorm:"foreignKey:UserId"`
	Job       Job       `json:"job" gorm:"foreignKey:JobId"`
}
