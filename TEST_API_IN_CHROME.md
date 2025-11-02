# How to Test Backend API in Chrome

## Backend API is Running!

### Test the API:

1. **Open Chrome browser**

2. **Go to Swagger UI:**
   ```
   http://localhost:5000/swagger
   ```
   OR
   ```
   https://localhost:7000/swagger
   ```

3. **You'll see a nice UI with all API endpoints**

### API Endpoints You Can Test:

#### 1. **Auth - Login**
- Try: `POST /api/auth/login`
- Request Body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### 2. **Get All Companies**
- Try: `GET /api/companies`
- Click "Try it out" → "Execute"

#### 3. **Get All Students**
- Try: `GET /api/students`
- Click "Try it out" → "Execute"

#### 4. **Get All Assignments**
- Try: `GET /api/assignments`
- Click "Try it out" → "Execute"

### Test Direct API Calls (Without Swagger):

You can also test in Chrome's address bar or Postman:

1. **Get all companies:**
   ```
   http://localhost:5000/api/companies
   ```

2. **Get all students:**
   ```
   http://localhost:5000/api/students
   ```

3. **Get all assignments:**
   ```
   http://localhost:5000/api/assignments
   ```

### Expected Response Format:

All endpoints return JSON data. For example, Companies endpoint returns:
```json
[
  {
    "companyID": 1,
    "name": "Tech Solutions Inc",
    "area": "Web Development",
    "technologies": "React, Node.js, MongoDB",
    "maxInternships": 10,
    "currentInternships": 2,
    "managerName": "John Manager",
    "isActive": true
  }
]
```

## Important Note:

⚠️ **The database tables don't exist yet!**

You need to run the SQL scripts in SSMS first:

1. Open SQL Server Management Studio
2. Connect to: `DESKTOP-9NTB2JP\SQLEXPRESS`
3. Run: `backend/create_fresh_database.sql`
4. Run: `backend/seed_data.sql`

After that, the API will have data to return!

