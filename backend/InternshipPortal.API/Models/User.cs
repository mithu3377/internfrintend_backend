using System.ComponentModel.DataAnnotations;

namespace InternshipPortal.API.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;
        
        [Required]
        public int Role { get; set; } // 1=Student, 2=Admin, 3=Manager
        
        // Student specific fields
        [MaxLength(50)]
        public string? RegNo { get; set; }
        
        [MaxLength(200)]
        public string? CompanyName { get; set; }
        
        [MaxLength(100)]
        public string? Technology { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual ICollection<Company> ManagedCompanies { get; set; } = new List<Company>();
        public virtual ICollection<Student> Students { get; set; } = new List<Student>();
        public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}





