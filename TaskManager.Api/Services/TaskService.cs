using TaskManager.Api.Models;
using System.Collections.Concurrent;

namespace TaskManager.Api.Services
{
    public class TaskService : ITaskService
    {
        private static readonly ConcurrentDictionary<Guid, TaskItem> _tasks = new();

        public TaskItem Add(string description)
        {
            var task = new TaskItem
            {
                Id = Guid.NewGuid(),
                Description = description,
                IsCompleted = false
            };
            _tasks[task.Id] = task;
            return task;
        }

        public void Delete(Guid id)
        {
            _tasks.TryRemove(id, out _);
        }

        public IEnumerable<TaskItem> GetAll()
        {
            return _tasks.Values.OrderBy(t => t.Description);
        }

        public void Update(Guid id)
        {
            if (_tasks.TryGetValue(id, out var task))
            {
                task.IsCompleted = !task.IsCompleted;
            }
        }
    }
}