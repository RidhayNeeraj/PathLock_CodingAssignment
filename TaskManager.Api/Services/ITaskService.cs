using TaskManager.Api.Models;

namespace TaskManager.Api.Services
{
    public interface ITaskService
    {
        IEnumerable<TaskItem> GetAll();
        TaskItem Add(string description);
        void Update(Guid id);
        void Delete(Guid id);
    }
}