using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InternshipPortal.API.Services;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for development
    public class AssignmentsController : ControllerBase
    {
        private readonly IAssignmentService _assignmentService;

        public AssignmentsController(IAssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAssignments()
        {
            try
            {
                var assignments = await _assignmentService.GetAllAssignmentsAsync();
                return Ok(assignments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching assignments", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssignment(int id)
        {
            try
            {
                var assignment = await _assignmentService.GetAssignmentByIdAsync(id);
                if (assignment == null)
                    return NotFound(new { message = "Assignment not found" });

                return Ok(assignment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching assignment", error = ex.Message });
            }
        }

        [HttpPost]
        // [Authorize(Roles = "admin")] // Temporarily disabled for development
        public async Task<IActionResult> CreateAssignment([FromBody] Assignment assignment)
        {
            try
            {
                var result = await _assignmentService.CreateAssignmentAsync(assignment);
                return CreatedAtAction(nameof(GetAssignment), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating assignment", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAssignment(int id, [FromBody] Assignment assignment)
        {
            try
            {
                var result = await _assignmentService.UpdateAssignmentAsync(id, assignment);
                if (result == null)
                    return NotFound(new { message = "Assignment not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating assignment", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "admin")] // Temporarily disabled for development
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            try
            {
                var result = await _assignmentService.DeleteAssignmentAsync(id);
                if (!result)
                    return NotFound(new { message = "Assignment not found" });

                return Ok(new { message = "Assignment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting assignment", error = ex.Message });
            }
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetAssignmentsByStudent(int studentId)
        {
            try
            {
                var assignments = await _assignmentService.GetAssignmentsByStudentAsync(studentId);
                return Ok(assignments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching assignments", error = ex.Message });
            }
        }

        [HttpGet("company/{companyId}")]
        public async Task<IActionResult> GetAssignmentsByCompany(int companyId)
        {
            try
            {
                var assignments = await _assignmentService.GetAssignmentsByCompanyAsync(companyId);
                return Ok(assignments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching assignments", error = ex.Message });
            }
        }

        [HttpGet("manager/{managerId}")]
        public async Task<IActionResult> GetAssignmentsByManager(int managerId)
        {
            try
            {
                var assignments = await _assignmentService.GetAssignmentsByManagerAsync(managerId);
                return Ok(assignments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching assignments", error = ex.Message });
            }
        }
    }
}





