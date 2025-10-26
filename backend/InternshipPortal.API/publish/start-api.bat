@echo off
echo Starting Published Internship Portal API Server...
echo.

set ASPNETCORE_ENVIRONMENT=Development
echo Environment set to: %ASPNETCORE_ENVIRONMENT%

echo.
echo Starting published API server on http://localhost:7000
echo Swagger UI will be available at: http://localhost:7000/swagger
echo.
echo Default login credentials:
echo Admin: nauman@admin.com / admin123
echo Student: ali@student.com / student123
echo Manager: manager@company.com / manager123
echo.

InternshipPortal.API.exe --urls "http://localhost:7000"

pause

