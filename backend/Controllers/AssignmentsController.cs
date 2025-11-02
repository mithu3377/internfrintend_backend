using Microsoft.AspNetCore.Mvc;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssignmentsController : ControllerBase
{
    private readonly InternshipPortalContext _context;

    public AssignmentsController(InternshipPortalContext context)
    {
        _context = context;
    }

    // GET: api/assignments
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignments()
    {
        return await _context.Assignments.ToListAsync();
    }

    // GET: api/assignments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Assignment>> GetAssignment(int id)
    {
        var assignment = await _context.Assignments.FindAsync(id);

        if (assignment == null)
        {
            return NotFound();
        }

        return assignment;
    }

    // GET: api/assignments/student/5
    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignmentsByStudent(int studentId)
    {
        return await _context.Assignments
            .Where(a => a.StudentID == studentId)
            .ToListAsync();
    }

    // GET: api/assignments/company/5
    [HttpGet("company/{companyId}")]
    public async Task<ActionResult<IEnumerable<Assignment>>> GetAssignmentsByCompany(int companyId)
    {
        return await _context.Assignments
            .Where(a => a.CompanyID == companyId)
            .ToListAsync();
    }

    // POST: api/assignments
    [HttpPost]
    public async Task<ActionResult<Assignment>> PostAssignment(Assignment assignment)
    {
        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAssignment), new { id = assignment.AssignmentID }, assignment);
    }

    // PUT: api/assignments/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutAssignment(int id, Assignment assignment)
    {
        if (id != assignment.AssignmentID)
        {
            return BadRequest();
        }

        _context.Entry(assignment).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AssignmentExists(id))
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

    // DELETE: api/assignments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAssignment(int id)
    {
        var assignment = await _context.Assignments.FindAsync(id);
        if (assignment == null)
        {
            return NotFound();
        }

        _context.Assignments.Remove(assignment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AssignmentExists(int id)
    {
        return _context.Assignments.Any(e => e.AssignmentID == id);
    }
}

