using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InternshipPortal.API.Services;
using InternshipPortal.API.Models;

namespace InternshipPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var user = await _authService.LoginAsync(request.Email, request.Password);
                if (user == null)
                    return Unauthorized(new { message = "Invalid email or password" });

                var token = await _authService.GenerateJwtTokenAsync(user);
                
                // Return user data with role as string for frontend
                var userResponse = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role switch
                    {
                        1 => "student",
                        2 => "admin",
                        3 => "manager",
                        _ => "student"
                    },
                    regNo = user.RegNo,
                    technology = user.Technology,
                    companyName = user.CompanyName,
                    createdAt = user.CreatedAt
                };
                
                return Ok(new { token, user = userResponse });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    PasswordHash = request.Password,
                    Role = request.Role == "admin" ? 2 : request.Role == "manager" ? 3 : 1, // Convert string to int
                    RegNo = request.RegistrationNumber,
                    Technology = request.Technology,
                    CompanyName = request.CompanyName
                };

                var result = await _authService.RegisterAsync(user);
                if (result == null)
                    return BadRequest(new { message = "User with this email already exists" });

                var token = await _authService.GenerateJwtTokenAsync(result);
                return Ok(new { token, user = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? "0");
                var user = await _authService.GetUserByIdAsync(userId);
                
                if (user == null)
                    return NotFound(new { message = "User not found" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching profile", error = ex.Message });
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? RegistrationNumber { get; set; }
        public string? Technology { get; set; }
        public string? CompanyName { get; set; }
        public string? AreaOfDevelopment { get; set; }
    }
}





