namespace InternshipPortal.API.Models;

public class Company
{
    public int CompanyID { get; set; }
    public int? UserID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Area { get; set; }
    public string? Technologies { get; set; }
    public int MaxInternships { get; set; } = 0;
    public int CurrentInternships { get; set; } = 0;
    public int ManagerID { get; set; }
    public string ManagerName { get; set; } = string.Empty;
    public string ManagerEmail { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedDate { get; set; } = DateTime.Now;
}

