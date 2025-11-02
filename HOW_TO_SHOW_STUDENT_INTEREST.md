# How to Show Students Who Have Shown Interest for Internships

## Complete Step-by-Step Guide

### Prerequisites
1. **Backend API must be running** at `http://localhost:5143`
2. **Database must have Users and Students data**
3. **React Native app must be running**

---

## Part 1: Prepare Student Account in Database

### Option A: Use Existing Database Data

Check if students exist in your database:

```sql
USE InternshipPortalDB;
GO

SELECT * FROM Users WHERE Role = 'Student';
SELECT * FROM Students;
```

If students don't exist or you want fresh data, run the seed script:

### Option B: Add Sample Students

1. **Open SQL Server Management Studio (SSMS)**
2. **Connect to:** `DESKTOP-9NTB2JP\SQLEXPRESS`
3. **Run the seed data script:**
   ```sql
   -- Open file: backend/seed_data.sql
   -- Execute the entire script (Press F5)
   ```

This creates:
- ✅ 4 student users (student, student2, student3, student4)
- ✅ Password for all: `student123`
- ✅ Student profiles linked to users

**Expected Result:** Students exist with `HasShownInterest = 0` (not shown interest yet)

---

## Part 2: Student Shows Interest (Mobile App)

### Step 1: Login as Student
1. Open the React Native app
2. **Username:** `student`
3. **Password:** `student123`
4. Tap **"Login"**

### Step 2: Navigate to Request Internship
- From the Student Dashboard, tap **"Request For Internship"**

### Step 3: View Available Companies
You should see companies like:
- Tech Solutions Inc - Web Development
- Creative Design Studio - UI/UX Design
- Data Analytics Hub - Data Science
- Mobile Apps Ltd - Mobile Development

### Step 4: Show Interest
1. Tap **"Show Interest"** button on any company
2. Wait for the API call to complete
3. You should see: **"Your interest has been registered! Admin will assign you to a company based on availability."**
4. Tap **"OK"** - Returns to Student Dashboard

### Step 5: Verify in Database
Check that the student's status was updated:

```sql
SELECT 
    StudentID,
    Name,
    RegNo,
    HasShownInterest,
    InternshipStatus,
    AssignedCompanyID
FROM Students
WHERE RegNo = 'STU-001';
```

**Expected Result:**
- `HasShownInterest = 1` (true)
- `InternshipStatus = 1` (shown interest)
- `AssignedCompanyID = NULL` (not assigned yet)

---

## Part 3: Admin Sees Students with Interest

### Step 1: Login as Admin
1. From Student Dashboard, tap logout
2. **Username:** `admin`
3. **Password:** `admin123`
4. Tap **"Login"**

### Step 2: Navigate to Assign Student
- From Admin Dashboard, tap **"Assign Student"**

### Step 3: Select a Company
- Scroll horizontally through the available companies
- Tap on a company card to select it (it will highlight in blue)

### Step 4: View Students with Interest
**You should now see students listed below!**

Each student card shows:
- Student Name
- Registration Number (RegNo)
- Technology/Skill

### Step 5: Assign Student
1. Tap the **"Assign"** button on a student
2. Wait for confirmation
3. You should see: **"Student assigned successfully!"**
4. The student list refreshes

### Step 6: Verify Assignment in Database

```sql
SELECT 
    s.StudentID,
    s.Name,
    s.InternshipStatus,
    s.AssignedCompanyID,
    s.AssignedCompanyName,
    c.Name AS CompanyName
FROM Students s
LEFT JOIN Companies c ON s.AssignedCompanyID = c.CompanyID
WHERE s.HasShownInterest = 1;
```

**Expected Result:**
- `InternshipStatus = 2` (assigned)
- `AssignedCompanyID` has a value
- `AssignedCompanyName` is populated

---

## Part 4: Issue Certificates (Optional)

### Step 1: Navigate to Certificates
- From Admin Dashboard, tap **"Certificates"**

### Step 2: View Assigned Students
- Students with `InternshipStatus = 2` (assigned) will appear

### Step 3: Issue Certificate
1. Tap **"Issue Certificate"** button on a student
2. Wait for confirmation
3. You should see: **"Certificate issued successfully!"**
4. Button changes to **"Certified"**

---

## Troubleshooting

### Problem: No students showing in AssignStudentScreen

**Check 1: Verify student exists**
```sql
SELECT * FROM Students WHERE HasShownInterest = 1 AND InternshipStatus = 1;
```

**Check 2: API is working**
- Open browser to `http://localhost:5143/api/students/available`
- Should return JSON array of students

**Check 3: Field name case**
- Make sure backend returned data has PascalCase (Name, UserID, etc.)
- Check browser console for API errors

### Problem: Student can't show interest

**Check 1: User is logged in**
- Verify user context is loaded
- Check auth token exists

**Check 2: API endpoint exists**
- Test in browser: `http://localhost:5143/api/students` should return students

**Check 3: Network connection**
- Android emulator: use `10.0.2.2:5143`
- Physical device: use your computer's IP address

### Problem: Assignment not working

**Check 1: Company has slots**
```sql
SELECT Name, CurrentInternships, MaxInternships 
FROM Companies 
WHERE CompanyID = [company_id];
```

**Check 2: API response**
- Check backend console for PUT request to `/api/students/{id}`
- Should return 204 No Content (success)

---

## Database Query Examples

### Find all students who showed interest
```sql
SELECT 
    s.StudentID,
    s.Name,
    s.RegNo,
    s.HasShownInterest,
    s.InternshipStatus,
    CASE 
        WHEN s.InternshipStatus = 0 THEN 'Not Assigned'
        WHEN s.InternshipStatus = 1 THEN 'Shown Interest'
        WHEN s.InternshipStatus = 2 THEN 'Assigned'
    END AS Status
FROM Students s
WHERE s.HasShownInterest = 1;
```

### Check if assignments were created
```sql
SELECT 
    a.AssignmentID,
    s.Name AS StudentName,
    c.Name AS CompanyName,
    a.Status
FROM Assignments a
INNER JOIN Students s ON a.StudentID = s.StudentID
INNER JOIN Companies c ON a.CompanyID = c.CompanyID;
```

---

## Quick Test Flow

1. **Login as student** → Show interest on any company
2. **Verify in database:** Check Students table
3. **Login as admin** → Go to Assign Student
4. **Select company** → Students with interest should appear
5. **Assign student** → Student is assigned
6. **Go to Certificates** → Issue certificate to assigned student

---

## API Endpoints Used

- `GET /api/students` - Get all students
- `GET /api/students/available` - Get students with interest (InternshipStatus = 1, HasShownInterest = true, not assigned)
- `GET /api/companies` - Get all companies
- `PUT /api/students/{id}` - Update student (show interest)
- `POST /api/assignments` - Create assignment
- `PUT /api/companies/{id}` - Update company slot count

---

## Success Indicators

✅ **Student successfully shows interest:**
- Alert dialog appears
- Database shows `HasShownInterest = 1`
- Database shows `InternshipStatus = 1`

✅ **Admin sees students:**
- Students appear in list below companies
- Company selection works
- Assign button is enabled

✅ **Student assigned successfully:**
- Alert dialog appears
- Database shows `InternshipStatus = 2`
- Database shows `AssignedCompanyID` is set
- Company slot count increases

✅ **Certificate issued:**
- Alert dialog appears
- Database shows `CertificateStatus = 3`
- Button text changes to "Certified"

---

## Next Steps After Setup

1. Add more companies and managers
2. Create more student accounts
3. Track internship progress
4. Generate reports on assignments
5. Send notifications to students




