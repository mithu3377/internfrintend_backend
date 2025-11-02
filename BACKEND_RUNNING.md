# ✅ Backend API Server is NOW RUNNING!

## Backend Status: ACTIVE

### Database Connection:
- **Database Name**: `InternshipPortalDB`
- **Server**: `DESKTOP-9NTB2JP\SQLEXPRESS`
- **Connection String**: Configured in `appsettings.json`

### API Server:
- **Status**: Running in background
- **URL**: `http://localhost:5000` or `https://localhost:7000`
- **Swagger UI**: Available at `http://localhost:5000/swagger`

### API Endpoints Available:

#### Auth Controller
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/users` - Get all users

#### Companies Controller
- `GET /api/companies` - Get all companies
- `GET /api/companies/{id}` - Get company by ID
- `GET /api/companies/manager/{managerId}` - Get companies by manager
- `POST /api/companies` - Create company
- `PUT /api/companies/{id}` - Update company
- `DELETE /api/companies/{id}` - Delete company

#### Students Controller
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `GET /api/students/user/{userId}` - Get student by user ID
- `GET /api/students/available` - Get available students
- `POST /api/students` - Create student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

#### Assignments Controller
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/{id}` - Get assignment by ID
- `GET /api/assignments/student/{studentId}` - Get assignments by student
- `GET /api/assignments/company/{companyId}` - Get assignments by company
- `POST /api/assignments` - Create assignment
- `PUT /api/assignments/{id}` - Update assignment
- `DELETE /api/assignments/{id}` - Delete assignment

#### Certificates Controller
- `GET /api/certificates` - Get all certificates
- `GET /api/certificates/{id}` - Get certificate by ID
- `GET /api/certificates/student/{studentId}` - Get certificates by student
- `GET /api/certificates/company/{companyId}` - Get certificates by company
- `POST /api/certificates` - Create certificate
- `PUT /api/certificates/{id}` - Update certificate
- `DELETE /api/certificates/{id}` - Delete certificate

## ⚠️ Important Note:

The API is running BUT you still need to:
1. **Create the database tables in SSMS** (run `create_fresh_database.sql`)
2. **Add sample data** (run `seed_data.sql`)
3. The database currently doesn't have tables yet!

## Next Steps:

1. In SSMS, connect to `DESKTOP-9NTB2JP\SQLEXPRESS`
2. Run `backend/create_fresh_database.sql` to create tables
3. Run `backend/seed_data.sql` to add sample data
4. The backend API will then have data to work with!

## Test the API:

Open browser and go to: `http://localhost:5000/swagger`

You'll see the Swagger UI with all API endpoints!

