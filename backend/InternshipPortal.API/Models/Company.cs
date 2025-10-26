using System.ComponentModel.DataAnnotations;

namespace InternshipPortal.API.Models
{
    public class Company
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Area { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string Technologies { get; set; } = string.Empty;
        
        public int MaxInternships { get; set; }
        public int CurrentInternships { get; set; } = 0;
        
        [Required]
        public int ManagerId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string ManagerName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        public string ManagerEmail { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual User? Manager { get; set; }
        public virtual ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}





