using Microsoft.AspNetCore.Mvc;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertificatesController : ControllerBase
{
    private readonly InternshipPortalContext _context;

    public CertificatesController(InternshipPortalContext context)
    {
        _context = context;
    }

    // GET: api/certificates
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Certificate>>> GetCertificates()
    {
        return await _context.Certificates.ToListAsync();
    }

    // GET: api/certificates/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Certificate>> GetCertificate(int id)
    {
        var certificate = await _context.Certificates.FindAsync(id);

        if (certificate == null)
        {
            return NotFound();
        }

        return certificate;
    }

    // GET: api/certificates/student/5
    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<IEnumerable<Certificate>>> GetCertificatesByStudent(int studentId)
    {
        return await _context.Certificates
            .Where(c => c.StudentID == studentId)
            .ToListAsync();
    }

    // GET: api/certificates/company/5
    [HttpGet("company/{companyId}")]
    public async Task<ActionResult<IEnumerable<Certificate>>> GetCertificatesByCompany(int companyId)
    {
        return await _context.Certificates
            .Where(c => c.CompanyID == companyId)
            .ToListAsync();
    }

    // POST: api/certificates
    [HttpPost]
    public async Task<ActionResult<Certificate>> PostCertificate(Certificate certificate)
    {
        _context.Certificates.Add(certificate);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCertificate), new { id = certificate.CertificateID }, certificate);
    }

    // PUT: api/certificates/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCertificate(int id, Certificate certificate)
    {
        if (id != certificate.CertificateID)
        {
            return BadRequest();
        }

        _context.Entry(certificate).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CertificateExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/certificates/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCertificate(int id)
    {
        var certificate = await _context.Certificates.FindAsync(id);
        if (certificate == null)
        {
            return NotFound();
        }

        _context.Certificates.Remove(certificate);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CertificateExists(int id)
    {
        return _context.Certificates.Any(e => e.CertificateID == id);
    }
}

