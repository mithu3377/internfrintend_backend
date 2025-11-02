-- Check if InternshipPortalDB exists and has data
USE InternshipPortalDB;
GO

-- Check all tables
SELECT 
    t.name AS TableName,
    (SELECT COUNT(*) FROM sys.indexes WHERE object_id = t.object_id AND is_primary_key = 1) AS HasPrimaryKey
FROM sys.tables t
WHERE t.name IN ('Users', 'Students', 'Companies', 'Assignments', 'Certificates')
ORDER BY t.name;

-- Count records in each table
SELECT 'Users' AS TableName, COUNT(*) AS RecordCount FROM Users
UNION ALL
SELECT 'Students', COUNT(*) FROM Students
UNION ALL
SELECT 'Companies', COUNT(*) FROM Companies
UNION ALL
SELECT 'Assignments', COUNT(*) FROM Assignments
UNION ALL
SELECT 'Certificates', COUNT(*) FROM Certificates;

GO

