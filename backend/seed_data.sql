-- Seed Data for Internship Portal Database
USE InternshipPortalDB;
GO

-- Clear existing data (optional - only for testing)
-- DELETE FROM Certificates;
-- DELETE FROM Assignments;
-- DELETE FROM Students;
-- DELETE FROM Companies;
-- DELETE FROM Users WHERE Username NOT IN ('admin', 'student', 'manager');

-- 1. Insert Users
PRINT 'Inserting Users...';

-- Admin Users
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('admin', 'admin123', 'Admin', 'admin@portal.com', 'Administrator');
END

IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin2')
BEGIN
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('admin2', 'admin123', 'Admin', 'admin2@portal.com', 'Secondary Admin');
END

-- Manager Users
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'manager')
BEGIN
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('manager', 'manager123', 'Manager', 'manager@tech.com', 'John Manager');
END

IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'manager2')
BEGIN
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('manager2', 'manager123', 'Manager', 'sarah@design.com', 'Sarah Johnson');
END

-- Student Users
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'student')
BEGIN
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('student', 'student123', 'Student', 'student@university.com', 'Alex Student');
END

IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'student2')
BEGIN
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('student2', 'student123', 'Student', 'emma@university.com', 'Emma Wilson');
END

IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'student3')
BEGIN
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('student3', 'student123', 'Student', 'mike@university.com', 'Mike Chen');
END

IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'student4')
BEGIN
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('student4', 'student123', 'Student', 'lisa@university.com', 'Lisa Anderson');
END

-- Get User IDs for reference
DECLARE @AdminUserID INT, @ManagerUserID INT, @Manager2UserID INT;
DECLARE @StudentUserID INT, @Student2UserID INT, @Student3UserID INT, @Student4UserID INT;

SELECT @AdminUserID = UserID FROM Users WHERE Username = 'admin';
SELECT @ManagerUserID = UserID FROM Users WHERE Username = 'manager';
SELECT @Manager2UserID = UserID FROM Users WHERE Username = 'manager2';
SELECT @StudentUserID = UserID FROM Users WHERE Username = 'student';
SELECT @Student2UserID = UserID FROM Users WHERE Username = 'student2';
SELECT @Student3UserID = UserID FROM Users WHERE Username = 'student3';
SELECT @Student4UserID = UserID FROM Users WHERE Username = 'student4';

-- 2. Insert Companies
PRINT 'Inserting Companies...';

IF NOT EXISTS (SELECT * FROM Companies WHERE Name = 'Tech Solutions Inc')
BEGIN
    INSERT INTO Companies (UserID, Name, Area, Technologies, MaxInternships, CurrentInternships, ManagerID, ManagerName, ManagerEmail, IsActive)
    VALUES (@ManagerUserID, 'Tech Solutions Inc', 'Web Development', 'React, Node.js, MongoDB, Express', 10, 2, @ManagerUserID, 'John Manager', 'manager@tech.com', 1);
END

IF NOT EXISTS (SELECT * FROM Companies WHERE Name = 'Creative Design Studio')
BEGIN
    INSERT INTO Companies (UserID, Name, Area, Technologies, MaxInternships, CurrentInternships, ManagerID, ManagerName, ManagerEmail, IsActive)
    VALUES (@Manager2UserID, 'Creative Design Studio', 'UI/UX Design', 'Figma, Adobe XD, Sketch, InVision', 8, 1, @Manager2UserID, 'Sarah Johnson', 'sarah@design.com', 1);
END

IF NOT EXISTS (SELECT * FROM Companies WHERE Name = 'Data Analytics Hub')
BEGIN
    INSERT INTO Companies (UserID, Name, Area, Technologies, MaxInternships, CurrentInternships, ManagerID, ManagerName, ManagerEmail, IsActive)
    VALUES (@ManagerUserID, 'Data Analytics Hub', 'Data Science', 'Python, Pandas, NumPy, SQL, Tableau', 6, 0, @ManagerUserID, 'John Manager', 'manager@tech.com', 1);
END

IF NOT EXISTS (SELECT * FROM Companies WHERE Name = 'Mobile Apps Ltd')
BEGIN
    INSERT INTO Companies (UserID, Name, Area, Technologies, MaxInternships, CurrentInternships, ManagerID, ManagerName, ManagerEmail, IsActive)
    VALUES (@ManagerUserID, 'Mobile Apps Ltd', 'Mobile Development', 'React Native, Flutter, Swift, Kotlin', 12, 3, @ManagerUserID, 'John Manager', 'manager@tech.com', 1);
END

-- Get Company IDs
DECLARE @TechSolutionsID INT, @DesignStudioID INT, @DataHubID INT, @MobileAppsID INT;
SELECT @TechSolutionsID = CompanyID FROM Companies WHERE Name = 'Tech Solutions Inc';
SELECT @DesignStudioID = CompanyID FROM Companies WHERE Name = 'Creative Design Studio';
SELECT @DataHubID = CompanyID FROM Companies WHERE Name = 'Data Analytics Hub';
SELECT @MobileAppsID = CompanyID FROM Companies WHERE Name = 'Mobile Apps Ltd';

-- 3. Insert Students
PRINT 'Inserting Students...';

