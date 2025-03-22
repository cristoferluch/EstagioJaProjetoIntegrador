package routes

import (
	"backend/internal/controllers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func HandleRequests() {
	r := gin.Default()

	r.Use(middleware.CorsMiddleware())

	// Rotas publicas
	publicRoutes := r.Group("/api")
	{
		publicRoutes.POST("/login", controllers.Login)
		publicRoutes.POST("/user", controllers.CreateUser)
		publicRoutes.POST("/company", controllers.CreateCompany)
	}

	// Rotas de usuários (logado)
	userRoutes := r.Group("/api/user")
	userRoutes.Use(middleware.AuthMiddleware())
	userRoutes.Use(middleware.RoleMiddleware("user"))
	{
		userRoutes.GET("/:id", controllers.GetUserById)
		userRoutes.DELETE("/:id", controllers.DeleteUserById)
		userRoutes.PUT("/:id", controllers.UpdateUserById)
	}

	// Rotas de empresas (logada)
	companyRoutes := r.Group("/api/company")
	companyRoutes.Use(middleware.AuthMiddleware())
	companyRoutes.Use(middleware.RoleMiddleware("company"))
	{
		companyRoutes.GET("/:id", controllers.GetCompanyById)
		companyRoutes.DELETE("/:id", controllers.DeleteCompanyById)
		companyRoutes.PUT("/:id", controllers.UpdateCompanyById)
	}

	// Rotas vagas
	jobRoutes := r.Group("/api/job")
	{
		// Rotas públicas
		jobRoutes.GET("/", controllers.GetAllJobs)
		jobRoutes.GET("/:id", controllers.GetJobById)

		// usuários (logado)
		jobRoutes.POST("/:jobId/apply", middleware.AuthMiddleware(), middleware.RoleMiddleware("user"), controllers.ApplyForJob)

		// empresas (logada)
		jobRoutes.POST("/", middleware.AuthMiddleware(), middleware.RoleMiddleware("company"), controllers.CreateJob)
		jobRoutes.PUT("/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware("company"), controllers.UpdateJobById)
		jobRoutes.DELETE("/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware("company"), controllers.DeleteJobById)
	}

	// Rotas de categorias
	categoryRoutes := r.Group("/api/category")
	{
		// Rotas públicas
		categoryRoutes.GET("/", controllers.GetAllCategorys)
		categoryRoutes.GET("/:id", controllers.GetCategoryById)

		// empresas (logada)
		categoryRoutes.POST("/", middleware.AuthMiddleware(), middleware.RoleMiddleware("company"), controllers.CreateCategory)
		categoryRoutes.PUT("/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware("company"), controllers.UpdateCategoryById)
		categoryRoutes.DELETE("/:id", middleware.AuthMiddleware(), middleware.RoleMiddleware("company"), controllers.DeleteCategoryById)
	}

	r.Run(":8080")
}
