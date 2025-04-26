package database

import (
	"backend/internal/models"
	"database/sql"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB    *gorm.DB
	SQLDB *sql.DB
	err   error
)

func ConnectDB() {

	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, name,
	)

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger:      logger.Default.LogMode(logger.Info),
		PrepareStmt: true,
	})
	if err != nil {
		log.Panic("Erro ao conectar com banco de dados")
	}

	SQLDB, err = DB.DB()
	if err != nil {
		log.Panic("Erro ao conectar com banco de dados")
	}
}

func MigrateTables() {
	DB.AutoMigrate(&models.Users{})
	DB.AutoMigrate(&models.Company{})
	DB.AutoMigrate(&models.Category{})
	DB.AutoMigrate(&models.Job{})
	DB.AutoMigrate(&models.JobApplication{})
	DB.AutoMigrate(&models.Document{})
}
