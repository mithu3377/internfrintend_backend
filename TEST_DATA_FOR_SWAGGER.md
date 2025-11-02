# Test Data for Swagger API Testing

## ✅ Backend Running Status
- **URL**: http://localhost:5143/swagger
- **Status**: Running in Development mode
- **Database**: InternshipPortalDB

---

## 🔐 Test Login Credentials

### Admin Login
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Manager Login
```json
{
  "username": "manager",
  "password": "manager123"
}
```

### Student Login
```json
{
  "username": "student",
  "password": "student123"
}
```

---

## 📝 Sample Data for Testing

### 1. Login Test (POST /api/auth/login)

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response:**
```json
{
  "user": {
    "userID": 1,
    "username": "admin",
    "role": "Admin",
    "email": "admin@portal.com",
    "name": "Administrator"
  },
  "token": "dummy-token"
}
```

---

### 2. Register New User (POST /api/auth/register)

**⚠️ Important**: Role must be exactly one of: `"Admin"`, `"Student"`, or `"Manager"` (case-sensitive)

**Example 1 - Register as Student:**
```json
{
  "username": "newstudent",
  "password": "password123",
  "role": "Student",
  "email": "newstudent@example.com",
  "name": "New Student"
}
```

**Example 2 - Register as Manager:**
```json
{
  "username": "newmanager",
  "password": "password123",
  "role": "Manager",
  "email": "manager@example.com",
  "name": "New Manager"
}
```

**✅ Correct Roles (will work):**
- `"Admin"`
- `"Student"`
- `"Manager"`

**❌ Wrong Roles (will fail):**
- `"admin"` (lowercase)
- `"student"` (lowercase)
- `"STUDENT"` (all caps)
- `"Teacher"` (not in allowed list)
- `"Admin"` (extra spaces)

---

### 3. Get All Users (GET /api/auth/users)

No parameters needed. Returns all users in the database.

---

### 4. Get All Companies (GET /api/companies)

No parameters needed. Should return companies like:
```json
[
  {
    "companyID": 1,
    "name": "Tech Solutions Inc",
    "area": "Web Development",
    "technologies": "React, Node.js, MongoDB, Express",
    "maxInternships": 10,
    "currentInternships": 2,
    "isActive": true
  },
  {
    "companyID": 2,
    "name": "Creative Design Studio",
    "area": "UI/UX Design",
    "technologies": "Figma, Adobe XD, Sketch, InVision",
    "maxInternships": 8,
    "currentInternships": 1,
    "isActive": true
  }
]
```

---

### 5. Create Company (POST /api/companies)

```json
{
  "name": "My New Company",
  "area": "Software Development",
  "technologies": "React, TypeScript, .NET",
  "maxInternships": 5,
  "managerID": 2,
  "managerName": "John Doe",
  "managerEmail": "john@company.com",
  "isActive": true
}
```

---

### 6. Get All Students (GET /api/students)

Returns all students including their internship status.

---

### 7. Create Student (POST /api/students)

```json
{
  "userID": 5,
  "name": "John Doe",
  "regNo": "STU-005",
  "technology": "Machine Learning",
  "hasShownInterest": true,
  "internshipStatus": 0,
  "certificateStatus": 1
}
```

---

### 8. Get All Assignments (GET /api/assignments)

Returns all internship assignments.

---

### 9. Create Assignment (POST /api/assignments)

```json
{
  "studentID": 1,
  "companyID": 1,
  "studentName": "Alex Student",
  "companyName": "Tech Solutions Inc",
  "startDate": "2025-01-01T00:00:00",
  "endDate": "2025-04-01T00:00:00",
  "status": 1,
  "progress": 0,
  "certificateIssued": false
}
```

---

### 10. Get All Certificates (GET /api/certificates)

Returns all certificates issued.

---

## 🧪 Step-by-Step Testing Guide

### Test 1: Login (Most Common)
1. Go to **POST /api/auth/login**
2. Click **"Try it out"**
3. Paste the request body above
4. Click **"Execute"**
5. Should return user data and token

### Test 2: Get All Companies
1. Go to **GET /api/companies**
2. Click **"Try it out"**
3. Click **"Execute"**
4. Should return array of companies

### Test 3: Register User
1. Go to **POST /api/auth/register**
2. Click **"Try it out"**
3. Use one of the sample request bodies
4. **IMPORTANT**: Make sure role is exactly "Admin", "Student", or "Manager"
5. Click **"Execute"**

---

## ⚠️ Common Errors

### Error: "The INSERT statement conflicted with the CHECK constraint"
**Cause**: Role value doesn't match allowed values
**Solution**: Use exactly `"Admin"`, `"Student"`, or `"Manager"` (capital letters)

### Error: "Invalid username or password"
**Cause**: Wrong credentials or user doesn't exist
**Solution**: Use the test credentials provided above

---

## 📊 Database Seed Data

If you want to add more test data, run these SQL scripts in SSMS:

1. **Database Schema**: `backend/database_schema.sql`
2. **Seed Data**: `backend/seed_data.sql`

---

## 🎯 Quick Test Commands

### Get All Users
```bash
GET http://localhost:5143/api/auth/users
```

### Get All Companies
```bash
GET http://localhost:5143/api/companies
```

### Get All Students
```bash
GET http://localhost:5143/api/students
```

---

**Happy Testing! 🚀**


