-- Check student2's data to see why they're not showing up
USE InternshipPortalDB;
GO

PRINT '=== Checking student2 data ===';

-- Find the student2 user
SELECT 
    u.UserID,
    u.Username,
    u.Name,
    u.Role
FROM Users u
WHERE u.Username = 'student2';

-- Get the student record
DECLARE @Student2UserID INT;
SELECT @Student2UserID = UserID FROM Users WHERE Username = 'student2';

SELECT 
    s.StudentID,
    s.Name,
    s.RegNo,
    s.HasShownInterest,
    s.InternshipStatus,
    s.AssignedCompanyID,
    s.AssignedCompanyName,
    CASE 
        WHEN s.InternshipStatus = 0 THEN 'Not Assigned'
        WHEN s.InternshipStatus = 1 THEN 'Shown Interest'
        WHEN s.InternshipStatus = 2 THEN 'Assigned'
    END AS Status
FROM Students s
WHERE s.UserID = @Student2UserID;

PRINT '';
PRINT '=== All students who showed interest ===';

SELECT 
    s.StudentID,
    s.Name,
    s.RegNo,
    s.HasShownInterest,
    s.InternshipStatus,
    s.AssignedCompanyID,
    CASE WHEN s.HasShownInterest = 1 THEN 'Yes' ELSE 'No' END AS HasShownInterestBool,
    CASE 
        WHEN s.InternshipStatus = 0 THEN 'Not Assigned'
        WHEN s.InternshipStatus = 1 THEN 'Shown Interest'
        WHEN s.InternshipStatus = 2 THEN 'Assigned'
    END AS Status
FROM Students s
ORDER BY s.InternshipStatus DESC;

PRINT '';
PRINT '=== Students matching available filter ===';
PRINT 'Filter: InternshipStatus = 1 AND HasShownInterest = 1 AND AssignedCompanyID is NULL';

SELECT 
    s.StudentID,
    s.Name,
    s.RegNo,
    s.HasShownInterest,
    s.InternshipStatus,
    s.AssignedCompanyID,
    CASE 
        WHEN s.HasShownInterest = 1 AND s.InternshipStatus = 1 AND s.AssignedCompanyID IS NULL 
        THEN '✅ Available for Assignment'
        ELSE '❌ Not Available'
    END AS Availability
FROM Students s
WHERE s.InternshipStatus = 1 AND s.HasShownInterest = 1 AND s.AssignedCompanyID IS NULL;

GO




