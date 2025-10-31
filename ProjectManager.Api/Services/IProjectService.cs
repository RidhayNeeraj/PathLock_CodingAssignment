using ProjectManager.Api.DTOs;

namespace ProjectManager.Api.Services
{
    public interface IProjectService
    {
        Task<IEnumerable<ProjectDto>> GetProjectsAsync(Guid userId);
        Task<ProjectDto?> GetProjectByIdAsync(Guid projectId, Guid userId);
        Task<ProjectDto> CreateProjectAsync(ProjectCreateDto projectDto, Guid userId);
        Task<bool> DeleteProjectAsync(Guid projectId, Guid userId);

        Task<TaskDto?> CreateTaskAsync(TaskCreateDto taskDto, Guid projectId, Guid userId);
        Task<bool> UpdateTaskAsync(Guid taskId, TaskUpdateDto taskDto, Guid userId);
        Task<bool> DeleteTaskAsync(Guid taskId, Guid userId);
        
        // It now takes projectId and userId, and returns the schedule DTO
        Task<SchedulerOutputDto> GetTaskScheduleAsync(Guid projectId, Guid userId);
    }
}