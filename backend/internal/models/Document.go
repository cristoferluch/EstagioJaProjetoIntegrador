package models

import "gorm.io/gorm"

type Document struct {
	gorm.Model
	UserID       uint   `json:"user_id"`
	FileName     string `json:"file_name"`
	FileType     string `json:"file_type"`
	FileData     []byte `json:"-" gorm:"type:bytea"`
	DocumentType string `json:"document_type"`
}
