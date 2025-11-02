# How to Run Backend on Swagger

## ✅ Prerequisites

1. **SQL Server** - Ensure SQL Server is running
2. **.NET SDK** - Install .NET 8.0 SDK if not already installed
3. **Database Setup** - Run the database setup scripts

---

## 🚀 Step-by-Step Instructions

### Step 1: Setup the Database

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to: `DESKTOP-9NTB2JP\SQLEXPRESS` (or your SQL Server instance)
3. Run these SQL scripts in order:
   - `backend/database_schema.sql` - Creates database and tables
   - `backend/seed_data.sql` - Adds sample data

### Step 2: Navigate to Backend Directory

Open PowerShell or Command Prompt and navigate to:

```powershell
cd "C:\Users\Ali Haider\internfrontend-main\internfrontend-main\backend"
```

### Step 3: Run the API

**Option A: Using the Batch File (Easiest)**

Double-click on:
```
backend\start-api.bat
```

**Option B: Using Command Line**

```powershell
cd InternshipPortal.API
dotnet run
```

**Option C: Using Swagger Profile**

```powershell
cd InternshipPortal.API
dotnet run --launch-profile http
```

### Step 4: Access Swagger UI

Once the API is running, you'll see output like:

```
Now listening on: http://localhost:5143
```

Open your browser and go to:

```
http://localhost:5143/swagger
```

**Note:** The actual port may vary. After running `dotnet run`, look for the message:
```
Now listening on: http://localhost:[PORT]
```

Use that port in the Swagger URL.

---

## 🎯 Available API Endpoints

### 1. **Auth Controller** (`/api/auth`)
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/users` - Get all users

### 2. **Companies Controller** (`/api/companies`)
- `GET /api/companies` - Get all companies
- `GET /api/companies/{id}` - Get company by ID
- `GET /api/companies/manager/{managerId}` - Get companies by manager
- `POST /api/companies` - Create new company
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company

### 3. **Students Controller** (`/api/students`)
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `GET /api/students/user/{userId}` - Get student by user ID
- `GET /api/students/available` - Get available students
- `POST /api/students` - Create new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### 4. **Assignments Controller** (`/api/assignments`)
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/{id}` - Get assignment by ID
- `GET /api/assignments/student/{studentId}` - Get assignments by student
- `GET /api/assignments/company/{companyId}` - Get assignments by company
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/{id}` - Update assignment
- `DELETE /api/assignments/{id}` - Delete assignment

### 5. **Certificates Controller** (`/api/certificates`)
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/{id}` - Get certificate by ID
- `GET /api/certificates/student/{studentId}` - Get certificates by student
- `GET /api/certificates/company/{companyId}` - Get certificates by company
- `POST /api/certificates` - Create new certificate
- `PUT /api/certificates/{id}` - Update certificate
- `DELETE /api/certificates/{id}` - Delete certificate

---

## 📝 How to Test in Swagger UI

### Example: Test Login Endpoint

1. Open Swagger UI at `http://localhost:5143/swagger`
2. Find **POST /api/auth/login**
3. Click **"Try it out"**
4. Enter sample data:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
5. Click **"Execute"**
6. View the response!

### Example: Get All Companies

1. Find **GET /api/companies**
2. Click **"Try it out"**
3. Click **"Execute"**
4. You'll see all companies listed!

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to SQL Server"

**Solution:**
1. Check SQL Server is running
2. Verify connection string in `backend/InternshipPortal.API/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=DESKTOP-9NTB2JP\\SQLEXPRESS;Database=InternshipPortalDB;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True"
}
```

### Issue: Database doesn't exist

**Solution:**
1. Run `backend/database_schema.sql` in SSMS
2. Then run `backend/seed_data.sql` for sample data

### Issue: Port already in use

**Solution:**
Edit `backend/InternshipPortal.API/Properties/launchSettings.json` and change the port:
```json
"applicationUrl": "http://localhost:5000"
```

### Issue: Empty responses []

**Solution:**
- Database tables don't exist yet - run the SQL setup scripts
- Or add data manually through Swagger UI

---

## 🎉 Success Indicators

✅ When you see this in the console:
```
Now listening on: http://localhost:5143
```

✅ When Swagger UI opens and shows all controllers

✅ When you can execute endpoints and see data

---

## 📂 Project Structure

```
backend/
├── InternshipPortal.API/
│   ├── Controllers/       ✅ (5 controllers)
│   ├── Models/            ✅ (5 models)
│   ├── Data/              ✅ (DbContext)
│   ├── Program.cs          ✅ (API configuration)
│   └── appsettings.json   ✅ (Connection string)
├── database_schema.sql     ✅ (Database setup)
├── seed_data.sql          ✅ (Sample data)
└── start-api.bat          ✅ (Easy runner)
```

---

## 🚀 Quick Start (Copy-Paste Ready)

```powershell
# 1. Navigate to backend
cd "C:\Users\Ali Haider\internfrontend-main\internfrontend-main\backend"

# 2. Run the API
.\start-api.bat

# 3. Open browser to:
# http://localhost:5143/swagger
```

---

**🎯 You're all set! Happy API testing!**

