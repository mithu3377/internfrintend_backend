# Test Student Visibility After SQL Fix

## Step 1: Run the Debug Script

Open SQL Server Management Studio and run:
```
backend/debug_student_query.sql
```

This will:
- ✅ Check if student2 exists
- ✅ Show all student records
- ✅ Show students matching the API filter
- ✅ Fix ALL students who have issues
- ✅ Verify the fix worked

## Step 2: Verify in Browser

Test the API directly in your browser:

```
http://localhost:5143/api/students/available
```

**Expected Result:** Should return an array of students in JSON format.

If it returns `[]`, check the database again.

## Step 3: Check the React Native App

1. **Go to the Assign Student screen**
2. **Select "code celix" company**
3. **Check the bottom section** - Should show students now

## Step 4: If Still Not Showing

Check the browser console for:
- API call errors
- Network errors
- Response data

Look for this in console:
```
AssignStudentScreen: Loaded students: [...]
```

## Common Issues

### Issue 1: API Returns Empty Array `[]`

**Solution:**
```sql
-- Run this to see what the API is filtering
SELECT 
    Name,
    HasShownInterest,
    InternshipStatus,
    AssignedCompanyID
FROM Students
WHERE InternshipStatus = 1 
  AND HasShownInterest = 1 
  AND AssignedCompanyID IS NULL;
```

If this returns no rows, students don't meet the criteria.

### Issue 2: API Not Running

Check if backend is running:
- Open: http://localhost:5143/swagger
- Should show Swagger UI

### Issue 3: Wrong User

Make sure you're logged in as the correct user:
- Username should match a user in the database
- User must have a corresponding student record

## Quick Fix Command

If you want to make ALL students appear (testing purpose):

```sql
-- Make all students available (TESTING ONLY)
UPDATE Students 
SET HasShownInterest = 1,
    InternshipStatus = 1,
    AssignedCompanyID = NULL,
    AssignedCompanyName = NULL;

-- Verify
SELECT Name, HasShownInterest, InternshipStatus, AssignedCompanyID FROM Students;
```

## Testing Checklist

- [ ] SQL script ran successfully
- [ ] Browser API call returns students
- [ ] App shows students in Assign Student screen
- [ ] Can select a company
- [ ] Can assign a student




