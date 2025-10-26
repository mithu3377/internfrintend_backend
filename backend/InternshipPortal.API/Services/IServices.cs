using InternshipPortal.API.Models;

namespace InternshipPortal.API.Services
{
    public interface IAuthService
    {
        Task<User?> LoginAsync(string email, string password);
        Task<User?> RegisterAsync(User user);
        Task<string> GenerateJwtTokenAsync(User user);
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
    }

    public interface ICompanyService
    {
        Task<IEnumerable<Company>> GetAllCompaniesAsync();
        Task<Company?> GetCompanyByIdAsync(int id);
        Task<Company> CreateCompanyAsync(Company company);
        Task<Company?> UpdateCompanyAsync(int id, Company company);
        Task<bool> DeleteCompanyAsync(int id);
        Task<IEnumerable<Company>> GetCompaniesByManagerAsync(int managerId);
    }

    public interface IStudentService
    {
        Task<IEnumerable<Student>> GetAllStudentsAsync();
        Task<Student?> GetStudentByIdAsync(int id);
        Task<Student?> GetStudentByUserIdAsync(int userId);
        Task<Student> CreateStudentAsync(Student student);
        Task<Student?> UpdateStudentAsync(int id, Student student);
        Task<bool> DeleteStudentAsync(int id);
        Task<IEnumerable<Student>> GetAvailableStudentsAsync();
    }

    public interface IAssignmentService
    {
        Task<IEnumerable<Assignment>> GetAllAssignmentsAsync();
        Task<Assignment?> GetAssignmentByIdAsync(int id);
        Task<Assignment> CreateAssignmentAsync(Assignment assignment);
        Task<Assignment?> UpdateAssignmentAsync(int id, Assignment assignment);
        Task<bool> DeleteAssignmentAsync(int id);
        Task<IEnumerable<Assignment>> GetAssignmentsByStudentAsync(int studentId);
        Task<IEnumerable<Assignment>> GetAssignmentsByCompanyAsync(int companyId);
        Task<IEnumerable<Assignment>> GetAssignmentsByManagerAsync(int managerId);
    }

    public interface ICertificateService
    {
        Task<IEnumerable<Certificate>> GetAllCertificatesAsync();
        Task<Certificate?> GetCertificateByIdAsync(int id);
        Task<Certificate> CreateCertificateAsync(Certificate certificate);
        Task<Certificate?> UpdateCertificateAsync(int id, Certificate certificate);
        Task<bool> DeleteCertificateAsync(int id);
        Task<IEnumerable<Certificate>> GetCertificatesByStudentAsync(int studentId);
        Task<IEnumerable<Certificate>> GetCertificatesByCompanyAsync(int companyId);
    }
}


