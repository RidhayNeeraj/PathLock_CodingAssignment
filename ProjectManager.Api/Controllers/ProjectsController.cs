using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManager.Api.DTOs;
using ProjectManager.Api.Services;
using System.Security.Claims;

namespace ProjectManager.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;
        public ProjectsController(IProjectService projectService) { _projectService = projectService; }
        private Guid GetUserId() { return Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!); }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _projectService.GetProjectsAsync(GetUserId());
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(Guid id)
        {
            var project = await _projectService.GetProjectByIdAsync(id, GetUserId());
            return project == null ? NotFound() : Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject(ProjectCreateDto projectDto)
        {
            var project = await _projectService.CreateProjectAsync(projectDto, GetUserId()); 
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            var result = await _projectService.DeleteProjectAsync(id, GetUserId());
            return result ? NoContent() : NotFound();
        }

        [HttpPost("{projectId}/tasks")]
        public async Task<IActionResult> CreateTask(Guid projectId, TaskCreateDto taskDto)
        {
            var task = await _projectService.CreateTaskAsync(taskDto, projectId, GetUserId());
            return task == null ? NotFound("Project not found or user not authorized.") : Ok(task);
        }
        
        [HttpPost("{projectId}/schedule")]
        public async Task<IActionResult> GetSchedule(Guid projectId)
        {
            var output = await _projectService.GetTaskScheduleAsync(projectId, GetUserId());
            return Ok(output);
        }
    }
}