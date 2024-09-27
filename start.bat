@echo off

cd backend
start mvnw spring-boot:run

cd ../frontend
npm start
pause