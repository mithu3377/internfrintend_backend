# Step-by-Step Guide to Complete the Setup

## Current Status ✅
You have `InternshipPortalDB` database in SSMS

## Step 1: Check if Tables Exist

In SSMS:
1. Expand **InternshipPortalDB** (+ sign)
2. Expand **Tables** (+ sign)
3. You should see:
   - dbo.Users
   - dbo.Students
   - dbo.Companies
   - dbo.Assignments
   - dbo.Certificates

## Step 2A: If Tables DON'T Exist Yet

1. Right-click on **InternshipPortalDB** in SSMS
2. Select **New Query**
3. Copy the entire contents of file: `backend/database_schema.sql`
4. Paste into the query window
5. Click **Execute** (or press F5)
6. Wait for "Commands completed successfully"

## Step 2B: If Tables Already Exist

Skip to Step 3 - just add data

## Step 3: Add Sample Data

1. Right-click on **InternshipPortalDB** in SSMS
2. Select **New Query**
3. Copy the entire contents of file: `backend/seed_data.sql`
4. Paste into the query window
5. Click **Execute** (or press F5)
6. Wait for "Commands completed successfully"

## Step 4: Verify Data

Run this query to see all data:
```sql
USE InternshipPortalDB;
GO

SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL
SELECT 'Students', COUNT(*) FROM Students
UNION ALL
SELECT 'Companies', COUNT(*) FROM Companies
UNION ALL
SELECT 'Assignments', COUNT(*) FROM Assignments
UNION ALL
SELECT 'Certificates', COUNT(*) FROM Certificates;
```

You should see:
- Users: 8 records
- Students: 4 records
- Companies: 4 records
- Assignments: 3 records
- Certificates: 1 record

## Step 5: Start the Backend API

Open a NEW terminal in VS Code or PowerShell:

```bash
cd internfrontend-main/internfrontend-main/backend/InternshipPortal.API
dotnet restore
dotnet run
```

The API will start on: `http://localhost:5000` or `https://localhost:7000`

## Step 6: Start the React Native App

Open ANOTHER terminal:

```bash
cd internfrontend-main/internfrontend-main
npm start
```

Then in a third terminal:
```bash
npm run android
```

## Summary Checklist

- [ ] Check if tables exist in InternshipPortalDB
- [ ] Run database_schema.sql if tables don't exist
- [ ] Run seed_data.sql to add data
- [ ] Verify data with SELECT queries
- [ ] Start backend API (dotnet run)
- [ ] Start React Native app (npm start + npm run android)

