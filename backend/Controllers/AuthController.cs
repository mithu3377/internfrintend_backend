using Microsoft.AspNetCore.Mvc;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InternshipPortal.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly InternshipPortalContext _context;

    public AuthController(InternshipPortalContext context)
    {
        _context = context;
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<ActionResult<User>> Login(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username && u.Password == request.Password);

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid username or password" });
        }

        return Ok(new { 
            user = user,
            token = "dummy-token" // In production, generate JWT token
        });
    }

    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<ActionResult<User>> Register(User user)
    {
        // Check if username already exists
        if (await _context.Users.AnyAsync(u => u.Username == user.Username))
        {
            return BadRequest(new { message = "Username already exists" });
        }

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Login), new { id = user.UserID }, user);
    }

    // GET: api/auth/users
    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

