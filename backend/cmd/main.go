package main

import (
	"backend/cmd/setup"
	"log"
)

func main() {
	log.Println("Started server")

	err := setup.SetupServer()

	if err != nil {
		log.Println("Server failed", "error", err)
		panic(err)
	}
}
