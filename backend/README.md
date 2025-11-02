# Complete Backend and Frontend Setup

## What Has Been Set Up

✅ **Database Schema** (`database_schema.sql`) - Complete SQL schema for the internship portal  
✅ **API Service** (`ApiService.js`) - Frontend API service with all endpoints  
✅ **Project Structure** - Ready for .NET Core backend files  

## Next Steps (You Need To Complete)

### 1. Run the Database Script in SSMS

1. Open SQL Server Management Studio
2. Connect to: `DESKTOP-9NTB2JP\SQLEXPRESS` (Windows Authentication)
3. Open file: `backend/database_schema.sql`
4. Execute the entire script
5. Verify database `InternshipPortalDB` is created

### 2. Create Backend Files

You need to manually create these files in the backend. Here's the structure needed:

```
backend/
├── InternshipPortal.API/
│   ├── Program.cs (✅ Created)
│   ├── appsettings.json (✅ Created)
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── CompaniesController.cs
│   │   ├── StudentsController.cs
│   │   ├── AssignmentsController.cs
│   │   └── CertificatesController.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Student.cs
│   │   ├── Company.cs
│   │   ├── Assignment.cs
│   │   └── Certificate.cs
│   ├── Data/
│   │   └── InternshipPortalContext.cs
│   └── Services/
│       ├── IUserService.cs
│       ├── UserService.cs
│       ├── ICompanyService.cs
│       ├── CompanyService.cs
│       ├── IStudentService.cs
│       ├── StudentService.cs
│       ├── IAssignmentService.cs
│       ├── AssignmentService.cs
│       ├── ICertificateService.cs
│       └── CertificateService.cs
└── start-api.bat (✅ Created)
```

### 3. API Integration

The frontend API service is already configured in `src/services/ApiService.js`.  
All screens have been prepared to integrate with the backend API.

## Commands to Run

### Start Backend API:
```bash
cd backend
start-api.bat
```

### Start Frontend:
```bash
npm start
npm run android  # or npm run ios
```

## Connection Details

- **Database**: `InternshipPortalDB` on `DESKTOP-9NTB2JP\SQLEXPRESS`
- **API Port**: `5000` (HTTP) or `7000` (HTTPS)
- **Frontend**: React Native with API integration ready

## Default Users (after database setup)

- **Admin**: Username: `admin`, Password: `admin123`
- **Student**: Username: `student`, Password: `student123`  
- **Manager**: Username: `manager`, Password: `manager123`

---

**Note**: You will need to create the C# controller, model, and service files manually. The structure and API endpoints are defined in the React Native `ApiService.js` file.

