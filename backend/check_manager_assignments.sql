-- Check Manager Assignments and Company Data
USE InternshipPortalDB;
GO

PRINT '=== Checking Manager-Company Relationships ===';
PRINT '';

-- 1. Check all managers
PRINT '1. All Managers:';
SELECT 
    UserID,
    Username,
    Name,
    Role
FROM Users
WHERE Role = 'Manager';

PRINT '';
DECLARE @ManagerUserID INT;
SELECT @ManagerUserID = UserID FROM Users WHERE Username = 'manager';
PRINT 'Manager user ID: ' + CAST(ISNULL(@ManagerUserID, 0) AS VARCHAR);

-- 2. Check manager's companies
PRINT '';
PRINT '2. Manager Companies:';
SELECT 
    c.CompanyID,
    c.Name,
    c.Area,
    c.ManagerID,
    c.ManagerName,
    c.CurrentInternships,
    c.MaxInternships
FROM Companies c
WHERE c.ManagerID = @ManagerUserID;

PRINT '';
DECLARE @CompanyID INT;
SELECT @CompanyID = CompanyID FROM Companies WHERE ManagerID = @ManagerUserID;
PRINT 'Company ID for manager: ' + CAST(ISNULL(@CompanyID, 0) AS VARCHAR);

-- 3. Check all assignments
PRINT '';
PRINT '3. All Assignments:';
SELECT 
    a.AssignmentID,
    a.StudentID,
    a.CompanyID,
    a.StudentName,
    a.CompanyName,
    a.Status,
    a.Progress,
    a.CertificateIssued
FROM Assignments a;

-- 4. Check assignments for manager's company
PRINT '';
PRINT '4. Assignments for Manager Company:';
SELECT 
    a.AssignmentID,
    a.StudentID,
    a.CompanyID,
    a.StudentName,
    a.CompanyName,
    a.Status,
    a.Progress,
    a.CertificateIssued
FROM Assignments a
WHERE a.CompanyID = @CompanyID;

-- 5. Check students assigned to manager's company
PRINT '';
PRINT '5. Students Assigned to Manager Company:';
SELECT 
    s.StudentID,
    s.Name,
    s.RegNo,
    s.AssignedCompanyID,
    s.AssignedCompanyName
FROM Students s
WHERE s.AssignedCompanyID = @CompanyID;

PRINT '';
PRINT '========================================';
PRINT 'SUMMARY:';
PRINT '========================================';

DECLARE @AssignmentCount INT;
SELECT @AssignmentCount = COUNT(*) FROM Assignments WHERE CompanyID = @CompanyID;
PRINT 'Total assignments for manager company: ' + CAST(@AssignmentCount AS VARCHAR);

IF @AssignmentCount = 0
BEGIN
    PRINT '';
    PRINT '⚠️ NO ASSIGNMENTS FOUND!';
    PRINT 'Run: backend/create_test_assignment.sql to create test data';
END

-- Show what should appear in the app
PRINT '';
PRINT 'Expected to see in CheckProgressScreen:';
IF @AssignmentCount > 0
BEGIN
    SELECT 
        a.StudentName AS 'Student Name',
        a.CompanyName AS 'Company Name',
        CASE 
            WHEN a.Status = 1 THEN 'Assigned'
            WHEN a.Status = 2 THEN 'In Progress'
            WHEN a.Status = 3 THEN 'Completed'
        END AS Status,
        CAST(ISNULL(a.Progress, 0) AS VARCHAR) + '%' AS Progress
    FROM Assignments a
    WHERE a.CompanyID = @CompanyID;
END
ELSE
BEGIN
    PRINT 'No assignments - screen will show "No active interns"';
END

GO




