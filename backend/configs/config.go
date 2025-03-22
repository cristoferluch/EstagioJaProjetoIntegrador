package configs

import (
	"fmt"
	"log"
	"os"

	"github.com/BurntSushi/toml"
)

type Settings struct {
	Database struct {
		DB_HOST     string
		DB_USER     string
		DB_PASSWORD string
		DB_NAME     string
		DB_PORT     int
	}
	JWT struct {
		JWT_KEY string
	}
}

func SetLocalVariables() {
	var settings Settings

	if _, err := toml.DecodeFile("settings.toml", &settings); err != nil {
		log.Fatal(err)
	}

	os.Setenv("DB_HOST", settings.Database.DB_HOST)
	os.Setenv("DB_USER", settings.Database.DB_USER)
	os.Setenv("DB_PASSWORD", settings.Database.DB_PASSWORD)
	os.Setenv("DB_NAME", settings.Database.DB_NAME)
	os.Setenv("DB_PORT", fmt.Sprintf("%d", settings.Database.DB_PORT))
	os.Setenv("JWT_KEY", settings.JWT.JWT_KEY)

}
