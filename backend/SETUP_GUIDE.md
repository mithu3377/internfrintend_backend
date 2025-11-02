# .NET Core Backend Setup Guide

## Step 1: Create Database in SSMS

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your server: `DESKTOP-9NTB2JP\SQLEXPRESS`
3. Open the file: `backend/database_schema.sql`
4. Execute the entire script in SSMS
5. Verify the database `InternshipPortalDB` is created

## Step 2: Setup .NET Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Restore packages:
```bash
cd InternshipPortal.API
dotnet restore
```

3. Update the connection string in `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=DESKTOP-9NTB2JP\\SQLEXPRESS;Database=InternshipPortalDB;Trusted_Connection=True;MultipleActiveResultSets=True;TrustServerCertificate=True"
  }
}
```

4. Run the API server:
```bash
dotnet run
```

The API will start on `https://localhost:7000` or `http://localhost:5000`

## Step 3: Setup React Native Frontend

1. Update API URL in `src/services/ApiService.js`:
```javascript
const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android Emulator
// or
const API_BASE_URL = 'http://localhost:5000/api'; // iOS Simulator
```

2. Run the React Native app:
```bash
npm start
npm run android  # or npm run ios
```

## API Endpoints Structure

- **Users**: `/api/users`
- **Students**: `/api/students`
- **Companies**: `/api/companies`
- **Assignments**: `/api/assignments`
- **Certificates**: `/api/certificates`

## Default Credentials

- **Admin**: Username: `admin`, Password: `admin123`
- **Student**: Username: `student`, Password: `student123`
- **Manager**: Username: `manager`, Password: `manager123`

