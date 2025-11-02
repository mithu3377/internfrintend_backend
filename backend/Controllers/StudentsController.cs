using Microsoft.AspNetCore.Mvc;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly InternshipPortalContext _context;

    public StudentsController(InternshipPortalContext context)
    {
        _context = context;
    }

    // GET: api/students
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
    {
        return await _context.Students.ToListAsync();
    }

    // GET: api/students/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Student>> GetStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);

        if (student == null)
        {
            return NotFound();
        }

        return student;
    }

    // GET: api/students/user/5
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<Student>> GetStudentByUserId(int userId)
    {
        var student = await _context.Students
            .FirstOrDefaultAsync(s => s.UserID == userId);

        if (student == null)
        {
            return NotFound();
        }

        return student;
    }

    // GET: api/students/available
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<Student>>> GetAvailableStudents()
    {
        return await _context.Students
            .Where(s => s.InternshipStatus == 1 && s.HasShownInterest)
            .ToListAsync();
    }

    // POST: api/students
    [HttpPost]
    public async Task<ActionResult<Student>> PostStudent(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetStudent), new { id = student.StudentID }, student);
    }

    // PUT: api/students/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutStudent(int id, Student student)
    {
        if (id != student.StudentID)
        {
            return BadRequest();
        }

        _context.Entry(student).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StudentExists(id))
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

    // DELETE: api/students/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null)
        {
            return NotFound();
        }

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool StudentExists(int id)
    {
        return _context.Students.Any(e => e.StudentID == id);
    }
}

