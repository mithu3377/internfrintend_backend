-- Create a test assignment for the manager
USE InternshipPortalDB;
GO

PRINT 'Creating test assignment...';

-- Get the manager user ID
DECLARE @ManagerUserID INT;
SELECT @ManagerUserID = UserID FROM Users WHERE Username = 'manager';

-- Get the manager's company
DECLARE @CompanyID INT;
SELECT @CompanyID = CompanyID FROM Companies WHERE ManagerID = @ManagerUserID;

-- Get a student who has shown interest
DECLARE @StudentID INT;
SELECT @StudentID = StudentID FROM Students 
WHERE HasShownInterest = 1 
  AND InternshipStatus = 1 
  AND AssignedCompanyID IS NULL;

PRINT 'Manager ID: ' + CAST(ISNULL(@ManagerUserID, 0) AS VARCHAR);
PRINT 'Company ID: ' + CAST(ISNULL(@CompanyID, 0) AS VARCHAR);
PRINT 'Student ID: ' + CAST(ISNULL(@StudentID, 0) AS VARCHAR);

IF @CompanyID IS NULL
BEGIN
    PRINT 'ERROR: No company found for manager!';
END
ELSE IF @StudentID IS NULL
BEGIN
    PRINT 'ERROR: No student with interest found!';
    PRINT 'Solution: Make a student show interest first';
END
ELSE
BEGIN
    -- Check if assignment already exists
    IF NOT EXISTS (SELECT * FROM Assignments WHERE StudentID = @StudentID AND CompanyID = @CompanyID)
    BEGIN
        -- Get student details
        DECLARE @StudentName NVARCHAR(100);
        DECLARE @CompanyName NVARCHAR(150);
        
        SELECT @StudentName = Name FROM Students WHERE StudentID = @StudentID;
        SELECT @CompanyName = Name FROM Companies WHERE CompanyID = @CompanyID;
        
        -- Create assignment
        INSERT INTO Assignments (
            StudentID, 
            CompanyID, 
            StudentName, 
            CompanyName,
            AssignedDate,
            StartDate,
            EndDate,
            Status,
            Progress,
            CertificateIssued
        )
        VALUES (
            @StudentID,
            @CompanyID,
            @StudentName,
            @CompanyName,
            GETDATE(),
            GETDATE(),
            DATEADD(MONTH, 3, GETDATE()),
            1, -- Status: 1 = Assigned
            0, -- Progress: 0%
            0  -- CertificateIssued: false
        );
        
        PRINT '✅ Assignment created successfully!';
        
        -- Update student record
        UPDATE Students 
        SET AssignedCompanyID = @CompanyID,
            AssignedCompanyName = @CompanyName,
            InternshipStatus = 2 -- 2 = Assigned
        WHERE StudentID = @StudentID;
        
        PRINT '✅ Student record updated!';
        
        -- Update company slot count
        UPDATE Companies
        SET CurrentInternships = CurrentInternships + 1
        WHERE CompanyID = @CompanyID;
        
        PRINT '✅ Company slot count updated!';
    END
    ELSE
    BEGIN
        PRINT 'Assignment already exists';
    END
END

-- Show the assignment
PRINT '';
PRINT '=== Created Assignment ===';
SELECT 
    a.AssignmentID,
    a.StudentName,
    a.CompanyName,
    CASE 
        WHEN a.Status = 1 THEN 'Assigned'
        WHEN a.Status = 2 THEN 'In Progress'
        ELSE 'Completed'
    END AS Status,
    CAST(a.Progress AS VARCHAR) + '%' AS Progress
FROM Assignments a
WHERE a.AssignmentID = (SELECT MAX(AssignmentID) FROM Assignments);

GO




