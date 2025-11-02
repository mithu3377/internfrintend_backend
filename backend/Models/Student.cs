namespace InternshipPortal.API.Models;

public class Student
{
    public int StudentID { get; set; }
    public int UserID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string RegNo { get; set; } = string.Empty;
    public string? Technology { get; set; }
    public bool HasShownInterest { get; set; } = false;
    public int? AssignedCompanyID { get; set; }
    public string? AssignedCompanyName { get; set; }
    public int InternshipStatus { get; set; } = 0; // 0=Not Assigned, 1=Shown Interest, 2=Assigned
    public int CertificateStatus { get; set; } = 1; // 1=Not Available, 2=In Progress, 3=Issued
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

