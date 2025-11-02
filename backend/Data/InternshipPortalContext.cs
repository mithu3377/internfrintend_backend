using Microsoft.EntityFrameworkCore;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Data;

public class InternshipPortalContext : DbContext
{
    public InternshipPortalContext(DbContextOptions<InternshipPortalContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<Assignment> Assignments { get; set; }
    public DbSet<Certificate> Certificates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure entity mappings if needed
        base.OnModelCreating(modelBuilder);
    }
}

