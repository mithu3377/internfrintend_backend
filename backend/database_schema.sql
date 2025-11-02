-- Internship Portal Database Schema
USE master;
GO

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'InternshipPortalDB')
BEGIN
    CREATE DATABASE InternshipPortalDB;
END
GO

USE InternshipPortalDB;
GO

-- 1. Users Table (For Login)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        UserID INT PRIMARY KEY IDENTITY(1,1),
        Username NVARCHAR(100) UNIQUE NOT NULL,
        Password NVARCHAR(255) NOT NULL,
        Role NVARCHAR(20) NOT NULL CHECK (Role IN ('Admin','Student','Manager')),
        Email NVARCHAR(100),
        Name NVARCHAR(100),
        CreatedDate DATETIME DEFAULT GETDATE()
    );
END
GO

-- 2. Students Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Students')
BEGIN
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
END
GO

-- 3. Companies Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Companies')
BEGIN
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
END
GO

-- 4. Assignments Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Assignments')
BEGIN
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
END
GO

-- 5. Certificates Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Certificates')
BEGIN
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
END
GO

-- Insert Sample Admin User
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('admin', 'admin123', 'Admin', 'admin@portal.com', 'Admin User');
END
GO

-- Insert Sample Student User
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'student')
BEGIN
    DECLARE @StudentUserID INT;
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('student', 'student123', 'Student', 'student@portal.com', 'Test Student');
    
    SET @StudentUserID = SCOPE_IDENTITY();
    
    INSERT INTO Students (UserID, Name, RegNo, Technology)
    VALUES (@StudentUserID, 'Test Student', 'STU-001', 'Web Development');
END
GO

-- Insert Sample Manager User
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'manager')
BEGIN
    DECLARE @ManagerUserID INT;
    INSERT INTO Users (Username, Password, Role, Email, Name)
    VALUES ('manager', 'manager123', 'Manager', 'manager@company.com', 'Test Manager');
    
    SET @ManagerUserID = SCOPE_IDENTITY();
    
    INSERT INTO Companies (UserID, Name, Area, Technologies, MaxInternships, ManagerID, ManagerName, ManagerEmail)
    VALUES (@ManagerUserID, 'Tech Solutions Inc', 'Web Development', 'React, Node.js, MongoDB', 5, @ManagerUserID, 'Test Manager', 'manager@company.com');
END
GO

PRINT 'Database schema created successfully!';
GO

-- Show all tables
SELECT * FROM sys.tables WHERE name IN ('Users', 'Students', 'Companies', 'Assignments', 'Certificates');

