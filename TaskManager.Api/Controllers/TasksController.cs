using Microsoft.AspNetCore.Mvc;
using TaskManager.Api.Models;
using TaskManager.Api.Services;

namespace TaskManager.Api.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetTasks()
        {
            return Ok(_taskService.GetAll());
        }

        [HttpPost]
        public ActionResult<TaskItem> AddTask([FromBody] TaskCreateDto taskDto)
        {
            if (string.IsNullOrWhiteSpace(taskDto.Description))
            {
                return BadRequest("Description is required.");
            }
            var newTask = _taskService.Add(taskDto.Description);
            return Ok(newTask);
        }

        [HttpPut("{id}")]
        public IActionResult ToggleTask(Guid id)
        {
            _taskService.Update(id);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(Guid id)
        {
            _taskService.Delete(id);
            return NoContent();
        }
    }

    public class TaskCreateDto
    {
        public string Description { get; set; }
    }
}