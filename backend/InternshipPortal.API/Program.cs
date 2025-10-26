using Microsoft.EntityFrameworkCore;
using InternshipPortal.API.Data;
using InternshipPortal.API.Services;
using InternshipPortal.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<InternshipPortalContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactNative", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// Add Authorization
builder.Services.AddAuthorization();

// Add Scoped Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICompanyService, CompanyService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddScoped<ICertificateService, CertificateService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    // Disable HTTPS redirection in development for easier testing
    // app.UseHttpsRedirection();
}
else
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowReactNative");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<InternshipPortalContext>();
    
    // Create new database with correct schema
    context.Database.EnsureCreated();
    
    // Seed data if no users exist
    if (!context.Users.Any())
    {
        var users = new List<User>
        {
            new User { Id = 1, Name = "Admin User", Email = "nauman@admin.com", PasswordHash = "Admin123", Role = 2, CreatedAt = DateTime.UtcNow },
            new User { Id = 2, Name = "Student User", Email = "ali@student.com", PasswordHash = "Pass789", Role = 1, RegNo = "STU001", Technology = "React Native", CreatedAt = DateTime.UtcNow },
            new User { Id = 3, Name = "Qadis Student", Email = "qadis@student.com", PasswordHash = "Student456", Role = 1, RegNo = "STU002", Technology = "Web Development", CreatedAt = DateTime.UtcNow },
            new User { Id = 4, Name = "Daud Student", Email = "daud@student.com", PasswordHash = "Daud2024", Role = 1, RegNo = "STU003", Technology = "Mobile Development", CreatedAt = DateTime.UtcNow },
            new User { Id = 5, Name = "Manager User", Email = "manager@company.com", PasswordHash = "Manager321", Role = 3, CompanyName = "Tech Corp", CreatedAt = DateTime.UtcNow },
            new User { Id = 6, Name = "John Manager", Email = "john@techcorp.com", PasswordHash = "John@Tech", Role = 3, CompanyName = "Tech Corp", CreatedAt = DateTime.UtcNow }
        };
        
        context.Users.AddRange(users);
        context.SaveChanges();
        
        Console.WriteLine("Seed data added successfully!");
    }
    
    Console.WriteLine("Database created successfully!");
        Console.WriteLine("Available users:");
        Console.WriteLine("Admin: nauman@admin.com / Admin123");
        Console.WriteLine("Student: ali@student.com / Pass789");
        Console.WriteLine("Student: qadis@student.com / Student456");
        Console.WriteLine("Student: daud@student.com / Daud2024");
        Console.WriteLine("Manager: manager@company.com / Manager321");
        Console.WriteLine("Manager: john@techcorp.com / John@Tech");
}

app.Run();
