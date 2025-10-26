using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InternshipPortal.API.Services;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for development
    public class CertificatesController : ControllerBase
    {
        private readonly ICertificateService _certificateService;

        public CertificatesController(ICertificateService certificateService)
        {
            _certificateService = certificateService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCertificates()
        {
            try
            {
                var certificates = await _certificateService.GetAllCertificatesAsync();
                return Ok(certificates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching certificates", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCertificate(int id)
        {
            try
            {
                var certificate = await _certificateService.GetCertificateByIdAsync(id);
                if (certificate == null)
                    return NotFound(new { message = "Certificate not found" });

                return Ok(certificate);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching certificate", error = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateCertificate([FromBody] Certificate certificate)
        {
            try
            {
                var result = await _certificateService.CreateCertificateAsync(certificate);
                return CreatedAtAction(nameof(GetCertificate), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating certificate", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> UpdateCertificate(int id, [FromBody] Certificate certificate)
        {
            try
            {
                var result = await _certificateService.UpdateCertificateAsync(id, certificate);
                if (result == null)
                    return NotFound(new { message = "Certificate not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating certificate", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteCertificate(int id)
        {
            try
            {
                var result = await _certificateService.DeleteCertificateAsync(id);
                if (!result)
                    return NotFound(new { message = "Certificate not found" });

                return Ok(new { message = "Certificate deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting certificate", error = ex.Message });
            }
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetCertificatesByStudent(int studentId)
        {
            try
            {
                var certificates = await _certificateService.GetCertificatesByStudentAsync(studentId);
                return Ok(certificates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching certificates", error = ex.Message });
            }
        }

        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetCertificatesByCompany(int companyId)
        {
            try
            {
                var certificates = await _certificateService.GetCertificatesByCompanyAsync(companyId);
                return Ok(certificates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching certificates", error = ex.Message });
            }
        }
    }
}





