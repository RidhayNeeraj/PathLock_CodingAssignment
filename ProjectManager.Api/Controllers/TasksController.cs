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
    public class TasksController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public TasksController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        // Helper method to get the logged-in user's ID
        private Guid GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.Parse(userId!);
        }

        // PUT: /api/tasks/{taskId}
        [HttpPut("{taskId}")]
        public async Task<IActionResult> UpdateTask(Guid taskId, TaskUpdateDto taskDto)
        {
            var result = await _projectService.UpdateTaskAsync(taskId, taskDto, GetUserId());
            return result ? NoContent() : NotFound();
        }

        // DELETE: /api/tasks/{taskId}
        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(Guid taskId)
        {
            var result = await _projectService.DeleteTaskAsync(taskId, GetUserId());
            return result ? NoContent() : NotFound();
        }
    }
}