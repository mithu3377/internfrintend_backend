using System.ComponentModel.DataAnnotations;

namespace InternshipPortal.API.Models
{
    public class Certificate
    {
        public int Id { get; set; }
        
        [Required]
        public int AssignmentId { get; set; }
        
        [Required]
        public int StudentId { get; set; }
        
        [Required]
        public int CompanyId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string CertificateNumber { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string StudentName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string CompanyName { get; set; } = string.Empty;
        
        [Required]
        public DateTime IssueDate { get; set; }
        
        [MaxLength(100)]
        public string Duration { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? SkillsAcquired { get; set; }
        
        [MaxLength(500)]
        public string? ProjectDescription { get; set; }
        
        [MaxLength(500)]
        public string? CertificateUrl { get; set; }
        
        public bool IsVerified { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual Assignment Assignment { get; set; } = null!;
        public virtual Student Student { get; set; } = null!;
        public virtual Company Company { get; set; } = null!;
    }
}