IF NOT EXISTS (SELECT * FROM Students WHERE RegNo = 'STU-001')
BEGIN
    INSERT INTO Students (UserID, Name, RegNo, Technology, HasShownInterest, AssignedCompanyID, AssignedCompanyName, InternshipStatus, CertificateStatus, StartDate, EndDate)
    VALUES (@StudentUserID, 'Alex Student', 'STU-001', 'Web Development', 1, @TechSolutionsID, 'Tech Solutions Inc', 2, 2, GETDATE(), DATEADD(month, 3, GETDATE()));
END

IF NOT EXISTS (SELECT * FROM Students WHERE RegNo = 'STU-002')
BEGIN
    INSERT INTO Students (UserID, Name, RegNo, Technology, HasShownInterest, AssignedCompanyID, AssignedCompanyName, InternshipStatus, CertificateStatus, StartDate, EndDate)
    VALUES (@Student2UserID, 'Emma Wilson', 'STU-002', 'UI/UX Design', 1, @DesignStudioID, 'Creative Design Studio', 2, 1, GETDATE(), DATEADD(month, 3, GETDATE()));
END

IF NOT EXISTS (SELECT * FROM Students WHERE RegNo = 'STU-003')
BEGIN
    INSERT INTO Students (UserID, Name, RegNo, Technology, HasShownInterest, AssignedCompanyID, AssignedCompanyName, InternshipStatus, CertificateStatus, StartDate, EndDate)
    VALUES (@Student3UserID, 'Mike Chen', 'STU-003', 'Mobile Development', 1, @MobileAppsID, 'Mobile Apps Ltd', 2, 2, GETDATE(), DATEADD(month, 3, GETDATE()));
END

IF NOT EXISTS (SELECT * FROM Students WHERE RegNo = 'STU-004')
BEGIN
    INSERT INTO Students (UserID, Name, RegNo, Technology, HasShownInterest, AssignedCompanyID, AssignedCompanyName, InternshipStatus, CertificateStatus)
    VALUES (@Student4UserID, 'Lisa Anderson', 'STU-004', 'Data Science', 1, NULL, NULL, 1, 1);
END

-- 4. Insert Assignments
PRINT 'Inserting Assignments...';

IF NOT EXISTS (SELECT * FROM Assignments WHERE StudentName = 'Alex Student' AND CompanyName = 'Tech Solutions Inc')
BEGIN
    INSERT INTO Assignments (StudentID, CompanyID, StudentName, CompanyName, AssignedDate, StartDate, EndDate, Status, Progress, CertificateIssued)
    SELECT StudentID, @TechSolutionsID, Name, 'Tech Solutions Inc', GETDATE(), StartDate, EndDate, 2, 45, 0
    FROM Students WHERE RegNo = 'STU-001';
END

IF NOT EXISTS (SELECT * FROM Assignments WHERE StudentName = 'Emma Wilson' AND CompanyName = 'Creative Design Studio')
BEGIN
    INSERT INTO Assignments (StudentID, CompanyID, StudentName, CompanyName, AssignedDate, StartDate, EndDate, Status, Progress, CertificateIssued)
    SELECT StudentID, @DesignStudioID, Name, 'Creative Design Studio', GETDATE(), StartDate, EndDate, 2, 30, 0
    FROM Students WHERE RegNo = 'STU-002';
END

IF NOT EXISTS (SELECT * FROM Assignments WHERE StudentName = 'Mike Chen' AND CompanyName = 'Mobile Apps Ltd')
BEGIN
    INSERT INTO Assignments (StudentID, CompanyID, StudentName, CompanyName, AssignedDate, StartDate, EndDate, Status, Progress, CertificateIssued)
    SELECT StudentID, @MobileAppsID, Name, 'Mobile Apps Ltd', GETDATE(), StartDate, EndDate, 2, 60, 0
    FROM Students WHERE RegNo = 'STU-003';
END

-- Get Assignment IDs
DECLARE @Assignment1ID INT, @Assignment2ID INT, @Assignment3ID INT;
SELECT @Assignment1ID = AssignmentID FROM Assignments WHERE StudentName = 'Alex Student' AND CompanyName = 'Tech Solutions Inc';
SELECT @Assignment2ID = AssignmentID FROM Assignments WHERE StudentName = 'Emma Wilson' AND CompanyName = 'Creative Design Studio';
SELECT @Assignment3ID = AssignmentID FROM Assignments WHERE StudentName = 'Mike Chen' AND CompanyName = 'Mobile Apps Ltd';

-- 5. Insert Certificates
PRINT 'Inserting Certificates...';

IF NOT EXISTS (SELECT * FROM Certificates WHERE StudentName = 'Alex Student')
BEGIN
    INSERT INTO Certificates (AssignmentID, StudentID, CompanyID, StudentName, CompanyName, IssueDate, Duration, SkillsAcquired, ProjectDescription, IsVerified)
    SELECT @Assignment1ID, StudentID, @TechSolutionsID, Name, 'Tech Solutions Inc', 
           GETDATE(), '3 Months', 
           'React, Node.js, MongoDB, REST APIs, Git', 
           'Developed a full-stack web application with user authentication and data management features',
           1
    FROM Students WHERE RegNo = 'STU-001';
END

PRINT 'Seed data insertion completed successfully!';
GO

-- Show Summary
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL
SELECT 'Companies', COUNT(*) FROM Companies
UNION ALL
SELECT 'Students', COUNT(*) FROM Students
UNION ALL
SELECT 'Assignments', COUNT(*) FROM Assignments
UNION ALL
SELECT 'Certificates', COUNT(*) FROM Certificates;

GO

