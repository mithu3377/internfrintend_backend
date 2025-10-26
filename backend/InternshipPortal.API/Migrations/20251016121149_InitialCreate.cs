using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace InternshipPortal.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    RegNo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CompanyName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Technology = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Area = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    MaxInternships = table.Column<int>(type: "int", nullable: false),
                    CurrentInternships = table.Column<int>(type: "int", nullable: false),
                    ManagerId = table.Column<int>(type: "int", nullable: false),
                    ManagerName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ManagerEmail = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Companies_Users_ManagerId",
                        column: x => x.ManagerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RegNo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Technology = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    HasShownInterest = table.Column<bool>(type: "bit", nullable: false),
                    AssignedCompanyId = table.Column<int>(type: "int", nullable: true),
                    AssignedCompanyName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    InternshipStatus = table.Column<int>(type: "int", nullable: false),
                    CertificateStatus = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Students_Companies_AssignedCompanyId",
                        column: x => x.AssignedCompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Students_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Assignments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    StudentName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Progress = table.Column<int>(type: "int", nullable: true),
                    CertificateIssued = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Assignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Assignments_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Assignments_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Assignments_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Certificates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AssignmentId = table.Column<int>(type: "int", nullable: false),
                    StudentId = table.Column<int>(type: "int", nullable: false),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    CertificateNumber = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StudentName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    CompanyName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IssueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Duration = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SkillsAcquired = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ProjectDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CertificateUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certificates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Certificates_Assignments_AssignmentId",
                        column: x => x.AssignmentId,
                        principalTable: "Assignments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Certificates_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Certificates_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CompanyName", "CreatedAt", "Email", "Name", "PasswordHash", "RegNo", "Role", "Technology", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, null, new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4117), "nauman@admin.com", "M.Nauman", "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", null, 2, null, null },
                    { 2, null, new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4121), "qadis@student.com", "Qadis Parvez", "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", "2021-Arid-4566", 1, "Flutter", null },
                    { 3, null, new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4126), "ali@student.com", "Ali Haider", "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", "2021-Arid-4404", 1, "React Native", null },
                    { 4, null, new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4129), "daud@student.com", "Daud Ansar", "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", "2020-Arid-0126", 1, "React JS", null },
                    { 5, "TechCorp Solutions", new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4132), "manager@company.com", "Manager Name", "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", null, 3, "Frontend Development", null },
                    { 6, "TechCorp Solutions", new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4136), "john@techcorp.com", "John Smith", "$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", null, 3, "Backend Development", null }
                });

            migrationBuilder.InsertData(
                table: "Companies",
                columns: new[] { "Id", "Area", "CreatedAt", "CurrentInternships", "IsActive", "ManagerEmail", "ManagerId", "ManagerName", "MaxInternships", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Frontend Development", new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4466), 0, true, "manager@company.com", 5, "Manager Name", 3, "TechCorp Solutions", null },
                    { 2, "Backend Development", new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4470), 0, true, "john@techcorp.com", 6, "John Smith", 2, "TechCorp Solutions", null },
                    { 3, "Data Science", new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4474), 0, true, "manager@company.com", 5, "Manager Name", 4, "DataFlow Inc", null },
                    { 4, "DevOps", new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4476), 0, true, "john@techcorp.com", 6, "John Smith", 2, "CloudTech", null },
                    { 5, "Mobile Development", new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4479), 0, true, "manager@company.com", 5, "Manager Name", 3, "InnovateLab", null }
                });

            migrationBuilder.InsertData(
                table: "Students",
                columns: new[] { "Id", "AssignedCompanyId", "AssignedCompanyName", "CertificateStatus", "CreatedAt", "EndDate", "HasShownInterest", "InternshipStatus", "RegNo", "StartDate", "Technology", "UpdatedAt", "UserId" },
                values: new object[,]
                {
                    { 1, null, null, 1, new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4515), null, false, 1, "2021-Arid-4566", null, "Flutter", null, 2 },
                    { 2, null, null, 1, new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4520), null, true, 1, "2021-Arid-4404", null, "React Native", null, 3 },
                    { 3, null, null, 1, new DateTime(2025, 10, 16, 12, 11, 48, 955, DateTimeKind.Utc).AddTicks(4523), null, true, 1, "2020-Arid-0126", null, "React JS", null, 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_CompanyId",
                table: "Assignments",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_StudentId",
                table: "Assignments",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_UserId",
                table: "Assignments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_AssignmentId",
                table: "Certificates",
                column: "AssignmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_CertificateNumber",
                table: "Certificates",
                column: "CertificateNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_CompanyId",
                table: "Certificates",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_StudentId",
                table: "Certificates",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Companies_ManagerId",
                table: "Companies",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_AssignedCompanyId",
                table: "Students",
                column: "AssignedCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_RegNo",
                table: "Students",
                column: "RegNo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_UserId",
                table: "Students",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Certificates");

            migrationBuilder.DropTable(
                name: "Assignments");

            migrationBuilder.DropTable(
                name: "Students");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
