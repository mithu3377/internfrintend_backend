using Microsoft.EntityFrameworkCore;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Services
{
    public class CertificateService : ICertificateService
    {
        private readonly InternshipPortalContext _context;

        public CertificateService(InternshipPortalContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Certificate>> GetAllCertificatesAsync()
        {
            return await _context.Certificates
                .Include(c => c.Student)
                .ThenInclude(s => s.User)
                .Include(c => c.Company)
                .Include(c => c.Assignment)
                .ToListAsync();
        }

        public async Task<Certificate?> GetCertificateByIdAsync(int id)
        {
            return await _context.Certificates
                .Include(c => c.Student)
                .ThenInclude(s => s.User)
                .Include(c => c.Company)
                .Include(c => c.Assignment)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Certificate> CreateCertificateAsync(Certificate certificate)
        {
            certificate.CreatedAt = DateTime.UtcNow;
            certificate.CertificateNumber = GenerateCertificateNumber();

            _context.Certificates.Add(certificate);
            await _context.SaveChangesAsync();

            return certificate;
        }

        public async Task<Certificate?> UpdateCertificateAsync(int id, Certificate certificate)
        {
            var existingCertificate = await _context.Certificates.FindAsync(id);
            if (existingCertificate == null)
                return null;

            existingCertificate.StudentName = certificate.StudentName;
            existingCertificate.CompanyName = certificate.CompanyName;
            existingCertificate.IssueDate = certificate.IssueDate;
            existingCertificate.Duration = certificate.Duration;
            existingCertificate.SkillsAcquired = certificate.SkillsAcquired;
            existingCertificate.ProjectDescription = certificate.ProjectDescription;
            existingCertificate.CertificateUrl = certificate.CertificateUrl;
            existingCertificate.IsVerified = certificate.IsVerified;
            existingCertificate.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingCertificate;
        }

        public async Task<bool> DeleteCertificateAsync(int id)
        {
            var certificate = await _context.Certificates.FindAsync(id);
            if (certificate == null)
                return false;

            _context.Certificates.Remove(certificate);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<Certificate>> GetCertificatesByStudentAsync(int studentId)
        {
            return await _context.Certificates
                .Include(c => c.Student)
                .ThenInclude(s => s.User)
                .Include(c => c.Company)
                .Include(c => c.Assignment)
                .Where(c => c.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Certificate>> GetCertificatesByCompanyAsync(int companyId)
        {
            return await _context.Certificates
                .Include(c => c.Student)
                .ThenInclude(s => s.User)
                .Include(c => c.Company)
                .Include(c => c.Assignment)
                .Where(c => c.CompanyId == companyId)
                .ToListAsync();
        }

        private string GenerateCertificateNumber()
        {
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var random = new Random().Next(1000, 9999);
            return $"CERT-{timestamp}-{random}";
        }
    }
}





