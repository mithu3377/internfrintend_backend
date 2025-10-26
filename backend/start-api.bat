@echo off
echo Setting up Internship Portal Backend...

echo.
echo 1. Restoring NuGet packages...
dotnet restore

echo.
echo 2. Building the project...
dotnet build

echo.
echo 3. Running Entity Framework migrations...
dotnet ef database update

echo.
echo 4. Starting the API server...
echo The API will be available at: https://localhost:7000
echo Swagger UI will be available at: https://localhost:7000/swagger
echo.
echo Default admin credentials:
echo Email: admin@internshipportal.com
echo Password: admin123
echo.

dotnet run

pause





