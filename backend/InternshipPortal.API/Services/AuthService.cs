using Microsoft.EntityFrameworkCore;
using InternshipPortal.API.Data;
using InternshipPortal.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace InternshipPortal.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly InternshipPortalContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(InternshipPortalContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<User?> LoginAsync(string email, string password)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
                return null;

            // Try plain text comparison first (for Program.cs seeded users)
            if (user.PasswordHash == password)
                return user;

            // Try BCrypt verification (for Entity Framework seeded users)
            try
            {
                if (BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                    return user;
            }
            catch
            {
                // If BCrypt verification fails, continue to return null
            }

            return null;
        }

        public async Task<User?> RegisterAsync(User user)
        {
            // Check if user already exists
            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
                return null;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            user.CreatedAt = DateTime.UtcNow;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<string> GenerateJwtTokenAsync(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var roleName = user.Role switch
            {
                1 => "student",
                2 => "admin", 
                3 => "manager",
                _ => "student"
            };

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, roleName)
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }
    }
}





