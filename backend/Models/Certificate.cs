namespace InternshipPortal.API.Models;

public class Certificate
{
    public int CertificateID { get; set; }
    public int AssignmentID { get; set; }
    public int StudentID { get; set; }
    public int CompanyID { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public DateTime IssueDate { get; set; } = DateTime.Now;
    public string Duration { get; set; } = string.Empty;
    public string? SkillsAcquired { get; set; }
    public string? ProjectDescription { get; set; }
    public bool IsVerified { get; set; } = true;
}

