package setup

import (
	"backend/configs"
	"backend/database"
	"backend/routes"
)

func SetupServer() error {

	configs.SetLocalVariables()

	database.ConnectDB()

	//database.MigrateTables()

	routes.HandleRequests()

	return nil
}
