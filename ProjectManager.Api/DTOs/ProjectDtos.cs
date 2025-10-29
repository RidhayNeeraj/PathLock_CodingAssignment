using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.DTOs
{
    // DTO for creating a new project
    public class ProjectCreateDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }
    }

    // DTO for viewing a single project (including its tasks)
    public class ProjectDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime CreationDate { get; set; }
        public List<TaskDto> Tasks { get; set; } = new();
    }
}