-- ============================================================
-- COMPLETE INTERNSHIP PORTAL DATABASE SETUP
-- Run this entire script in SSMS to create database and tables
-- ============================================================

USE master;
GO

PRINT '==========================================';
PRINT 'INTERNSHIP PORTAL DATABASE SETUP';
PRINT '==========================================';
PRINT '';

-- Drop the database if it exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'InternshipPortalDB')
BEGIN
    ALTER DATABASE InternshipPortalDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE InternshipPortalDB;
    PRINT '✓ Dropped existing database: InternshipPortalDB';
END
GO

-- Create new database
CREATE DATABASE InternshipPortalDB;
GO
PRINT '✓ Created database: InternshipPortalDB';
GO

USE InternshipPortalDB;
GO

PRINT '';
PRINT 'Creating tables...';
PRINT '';

-- 1. Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Admin','Student','Manager')),
    Email NVARCHAR(100),
    Name NVARCHAR(100),
    CreatedDate DATETIME DEFAULT GETDATE()
);
PRINT '  ✓ Created Users table';

-- 2. Students Table
CREATE TABLE Students (
    StudentID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    Name NVARCHAR(100) NOT NULL,
    RegNo NVARCHAR(50) UNIQUE NOT NULL,
    Technology NVARCHAR(100),
    HasShownInterest BIT DEFAULT 0,
    AssignedCompanyID INT NULL,
    AssignedCompanyName NVARCHAR(150) NULL,
    InternshipStatus INT DEFAULT 0,
    CertificateStatus INT DEFAULT 1,
    StartDate DATETIME NULL,
    EndDate DATETIME NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
PRINT '  ✓ Created Students table';

-- 3. Companies Table
CREATE TABLE Companies (
    CompanyID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT,
    Name NVARCHAR(150) NOT NULL,
    Area NVARCHAR(100),
    Technologies NVARCHAR(500),
    MaxInternships INT DEFAULT 0,
    CurrentInternships INT DEFAULT 0,
    ManagerID INT,
    ManagerName NVARCHAR(100),
    ManagerEmail NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
PRINT '  ✓ Created Companies table';

-- 4. Assignments Table
CREATE TABLE Assignments (
    AssignmentID INT PRIMARY KEY IDENTITY(1,1),
    StudentID INT,
    CompanyID INT,
    StudentName NVARCHAR(100),
    CompanyName NVARCHAR(150),
    AssignedDate DATETIME DEFAULT GETDATE(),
    StartDate DATETIME,
    EndDate DATETIME,
    Status INT DEFAULT 1,
    Progress INT DEFAULT 0,
    CertificateIssued BIT DEFAULT 0,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE NO ACTION,
    FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID) ON DELETE NO ACTION
);
PRINT '  ✓ Created Assignments table';

-- 5. Certificates Table
CREATE TABLE Certificates (
    CertificateID INT PRIMARY KEY IDENTITY(1,1),
    AssignmentID INT,
    StudentID INT,
    CompanyID INT,
    StudentName NVARCHAR(100),
    CompanyName NVARCHAR(150),
    IssueDate DATETIME DEFAULT GETDATE(),
    Duration NVARCHAR(50),
    SkillsAcquired NVARCHAR(MAX),
    ProjectDescription NVARCHAR(MAX),
    IsVerified BIT DEFAULT 1,
    FOREIGN KEY (AssignmentID) REFERENCES Assignments(AssignmentID) ON DELETE NO ACTION
);
PRINT '  ✓ Created Certificates table';

PRINT '';
PRINT '==========================================';
PRINT 'INSERTING SAMPLE DATA...';
PRINT '==========================================';
PRINT '';

-- Insert Users
INSERT INTO Users (Username, Password, Role, Email, Name) VALUES
('admin', 'admin123', 'Admin', 'admin@portal.com', 'Administrator'),
('admin2', 'admin123', 'Admin', 'admin2@portal.com', 'Secondary Admin'),
('manager', 'manager123', 'Manager', 'manager@tech.com', 'John Manager'),
('manager2', 'manager123', 'Manager', 'sarah@design.com', 'Sarah Johnson'),
('student', 'student123', 'Student', 'student@university.com', 'Alex Student'),
('student2', 'student123', 'Student', 'emma@university.com', 'Emma Wilson'),
('student3', 'student123', 'Student', 'mike@university.com', 'Mike Chen'),
('student4', 'student123', 'Student', 'lisa@university.com', 'Lisa Anderson');
PRINT '  ✓ Inserted 8 users';

-- Get User IDs
DECLARE @AdminUserID INT, @ManagerUserID INT, @Manager2UserID INT;
DECLARE @StudentUserID INT, @Student2UserID INT, @Student3UserID INT, @Student4UserID INT;

SELECT @AdminUserID = UserID FROM Users WHERE Username = 'admin';
SELECT @ManagerUserID = UserID FROM Users WHERE Username = 'manager';
SELECT @Manager2UserID = UserID FROM Users WHERE Username = 'manager2';
SELECT @StudentUserID = UserID FROM Users WHERE Username = 'student';
SELECT @Student2UserID = UserID FROM Users WHERE Username = 'student2';
SELECT @Student3UserID = UserID FROM Users WHERE Username = 'student3';
SELECT @Student4UserID = UserID FROM Users WHERE Username = 'student4';

-- Insert Companies
INSERT INTO Companies (UserID, Name, Area, Technologies, MaxInternships, CurrentInternships, ManagerID, ManagerName, ManagerEmail, IsActive)
VALUES
(@ManagerUserID, 'Tech Solutions Inc', 'Web Development', 'React, Node.js, MongoDB, Express', 10, 2, @ManagerUserID, 'John Manager', 'manager@tech.com', 1),
(@Manager2UserID, 'Creative Design Studio', 'UI/UX Design', 'Figma, Adobe XD, Sketch, InVision', 8, 1, @Manager2UserID, 'Sarah Johnson', 'sarah@design.com', 1),
(@ManagerUserID, 'Data Analytics Hub', 'Data Science', 'Python, Pandas, NumPy, SQL, Tableau', 6, 0, @ManagerUserID, 'John Manager', 'manager@tech.com', 1),
(@ManagerUserID, 'Mobile Apps Ltd', 'Mobile Development', 'React Native, Flutter, Swift, Kotlin', 12, 3, @ManagerUserID, 'John Manager', 'manager@tech.com', 1);
PRINT '  ✓ Inserted 4 companies';

-- Get Company IDs
DECLARE @TechSolutionsID INT, @DesignStudioID INT, @DataHubID INT, @MobileAppsID INT;
SELECT @TechSolutionsID = CompanyID FROM Companies WHERE Name = 'Tech Solutions Inc';
SELECT @DesignStudioID = CompanyID FROM Companies WHERE Name = 'Creative Design Studio';
SELECT @DataHubID = CompanyID FROM Companies WHERE Name = 'Data Analytics Hub';
SELECT @MobileAppsID = CompanyID FROM Companies WHERE Name = 'Mobile Apps Ltd';

-- Insert Students
INSERT INTO Students (UserID, Name, RegNo, Technology, HasShownInterest, AssignedCompanyID, AssignedCompanyName, InternshipStatus, CertificateStatus, StartDate, EndDate)
VALUES
(@StudentUserID, 'Alex Student', 'STU-001', 'Web Development', 1, @TechSolutionsID, 'Tech Solutions Inc', 2, 2, GETDATE(), DATEADD(month, 3, GETDATE())),
(@Student2UserID, 'Emma Wilson', 'STU-002', 'UI/UX Design', 1, @DesignStudioID, 'Creative Design Studio', 2, 1, GETDATE(), DATEADD(month, 3, GETDATE())),
(@Student3UserID, 'Mike Chen', 'STU-003', 'Mobile Development', 1, @MobileAppsID, 'Mobile Apps Ltd', 2, 2, GETDATE(), DATEADD(month, 3, GETDATE())),
(@Student4UserID, 'Lisa Anderson', 'STU-004', 'Data Science', 1, NULL, NULL, 1, 1, NULL, NULL);
PRINT '  ✓ Inserted 4 students';

-- Insert Assignments
INSERT INTO Assignments (StudentID, CompanyID, StudentName, CompanyName, AssignedDate, StartDate, EndDate, Status, Progress, CertificateIssued)
SELECT StudentID, @TechSolutionsID, Name, 'Tech Solutions Inc', GETDATE(), StartDate, EndDate, 2, 45, 0
FROM Students WHERE RegNo = 'STU-001';

INSERT INTO Assignments (StudentID, CompanyID, StudentName, CompanyName, AssignedDate, StartDate, EndDate, Status, Progress, CertificateIssued)
SELECT StudentID, @DesignStudioID, Name, 'Creative Design Studio', GETDATE(), StartDate, EndDate, 2, 30, 0
FROM Students WHERE RegNo = 'STU-002';

INSERT INTO Assignments (StudentID, CompanyID, StudentName, CompanyName, AssignedDate, StartDate, EndDate, Status, Progress, CertificateIssued)
SELECT StudentID, @MobileAppsID, Name, 'Mobile Apps Ltd', GETDATE(), StartDate, EndDate, 2, 60, 0
FROM Students WHERE RegNo = 'STU-003';
PRINT '  ✓ Inserted 3 assignments';

-- Insert Certificates
INSERT INTO Certificates (AssignmentID, StudentID, CompanyID, StudentName, CompanyName, IssueDate, Duration, SkillsAcquired, ProjectDescription, IsVerified)
SELECT (SELECT AssignmentID FROM Assignments WHERE StudentName = 'Alex Student' AND CompanyName = 'Tech Solutions Inc'),
       StudentID, @TechSolutionsID, Name, 'Tech Solutions Inc', GETDATE(), '3 Months',
       'React, Node.js, MongoDB, REST APIs, Git', 'Developed a full-stack web application with user authentication and data management features', 1
FROM Students WHERE RegNo = 'STU-001';
PRINT '  ✓ Inserted 1 certificate';

PRINT '';
PRINT '==========================================';
PRINT 'DATABASE SETUP COMPLETED SUCCESSFULLY!';
PRINT '==========================================';
PRINT '';

-- Show summary
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL
SELECT 'Companies', COUNT(*) FROM Companies
UNION ALL
SELECT 'Students', COUNT(*) FROM Students
UNION ALL
SELECT 'Assignments', COUNT(*) FROM Assignments
UNION ALL
SELECT 'Certificates', COUNT(*) FROM Certificates;

PRINT '';
PRINT 'You can now test the API at: http://localhost:5000/swagger';
PRINT '';

GO

