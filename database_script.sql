-- SQL Database Creation Script for Internship Portal
-- Run this script in SQL Server Management Studio or Azure Data Studio

-- Create Database
CREATE DATABASE InternshipPortalDB;
GO

USE InternshipPortalDB;
GO

-- Create Users Table
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Role NVARCHAR(20) NOT NULL,
    RegistrationNumber NVARCHAR(50) NULL,
    Technology NVARCHAR(100) NULL,
    CompanyName NVARCHAR(100) NULL,
    AreaOfDevelopment NVARCHAR(100) NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL
);

-- Create Companies Table
CREATE TABLE Companies (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(200) NOT NULL,
    Area NVARCHAR(100) NOT NULL,
    MaxInternships INT NOT NULL,
    CurrentInternships INT NOT NULL DEFAULT 0,
    ManagerId INT NOT NULL,
    ManagerName NVARCHAR(100) NOT NULL,
    ManagerEmail NVARCHAR(100) NOT NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (ManagerId) REFERENCES Users(Id)
);

-- Create Students Table
CREATE TABLE Students (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    RegistrationNumber NVARCHAR(50) NOT NULL UNIQUE,
    Technology NVARCHAR(100) NOT NULL,
    Skills NVARCHAR(200) NULL,
    ResumeUrl NVARCHAR(500) NULL,
    IsAvailable BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Create Assignments Table
CREATE TABLE Assignments (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    StudentId INT NOT NULL,
    CompanyId INT NOT NULL,
    ManagerId INT NOT NULL,
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2 NOT NULL,
    Description NVARCHAR(500) NULL,
    Status NVARCHAR(100) NOT NULL DEFAULT 'Assigned',
    ProgressNotes NVARCHAR(500) NULL,
    ManagerFeedback NVARCHAR(500) NULL,
    StudentFeedback NVARCHAR(500) NULL,
    Rating INT NULL CHECK (Rating >= 1 AND Rating <= 5),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (ManagerId) REFERENCES Users(Id)
);

-- Create Certificates Table
CREATE TABLE Certificates (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AssignmentId INT NOT NULL,
    StudentId INT NOT NULL,
    CompanyId INT NOT NULL,
    CertificateNumber NVARCHAR(200) NOT NULL UNIQUE,
    StudentName NVARCHAR(200) NOT NULL,
    CompanyName NVARCHAR(200) NOT NULL,
    IssueDate DATETIME2 NOT NULL,
    Duration NVARCHAR(100) NOT NULL,
    SkillsAcquired NVARCHAR(500) NULL,
    ProjectDescription NVARCHAR(500) NULL,
    CertificateUrl NVARCHAR(500) NULL,
    IsVerified BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NULL,
    FOREIGN KEY (AssignmentId) REFERENCES Assignments(Id),
    FOREIGN KEY (StudentId) REFERENCES Students(Id),
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id)
);

-- Insert Default Admin User
INSERT INTO Users (Name, Email, PasswordHash, Role, CreatedAt)
VALUES ('Admin', 'admin@internshipportal.com', '$2a$11$YourHashedPasswordHere', 'admin', GETUTCDATE());

-- Create Indexes for Performance
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Students_UserId ON Students(UserId);
CREATE INDEX IX_Students_RegistrationNumber ON Students(RegistrationNumber);
CREATE INDEX IX_Companies_ManagerId ON Companies(ManagerId);
CREATE INDEX IX_Assignments_StudentId ON Assignments(StudentId);
CREATE INDEX IX_Assignments_CompanyId ON Assignments(CompanyId);
CREATE INDEX IX_Assignments_ManagerId ON Assignments(ManagerId);
CREATE INDEX IX_Certificates_StudentId ON Certificates(StudentId);
CREATE INDEX IX_Certificates_CompanyId ON Certificates(CompanyId);

-- Update password hashes for existing users
UPDATE users SET PasswordHash = 'admin123' WHERE Id = 1;
UPDATE users SET PasswordHash = 'student123' WHERE Id = 2;
UPDATE users SET PasswordHash = 'user123' WHERE Id = 3;
UPDATE users SET PasswordHash = 'daud123' WHERE Id = 4;
UPDATE users SET PasswordHash = 'manager123' WHERE Id = 5;
UPDATE users SET PasswordHash = 'john123' WHERE Id = 6;

PRINT 'Database InternshipPortalDB created successfully!';
PRINT 'Default admin user created with email: admin@internshipportal.com';
PRINT 'Default password: admin123';
PRINT 'Password hashes updated for all users';





