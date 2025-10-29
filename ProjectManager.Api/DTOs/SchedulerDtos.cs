using System.ComponentModel.DataAnnotations;

namespace ProjectManager.Api.DTOs
{
    // DTO for the input task
    public class SchedulerTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public List<string> Dependencies { get; set; } = new();
    }

    // DTO for the overall input (THIS IS THE MISSING CLASS)
    public class SchedulerInputDto
    {
        public List<SchedulerTaskDto> Tasks { get; set; } = new();
    }

    // DTO for the output
    public class SchedulerOutputDto
    {
        public List<string> RecommendedOrder { get; set; } = new();
    }
}