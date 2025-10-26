using Microsoft.EntityFrameworkCore;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Services
{
    public class StudentService : IStudentService
    {
        private readonly InternshipPortalContext _context;

        public StudentService(InternshipPortalContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Student>> GetAllStudentsAsync()
        {
            return await _context.Students
                .Include(s => s.User)
                .Include(s => s.Assignments)
                .ToListAsync();
        }

        public async Task<Student?> GetStudentByIdAsync(int id)
        {
            return await _context.Students
                .Include(s => s.User)
                .Include(s => s.Assignments)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Student?> GetStudentByUserIdAsync(int userId)
        {
            return await _context.Students
                .Include(s => s.User)
                .Include(s => s.Assignments)
                .FirstOrDefaultAsync(s => s.UserId == userId);
        }

        public async Task<Student> CreateStudentAsync(Student student)
        {
            student.CreatedAt = DateTime.UtcNow;
            student.HasShownInterest = false;
            student.InternshipStatus = 1; // NotAssigned
            student.CertificateStatus = 1; // NotAvailable

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return student;
        }

        public async Task<Student?> UpdateStudentAsync(int id, Student student)
        {
            var existingStudent = await _context.Students.FindAsync(id);
            if (existingStudent == null)
                return null;

            existingStudent.RegNo = student.RegNo;
            existingStudent.Technology = student.Technology;
            existingStudent.HasShownInterest = student.HasShownInterest;
            existingStudent.AssignedCompanyId = student.AssignedCompanyId;
            existingStudent.AssignedCompanyName = student.AssignedCompanyName;
            existingStudent.InternshipStatus = student.InternshipStatus;
            existingStudent.CertificateStatus = student.CertificateStatus;
            existingStudent.StartDate = student.StartDate;
            existingStudent.EndDate = student.EndDate;
            existingStudent.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingStudent;
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
                return false;

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Student>> GetAvailableStudentsAsync()
        {
            return await _context.Students
                .Include(s => s.User)
                .Where(s => s.HasShownInterest && s.InternshipStatus == 1) // Students with interest and not assigned
                .ToListAsync();
        }
    }
}





