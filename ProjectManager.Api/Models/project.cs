using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.Models
{
    public class Project
    {
        public Guid Id { get; set; }
        [Required, StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;
        [StringLength(500)]
        public string? Description { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;

        // Foreign Key for the User
        public Guid UserId { get; set; }
        public User? User { get; set; }

        // Navigation property: A project can have many tasks
        public List<TaskItem> Tasks { get; set; } = new();
    }
}