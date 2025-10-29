using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.DTOs
{
    // DTO for viewing a task
    public class TaskDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        
        // --- ADD THIS ---
        // We'll send back the IDs of the tasks this one depends on
        public List<Guid> DependencyIds { get; set; } = new();
    }

    // DTO for creating a new task
    public class TaskCreateDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        
        // --- ADD THIS ---
        public List<Guid> DependencyIds { get; set; } = new();
    }

    // DTO for updating a task
    public class TaskUpdateDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        
        // --- ADD THIS ---
        public List<Guid> DependencyIds { get; set; } = new();
    }
}