using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectManager.Api.Models
{
    public class TaskDependency
    {
        // The ID of the task that *has* a dependency
        [Column(Order = 0)]
        public Guid TaskId { get; set; }
        public TaskItem? Task { get; set; }

        // The ID of the task that it *depends on*
        [Column(Order = 1)]
        public Guid DependsOnTaskId { get; set; }
        public TaskItem? DependsOnTask { get; set; }
    }
}