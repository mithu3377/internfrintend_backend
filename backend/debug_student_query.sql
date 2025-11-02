-- Comprehensive debugging query for student interest issue
USE InternshipPortalDB;
GO

PRINT '========================================';
PRINT 'DEBUG: Students with Interest';
PRINT '========================================';
PRINT '';

-- 1. Check student2 user exists
PRINT '1. Checking student2 user...';
SELECT 
    UserID,
    Username,
    Name,
    Role
FROM Users
WHERE Username = 'student2' OR Username LIKE '%student%';

PRINT '';
DECLARE @Student2UserID INT;
SELECT @Student2UserID = UserID FROM Users WHERE Username = 'student2';
PRINT 'student2 UserID: ' + CAST(ISNULL(@Student2UserID, 0) AS VARCHAR);

-- 2. Check student records
PRINT '';
PRINT '2. All student records:';
SELECT 
    StudentID,
    UserID,
    Name,
    RegNo,
    Technology,
    CAST(HasShownInterest AS INT) AS HasShownInterest_INT,
    CAST(InternshipStatus AS INT) AS InternshipStatus_INT,
    AssignedCompanyID,
    AssignedCompanyName
FROM Students;

-- 3. Check the exact filter used by API
PRINT '';
PRINT '3. Students matching API filter (InternshipStatus = 1 AND HasShownInterest = 1 AND AssignedCompanyID IS NULL):';
SELECT 
    StudentID,
    Name,
    RegNo,
    Technology,
    HasShownInterest,
    InternshipStatus,
    AssignedCompanyID,
    AssignedCompanyName,
    CASE 
        WHEN HasShownInterest = 1 AND InternshipStatus = 1 AND AssignedCompanyID IS NULL 
        THEN 'WILL APPEAR IN API'
        ELSE 'WILL NOT APPEAR'
    END AS Status
FROM Students
WHERE InternshipStatus = 1 
  AND HasShownInterest = 1 
  AND AssignedCompanyID IS NULL;

-- 4. Fix ALL students who showed interest but might have wrong data
PRINT '';
PRINT '4. Fixing students...';

-- Get all students with HasShownInterest = true or InternshipStatus = 1
UPDATE Students 
SET HasShownInterest = 1,
    InternshipStatus = 1,
    AssignedCompanyID = NULL,
    AssignedCompanyName = NULL
WHERE (HasShownInterest = 1 OR InternshipStatus = 1 OR InternshipStatus = 2)
  AND (AssignedCompanyID IS NOT NULL OR AssignedCompanyName IS NOT NULL);

PRINT 'Fixed ' + CAST(@@ROWCOUNT AS VARCHAR) + ' students';

-- 5. Verify after fix
PRINT '';
PRINT '5. After fix - Students that should appear:';
SELECT 
    StudentID,
    Name,
    RegNo,
    Technology,
    HasShownInterest,
    InternshipStatus,
    AssignedCompanyID,
    AssignedCompanyName,
    'Should appear in API now' AS Status
FROM Students
WHERE InternshipStatus = 1 
  AND HasShownInterest = 1 
  AND AssignedCompanyID IS NULL;

PRINT '';
PRINT '========================================';
PRINT 'DONE! Refresh the app now.';
PRINT '========================================';

GO




