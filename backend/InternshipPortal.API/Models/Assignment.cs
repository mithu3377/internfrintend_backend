using System.ComponentModel.DataAnnotations;

namespace InternshipPortal.API.Models
{
    public class Assignment
    {
        public int Id { get; set; }
        
        [Required]
        public int StudentId { get; set; }
        
        [Required]
        public int CompanyId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string StudentName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string CompanyName { get; set; } = string.Empty;
        
        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? StartDate { get; set; }
        
        public DateTime? EndDate { get; set; }
        
        public int Status { get; set; } = 1; // 1=Assigned, 2=InProgress, 3=Completed
        
        public int? Progress { get; set; } // 0-100
        
        public bool CertificateIssued { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual Student? Student { get; set; }
        public virtual Company? Company { get; set; }
    }
}


