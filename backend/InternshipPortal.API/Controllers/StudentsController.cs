using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InternshipPortal.API.Services;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Temporarily disabled for development
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _studentService;

        public StudentsController(IStudentService studentService)
        {
            _studentService = studentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            try
            {
                var students = await _studentService.GetAllStudentsAsync();
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching students", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(int id)
        {
            try
            {
                var student = await _studentService.GetStudentByIdAsync(id);
                if (student == null)
                    return NotFound(new { message = "Student not found" });

                return Ok(student);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching student", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetStudentByUserId(int userId)
        {
            try
            {
                var student = await _studentService.GetStudentByUserIdAsync(userId);
                if (student == null)
                    return NotFound(new { message = "Student not found" });

                return Ok(student);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching student", error = ex.Message });
            }
        }

        [HttpPost]
        // [Authorize(Roles = "admin")] // Temporarily disabled for development
        public async Task<IActionResult> CreateStudent([FromBody] Student student)
        {
            try
            {
                var result = await _studentService.CreateStudentAsync(student);
                return CreatedAtAction(nameof(GetStudent), new { id = result.Id }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating student", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromBody] Student student)
        {
            try
            {
                var result = await _studentService.UpdateStudentAsync(id, student);
                if (result == null)
                    return NotFound(new { message = "Student not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating student", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "admin")] // Temporarily disabled for development
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                var result = await _studentService.DeleteStudentAsync(id);
                if (!result)
                    return NotFound(new { message = "Student not found" });

                return Ok(new { message = "Student deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting student", error = ex.Message });
            }
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableStudents()
        {
            try
            {
                var students = await _studentService.GetAvailableStudentsAsync();
                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching available students", error = ex.Message });
            }
        }
    }
}





