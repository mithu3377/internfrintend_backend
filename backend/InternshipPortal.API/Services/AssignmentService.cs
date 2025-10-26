using Microsoft.EntityFrameworkCore;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Services
{
    public class AssignmentService : IAssignmentService
    {
        private readonly InternshipPortalContext _context;

        public AssignmentService(InternshipPortalContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Assignment>> GetAllAssignmentsAsync()
        {
            return await _context.Assignments
                .Include(a => a.Student)
                .ThenInclude(s => s.User)
                .Include(a => a.Company)
                .ToListAsync();
        }

        public async Task<Assignment?> GetAssignmentByIdAsync(int id)
        {
            return await _context.Assignments
                .Include(a => a.Student)
                .ThenInclude(s => s.User)
                .Include(a => a.Company)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Assignment> CreateAssignmentAsync(Assignment assignment)
        {
            assignment.CreatedAt = DateTime.UtcNow;
            assignment.AssignedDate = DateTime.UtcNow;
            assignment.Status = 1; // Assigned

            _context.Assignments.Add(assignment);
            
            // Update student status
            var student = await _context.Students.FindAsync(assignment.StudentId);
            if (student != null)
            {
                student.AssignedCompanyId = assignment.CompanyId;
                student.AssignedCompanyName = assignment.CompanyName;
                student.InternshipStatus = 2; // Assigned
                student.StartDate = assignment.StartDate;
            }

            // Update company current internships count
            var company = await _context.Companies.FindAsync(assignment.CompanyId);
            if (company != null)
            {
                company.CurrentInternships++;
            }

            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<Assignment?> UpdateAssignmentAsync(int id, Assignment assignment)
        {
            var existingAssignment = await _context.Assignments.FindAsync(id);
            if (existingAssignment == null)
                return null;

            existingAssignment.StartDate = assignment.StartDate;
            existingAssignment.EndDate = assignment.EndDate;
            existingAssignment.Status = assignment.Status;
            existingAssignment.Progress = assignment.Progress;
            existingAssignment.CertificateIssued = assignment.CertificateIssued;
            existingAssignment.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingAssignment;
        }

        public async Task<bool> DeleteAssignmentAsync(int id)
        {
            var assignment = await _context.Assignments.FindAsync(id);
            if (assignment == null)
                return false;

            // Update student status
            var student = await _context.Students.FindAsync(assignment.StudentId);
            if (student != null)
            {
                student.AssignedCompanyId = null;
                student.AssignedCompanyName = null;
                student.InternshipStatus = 1; // NotAssigned
                student.StartDate = null;
            }

            // Update company current internships count
            var company = await _context.Companies.FindAsync(assignment.CompanyId);
            if (company != null)
            {
                company.CurrentInternships--;
            }

            _context.Assignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Assignment>> GetAssignmentsByStudentAsync(int studentId)
        {
            return await _context.Assignments
                .Include(a => a.Student)
                .ThenInclude(s => s.User)
                .Include(a => a.Company)
                .Where(a => a.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Assignment>> GetAssignmentsByCompanyAsync(int companyId)
        {
            return await _context.Assignments
                .Include(a => a.Student)
                .ThenInclude(s => s.User)
                .Include(a => a.Company)
                .Where(a => a.CompanyId == companyId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Assignment>> GetAssignmentsByManagerAsync(int managerId)
        {
            return await _context.Assignments
                .Include(a => a.Student)
                .ThenInclude(s => s.User)
                .Include(a => a.Company)
                .ThenInclude(c => c.Manager)
                .Where(a => a.Company.ManagerId == managerId)
                .ToListAsync();
        }
    }
}





