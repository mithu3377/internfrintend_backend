-- CREATE FRESH INTERNSHIP PORTAL DATABASE
-- This script drops the existing database if it exists and creates a fresh one

USE master;
GO

-- Drop the database if it exists (be careful - this deletes everything!)
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'InternshipPortalDB')
BEGIN
    -- Close existing connections
    ALTER DATABASE InternshipPortalDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE InternshipPortalDB;
    PRINT 'Existing database InternshipPortalDB dropped successfully.';
END
GO

-- Create fresh database
CREATE DATABASE InternshipPortalDB;
GO

USE InternshipPortalDB;
GO

PRINT 'Creating tables...';

-- 1. Users Table (For Login)
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Admin','Student','Manager')),
    Email NVARCHAR(100),
    Name NVARCHAR(100),
    CreatedDate DATETIME DEFAULT GETDATE()
);
PRINT 'Created Users table';

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
    InternshipStatus INT DEFAULT 0, -- 0=Not Assigned, 1=Shown Interest, 2=Assigned
    CertificateStatus INT DEFAULT 1, -- 1=Not Available, 2=In Progress, 3=Issued
    StartDate DATETIME NULL,
    EndDate DATETIME NULL,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);
PRINT 'Created Students table';

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
PRINT 'Created Companies table';

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
    Status INT DEFAULT 1, -- 1=Assigned, 2=In Progress, 3=Completed
    Progress INT DEFAULT 0,
    CertificateIssued BIT DEFAULT 0,
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE NO ACTION,
    FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID) ON DELETE NO ACTION
);
PRINT 'Created Assignments table';

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
PRINT 'Created Certificates table';

PRINT '';
PRINT '========================================';
PRINT 'Database created successfully!';
PRINT '========================================';
PRINT '';

-- Show all tables created
SELECT 
    t.name AS TableName
FROM sys.tables t
WHERE t.name IN ('Users', 'Students', 'Companies', 'Assignments', 'Certificates')
ORDER BY t.name;

GO

