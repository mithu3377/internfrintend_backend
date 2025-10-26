using Microsoft.EntityFrameworkCore;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Data
{
    public class InternshipPortalContext : DbContext
    {
        public InternshipPortalContext(DbContextOptions<InternshipPortalContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Assignment> Assignments { get; set; }
        public DbSet<Certificate> Certificates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Role).IsRequired();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure Company entity
            modelBuilder.Entity<Company>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Area).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ManagerName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.ManagerEmail).IsRequired().HasMaxLength(255);
                entity.HasOne(e => e.Manager)
                      .WithMany(e => e.ManagedCompanies)
                      .HasForeignKey(e => e.ManagerId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Student entity
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RegNo).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Technology).IsRequired().HasMaxLength(100);
                entity.Property(e => e.AssignedCompanyName).HasMaxLength(200);
                entity.HasOne(e => e.User)
                      .WithMany(e => e.Students)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.AssignedCompany)
                      .WithMany()
                      .HasForeignKey(e => e.AssignedCompanyId)
                      .OnDelete(DeleteBehavior.SetNull);
                entity.HasIndex(e => e.RegNo).IsUnique();
            });

            // Configure Assignment entity
            modelBuilder.Entity<Assignment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.StudentName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(200);
                entity.HasOne(e => e.Student)
                      .WithMany(e => e.Assignments)
                      .HasForeignKey(e => e.StudentId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Company)
                      .WithMany(e => e.Assignments)
                      .HasForeignKey(e => e.CompanyId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Certificate entity
            modelBuilder.Entity<Certificate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CertificateNumber).IsRequired().HasMaxLength(200);
                entity.Property(e => e.StudentName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.CompanyName).IsRequired().HasMaxLength(200);
                entity.HasOne(e => e.Assignment)
                      .WithMany()
                      .HasForeignKey(e => e.AssignmentId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Student)
                      .WithMany()
                      .HasForeignKey(e => e.StudentId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Company)
                      .WithMany()
                      .HasForeignKey(e => e.CompanyId)
                      .OnDelete(DeleteBehavior.Restrict);
                entity.HasIndex(e => e.CertificateNumber).IsUnique();
            });

            // Seed data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed users from your database
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Name = "M.Nauman",
                    Email = "nauman@admin.com",
                    PasswordHash = "Admin123",
                    Role = 2, // Admin
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Name = "Qadis Parvez",
                    Email = "qadis@student.com",
                    PasswordHash = "Student456",
                    Role = 1, // Student
                    RegNo = "2021-Arid-4566",
                    Technology = "Flutter",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 3,
                    Name = "Ali Haider",
                    Email = "ali@student.com",
                    PasswordHash = "Pass789",
                    Role = 1, // Student
                    RegNo = "2021-Arid-4404",
                    Technology = "React Native",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 4,
                    Name = "Daud Ansar",
                    Email = "daud@student.com",
                    PasswordHash = "Daud2024",
                    Role = 1, // Student
                    RegNo = "2020-Arid-0126",
                    Technology = "React JS",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 5,
                    Name = "Manager Name",
                    Email = "manager@company.com",
                    PasswordHash = "Manager321",
                    Role = 3, // Manager
                    CompanyName = "TechCorp Solutions",
                    Technology = "Frontend Development",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 6,
                    Name = "John Smith",
                    Email = "john@techcorp.com",
                    PasswordHash = "John@Tech",
                    Role = 3, // Manager
                    CompanyName = "TechCorp Solutions",
                    Technology = "Backend Development",
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed companies
            modelBuilder.Entity<Company>().HasData(
                new Company
                {
                    Id = 1,
                    Name = "TechCorp Solutions",
                    Area = "Frontend Development",
                    MaxInternships = 3,
                    CurrentInternships = 0,
                    ManagerId = 5,
                    ManagerName = "Manager Name",
                    ManagerEmail = "manager@company.com",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Company
                {
                    Id = 2,
                    Name = "TechCorp Solutions",
                    Area = "Backend Development",
                    MaxInternships = 2,
                    CurrentInternships = 0,
                    ManagerId = 6,
                    ManagerName = "John Smith",
                    ManagerEmail = "john@techcorp.com",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Company
                {
                    Id = 3,
                    Name = "DataFlow Inc",
                    Area = "Data Science",
                    MaxInternships = 4,
                    CurrentInternships = 0,
                    ManagerId = 5,
                    ManagerName = "Manager Name",
                    ManagerEmail = "manager@company.com",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Company
                {
                    Id = 4,
                    Name = "CloudTech",
                    Area = "DevOps",
                    MaxInternships = 2,
                    CurrentInternships = 0,
                    ManagerId = 6,
                    ManagerName = "John Smith",
                    ManagerEmail = "john@techcorp.com",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Company
                {
                    Id = 5,
                    Name = "InnovateLab",
                    Area = "Mobile Development",
                    MaxInternships = 3,
                    CurrentInternships = 0,
                    ManagerId = 5,
                    ManagerName = "Manager Name",
                    ManagerEmail = "manager@company.com",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed students
            modelBuilder.Entity<Student>().HasData(
                new Student
                {
                    Id = 1,
                    UserId = 2,
                    RegNo = "2021-Arid-4566",
                    Technology = "Flutter",
                    HasShownInterest = false,
                    InternshipStatus = 1,
                    CertificateStatus = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new Student
                {
                    Id = 2,
                    UserId = 3,
                    RegNo = "2021-Arid-4404",
                    Technology = "React Native",
                    HasShownInterest = true,
                    InternshipStatus = 1,
                    CertificateStatus = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new Student
                {
                    Id = 3,
                    UserId = 4,
                    RegNo = "2020-Arid-0126",
                    Technology = "React JS",
                    HasShownInterest = true,
                    InternshipStatus = 1,
                    CertificateStatus = 1,
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}


