using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.Models
{
    public class User
    {
        public Guid Id { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation property: A user can have many projects
        public List<Project> Projects { get; set; } = new();
    }
}