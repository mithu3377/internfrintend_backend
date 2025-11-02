namespace InternshipPortal.API.Models;

public class Assignment
{
    public int AssignmentID { get; set; }
    public int StudentID { get; set; }
    public int CompanyID { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public DateTime AssignedDate { get; set; } = DateTime.Now;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Status { get; set; } = 1; // 1=Assigned, 2=In Progress, 3=Completed
    public int Progress { get; set; } = 0;
    public bool CertificateIssued { get; set; } = false;
}

