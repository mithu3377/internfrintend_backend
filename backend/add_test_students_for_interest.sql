-- Add Test Students Who Have Shown Interest (But Not Yet Assigned)
-- This allows testing the full flow: Show Interest → Assign → Certify

USE InternshipPortalDB;
GO

PRINT 'Adding test students for showing interest...';

-- Get the User IDs for students
DECLARE @StudentUserID INT, @Student2UserID INT, @Student3UserID INT;

SELECT @StudentUserID = UserID FROM Users WHERE Username = 'student';
SELECT @Student2UserID = UserID FROM Users WHERE Username = 'student2';
SELECT @Student3UserID = UserID FROM Users WHERE Username = 'student3';

-- Check if students already exist, if not create them
IF NOT EXISTS (SELECT * FROM Students WHERE RegNo = '2021-Arid-4566')
BEGIN
    INSERT INTO Students (UserID, Name, RegNo, Technology, HasShownInterest, InternshipStatus, CertificateStatus)
    VALUES (@StudentUserID, 'Qadis Parvez', '2021-Arid-4566', 'Flutter', 0, 0, 1);
    PRINT 'Created student: Qadis Parvez';
END

-- Update student to show interest (for testing)
IF EXISTS (SELECT * FROM Students WHERE RegNo = '2021-Arid-4566')
BEGIN
    UPDATE Students 
    SET HasShownInterest = 1, 
        InternshipStatus = 1  -- 1 = Shown Interest
    WHERE RegNo = '2021-Arid-4566';
    PRINT 'Updated: Qadis Parvez - Has shown interest';
END

-- Add more test students
IF NOT EXISTS (SELECT * FROM Students WHERE RegNo = '2021-Arid-4404')
BEGIN
    INSERT INTO Students (UserID, Name, RegNo, Technology, HasShownInterest, InternshipStatus, CertificateStatus)
    VALUES (@Student2UserID, 'Ali Haider', '2021-Arid-4404', 'React Native', 1, 1, 1);
    PRINT 'Created student: Ali Haider (with interest)';
END

IF NOT EXISTS (SELECT * FROM Students WHERE RegNo = '2020-Arid-0126')
BEGIN
    INSERT INTO Students (UserID, Name, RegNo, Technology, HasShownInterest, InternshipStatus, CertificateStatus)
    VALUES (@Student3UserID, 'Daud Ansar', '2020-Arid-0126', 'React JS', 1, 1, 1);
    PRINT 'Created student: Daud Ansar (with interest)';
END

-- Show all students with their status
PRINT '';
PRINT '=== Students Status ===';
SELECT 
    Name,
    RegNo,
    Technology,
    CASE WHEN HasShownInterest = 1 THEN 'Yes' ELSE 'No' END AS HasShownInterest,
    CASE 
        WHEN InternshipStatus = 0 THEN 'Not Assigned'
        WHEN InternshipStatus = 1 THEN 'Shown Interest (Available)'
        WHEN InternshipStatus = 2 THEN 'Assigned'
    END AS Status,
    AssignedCompanyName
FROM Students
ORDER BY InternshipStatus DESC, Name;

PRINT '';
PRINT 'Test Students Ready:';
PRINT '1. Qadis Parvez (2021-Arid-4566) - Has shown interest';
PRINT '2. Ali Haider (2021-Arid-4404) - Has shown interest';
PRINT '3. Daud Ansar (2020-Arid-0126) - Has shown interest';
PRINT '';
PRINT 'Now Admin can assign these students in the app!';




