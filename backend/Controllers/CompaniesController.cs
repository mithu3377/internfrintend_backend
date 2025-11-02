using Microsoft.AspNetCore.Mvc;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CompaniesController : ControllerBase
{
    private readonly InternshipPortalContext _context;

    public CompaniesController(InternshipPortalContext context)
    {
        _context = context;
    }

    // GET: api/companies
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Company>>> GetCompanies()
    {
        return await _context.Companies.ToListAsync();
    }

    // GET: api/companies/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Company>> GetCompany(int id)
    {
        var company = await _context.Companies.FindAsync(id);

        if (company == null)
        {
            return NotFound();
        }

        return company;
    }

    // GET: api/companies/manager/5
    [HttpGet("manager/{managerId}")]
    public async Task<ActionResult<IEnumerable<Company>>> GetCompaniesByManager(int managerId)
    {
        return await _context.Companies
            .Where(c => c.ManagerID == managerId)
            .ToListAsync();
    }

    // POST: api/companies
    [HttpPost]
    public async Task<ActionResult<Company>> PostCompany(Company company)
    {
        _context.Companies.Add(company);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCompany), new { id = company.CompanyID }, company);
    }

    // PUT: api/companies/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutCompany(int id, Company company)
    {
        if (id != company.CompanyID)
        {
            return BadRequest();
        }

        _context.Entry(company).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!CompanyExists(id))
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

    // DELETE: api/companies/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCompany(int id)
    {
        var company = await _context.Companies.FindAsync(id);
        if (company == null)
        {
            return NotFound();
        }

        _context.Companies.Remove(company);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool CompanyExists(int id)
    {
        return _context.Companies.Any(e => e.CompanyID == id);
    }
}

