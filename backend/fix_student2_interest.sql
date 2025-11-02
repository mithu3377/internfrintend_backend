-- Fix student2 to show interest properly
USE InternshipPortalDB;
GO

PRINT 'Fixing student2 interest data...';

-- Get the User ID for student2
DECLARE @Student2UserID INT;
SELECT @Student2UserID = UserID FROM Users WHERE Username = 'student2';

IF @Student2UserID IS NULL
BEGIN
    PRINT 'ERROR: student2 user not found!';
    PRINT 'Creating student2 user...';
    
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('student2', 'student123', 'Student', 'student2@university.com', 'Ali Haider');
    
    SET @Student2UserID = SCOPE_IDENTITY();
    PRINT 'Created user with ID: ' + CAST(@Student2UserID AS VARCHAR);
END

-- Check if student record exists
DECLARE @StudentID INT;
SELECT @StudentID = StudentID FROM Students WHERE UserID = @Student2UserID;

IF @StudentID IS NULL
BEGIN
    PRINT 'Student record does not exist. Creating...';
    INSERT INTO Students (UserID, Name, RegNo, Technology, HasShownInterest, InternshipStatus, CertificateStatus)
    VALUES (@Student2UserID, 'Ali Haider', '2021-Arid-4404', 'React Native', 1, 1, 1);
    
    SET @StudentID = SCOPE_IDENTITY();
    PRINT 'Created student with ID: ' + CAST(@StudentID AS VARCHAR);
END
ELSE
BEGIN
    PRINT 'Updating existing student record...';
    -- Update student to show interest and make available for assignment
    UPDATE Students 
    SET HasShownInterest = 1,
        InternshipStatus = 1,
        AssignedCompanyID = NULL,
        AssignedCompanyName = NULL
    WHERE StudentID = @StudentID;
    
    PRINT 'Updated student record';
END

PRINT '';
PRINT '=== Current student2 status ===';
SELECT 
    s.StudentID,
    s.Name,
    s.RegNo,
    s.HasShownInterest,
    s.InternshipStatus,
    s.AssignedCompanyID,
    s.AssignedCompanyName,
    CASE 
        WHEN s.HasShownInterest = 1 AND s.InternshipStatus = 1 AND s.AssignedCompanyID IS NULL 
        THEN '✅ WILL APPEAR IN LIST'
        ELSE '❌ WILL NOT APPEAR'
    END AS Status
FROM Students s
WHERE s.UserID = @Student2UserID;

PRINT '';
PRINT '=== All available students ===';
SELECT 
    s.StudentID,
    s.Name,
    s.RegNo,
    CASE WHEN s.HasShownInterest = 1 THEN 'Yes' ELSE 'No' END AS HasShownInterest,
    CASE 
        WHEN s.InternshipStatus = 0 THEN 'Not Assigned'
        WHEN s.InternshipStatus = 1 THEN 'Shown Interest'
        WHEN s.InternshipStatus = 2 THEN 'Assigned'
    END AS InternshipStatus,
    s.AssignedCompanyID,
    CASE 
        WHEN s.HasShownInterest = 1 AND s.InternshipStatus = 1 AND s.AssignedCompanyID IS NULL 
        THEN '✅ Available'
        ELSE '❌ Not Available'
    END AS AvailableForAssignment
FROM Students s
ORDER BY s.StudentID;

PRINT '';
PRINT 'student2 is now ready to appear in Assign Student screen!';

GO




