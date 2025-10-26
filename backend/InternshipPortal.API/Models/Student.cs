using System.ComponentModel.DataAnnotations;

namespace InternshipPortal.API.Models
{
    public class Student
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string RegNo { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Technology { get; set; } = string.Empty;
        
        public bool HasShownInterest { get; set; } = false;
        
        public int? AssignedCompanyId { get; set; }
        
        [MaxLength(200)]
        public string? AssignedCompanyName { get; set; }
        
        public int InternshipStatus { get; set; } = 1; // 1=NotAssigned, 2=Assigned, 3=InProgress, 4=Completed
        
        public int CertificateStatus { get; set; } = 1; // 1=NotAvailable, 2=InProgress, 3=Issued
        
        public DateTime? StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual User? User { get; set; }
        public virtual Company? AssignedCompany { get; set; }
        public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}


