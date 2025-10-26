using Microsoft.EntityFrameworkCore;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Services
{
    public class CompanyService : ICompanyService
    {
        private readonly InternshipPortalContext _context;

        public CompanyService(InternshipPortalContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Company>> GetAllCompaniesAsync()
        {
            return await _context.Companies
                .Include(c => c.Manager)
                .Include(c => c.Assignments)
                .Where(c => c.IsActive)
                .ToListAsync();
        }

        public async Task<Company?> GetCompanyByIdAsync(int id)
        {
            return await _context.Companies
                .Include(c => c.Manager)
                .Include(c => c.Assignments)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Company> CreateCompanyAsync(Company company)
        {
            // Create a new company object without navigation properties
            var newCompany = new Company
            {
                Name = company.Name,
                Area = company.Area,
                MaxInternships = company.MaxInternships,
                ManagerId = company.ManagerId,
                ManagerName = company.ManagerName,
                ManagerEmail = company.ManagerEmail,
                IsActive = true,
                CurrentInternships = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.Companies.Add(newCompany);
            await _context.SaveChangesAsync();

            // Return the company without navigation properties to avoid circular references
            return await _context.Companies
                .FirstOrDefaultAsync(c => c.Id == newCompany.Id);
        }

        public async Task<Company?> UpdateCompanyAsync(int id, Company company)
        {
            var existingCompany = await _context.Companies.FindAsync(id);
            if (existingCompany == null)
                return null;

            existingCompany.Name = company.Name;
            existingCompany.Area = company.Area;
            existingCompany.MaxInternships = company.MaxInternships;
            existingCompany.ManagerId = company.ManagerId;
            existingCompany.ManagerName = company.ManagerName;
            existingCompany.ManagerEmail = company.ManagerEmail;
            existingCompany.IsActive = company.IsActive;
            existingCompany.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingCompany;
        }

        public async Task<bool> DeleteCompanyAsync(int id)
        {
            var company = await _context.Companies.FindAsync(id);
            if (company == null)
                return false;

            company.IsActive = false;
            company.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Company>> GetCompaniesByManagerAsync(int managerId)
        {
            return await _context.Companies
                .Include(c => c.Manager)
                .Include(c => c.Assignments)
                .Where(c => c.ManagerId == managerId && c.IsActive)
                .ToListAsync();
        }
    }
}





