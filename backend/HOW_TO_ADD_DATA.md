# How to Add Sample Data to SQL Database

## Step 1: Connect to SQL Server in SSMS

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to: `DESKTOP-9NTB2JP\SQLEXPRESS` (Windows Authentication)
3. Your credentials are shown in the connect dialog

## Step 2: Run the Database Schema First

1. Open file: `backend/database_schema.sql`
2. Execute the entire script in SSMS (Press F5)
3. This creates the database and tables

## Step 3: Add Sample Data

1. Open file: `backend/seed_data.sql`
2. Execute the entire script in SSMS (Press F5)
3. This will insert:
   - ✅ 8 Users (2 admins, 2 managers, 4 students)
   - ✅ 4 Companies
   - ✅ 4 Students with profiles
   - ✅ 3 Active Assignments
   - ✅ 1 Certificate

## What Data Gets Added

### Users Created:
- **admin** / admin123 (Admin)
- **admin2** / admin123 (Admin)
- **manager** / manager123 (Manager)
- **manager2** / manager123 (Manager)
- **student** / student123 (Student - Alex)
- **student2** / student123 (Student - Emma)
- **student3** / student123 (Student - Mike)
- **student4** / student123 (Student - Lisa)

### Companies Created:
1. **Tech Solutions Inc** - Web Development (10 slots, 2 filled)
2. **Creative Design Studio** - UI/UX Design (8 slots, 1 filled)
3. **Data Analytics Hub** - Data Science (6 slots, available)
4. **Mobile Apps Ltd** - Mobile Development (12 slots, 3 filled)

### Students Created:
- Alex Student (STU-001) - Web Development - Assigned
- Emma Wilson (STU-002) - UI/UX Design - Assigned
- Mike Chen (STU-003) - Mobile Development - Assigned
- Lisa Anderson (STU-004) - Data Science - Available

## Verify Data

Run these queries to see the data:

```sql
SELECT * FROM Users;
SELECT * FROM Companies;
SELECT * FROM Students;
SELECT * FROM Assignments;
SELECT * FROM Certificates;
```

## Next Steps

After adding the data:
1. Create Controllers for the backend API
2. Create Services for the backend API
3. Restore API integrations in React Native screens
4. Run the backend API server
5. Run the React Native app
