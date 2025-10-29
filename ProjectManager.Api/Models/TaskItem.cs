using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.Models
{
    public class TaskItem
    {
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; } = false;
    
        // Foreign Key for the Project
        public Guid ProjectId { get; set; }
        public Project? Project { get; set; }

        // --- NEW NAVIGATION PROPERTIES ---
        // List of tasks this task depends on
        public List<TaskDependency> Dependencies { get; set; } = new();
        
        // List of tasks that depend on this task
        public List<TaskDependency> IsDependencyFor { get; set; } = new();
    }
}