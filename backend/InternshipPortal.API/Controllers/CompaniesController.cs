using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InternshipPortal.API.Services;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for development
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompaniesController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCompanies()
        {
            try
            {
                var companies = await _companyService.GetAllCompaniesAsync();
                return Ok(companies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching companies", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompany(int id)
        {
            try
            {
                var company = await _companyService.GetCompanyByIdAsync(id);
                if (company == null)
                    return NotFound(new { message = "Company not found" });

                return Ok(company);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching company", error = ex.Message });
            }
        }

        [HttpPost]
        // [Authorize(Roles = "admin")] // Temporarily disabled for development
        public async Task<IActionResult> CreateCompany([FromBody] Company company)
        {
            try
            {
                // Validate model state
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                    return BadRequest(new { message = "Validation failed", errors = errors });
                }

                var result = await _companyService.CreateCompanyAsync(company);
                return CreatedAtAction(nameof(GetCompany), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating company", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        // [Authorize(Roles = "admin")] // Temporarily disabled for development
        public async Task<IActionResult> UpdateCompany(int id, [FromBody] Company company)
        {
            try
            {
                var result = await _companyService.UpdateCompanyAsync(id, company);
                if (result == null)
                    return NotFound(new { message = "Company not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating company", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "admin")] // Temporarily disabled for development
        public async Task<IActionResult> DeleteCompany(int id)
        {
            try
            {
                var result = await _companyService.DeleteCompanyAsync(id);
                if (!result)
                    return NotFound(new { message = "Company not found" });

                return Ok(new { message = "Company deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting company", error = ex.Message });
            }
        }

        [HttpGet("manager/{managerId}")]
        public async Task<IActionResult> GetCompaniesByManager(int managerId)
        {
            try
            {
                var companies = await _companyService.GetCompaniesByManagerAsync(managerId);
                return Ok(companies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching companies", error = ex.Message });
            }
        }
    }
}





