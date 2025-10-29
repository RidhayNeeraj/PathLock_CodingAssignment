using Microsoft.EntityFrameworkCore;
using ProjectManager.Api.Data;
using ProjectManager.Api.DTOs;
using ProjectManager.Api.Models;

namespace ProjectManager.Api.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;

        public ProjectService(AppDbContext context)
        {
            _context = context;
        }

        // --- PROJECT METHODS (Unchanged) ---

        public async Task<ProjectDto> CreateProjectAsync(ProjectCreateDto projectDto, Guid userId)
        {
            var project = new Project
            {
                Title = projectDto.Title,
                Description = projectDto.Description,
                UserId = userId,
                CreationDate = DateTime.UtcNow
            };
            await _context.Projects.AddAsync(project);
            await _context.SaveChangesAsync();
            return new ProjectDto { Id = project.Id, Title = project.Title, Description = project.Description, CreationDate = project.CreationDate };
        }

        public async Task<bool> DeleteProjectAsync(Guid projectId, Guid userId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
            if (project == null) return false;
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }

        // --- UPDATED GetProjectByIdAsync ---
        public async Task<ProjectDto?> GetProjectByIdAsync(Guid projectId, Guid userId)
        {
            var project = await _context.Projects
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.Dependencies) // Load the dependencies for each task
                .Where(p => p.Id == projectId && p.UserId == userId)
                .Select(p => new ProjectDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    CreationDate = p.CreationDate,
                    Tasks = p.Tasks.Select(t => new TaskDto
                    {
                        Id = t.Id,
                        Title = t.Title,
                        DueDate = t.DueDate,
                        IsCompleted = t.IsCompleted,
                        // Populate the list of dependency IDs
                        DependencyIds = t.Dependencies.Select(d => d.DependsOnTaskId).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync();
            
            return project;
        }

        // --- GetProjectsAsync (Unchanged) ---
        public async Task<IEnumerable<ProjectDto>> GetProjectsAsync(Guid userId)
        {
            return await _context.Projects.Where(p => p.UserId == userId)
                .Select(p => new ProjectDto { Id = p.Id, Title = p.Title, Description = p.Description, CreationDate = p.CreationDate, Tasks = new List<TaskDto>() })
                .ToListAsync();
        }

        // --- UPDATED CreateTaskAsync ---
        public async Task<TaskDto?> CreateTaskAsync(TaskCreateDto taskDto, Guid projectId, Guid userId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
            if (project == null) return null;

            var task = new TaskItem
            {
                Title = taskDto.Title,
                DueDate = taskDto.DueDate,
                IsCompleted = false,
                ProjectId = projectId
            };
            
            // Add dependencies
            foreach (var depId in taskDto.DependencyIds)
            {
                // Ensure the dependency is part of the same project
                var depTask = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == depId && t.ProjectId == projectId);
                if (depTask != null)
                {
                    task.Dependencies.Add(new TaskDependency { DependsOnTaskId = depId });
                }
            }

            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();

            return new TaskDto { Id = task.Id, Title = task.Title, DueDate = task.DueDate, IsCompleted = task.IsCompleted, DependencyIds = taskDto.DependencyIds };
        }

        // --- UPDATED UpdateTaskAsync ---
        public async Task<bool> UpdateTaskAsync(Guid taskId, TaskUpdateDto taskDto, Guid userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .Include(t => t.Dependencies) // Load existing dependencies
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project!.UserId == userId);
            if (task == null) return false;

            task.Title = taskDto.Title;
            task.DueDate = taskDto.DueDate;
            task.IsCompleted = taskDto.IsCompleted;
            
            // --- Update Dependencies ---
            // Remove old dependencies
            _context.TaskDependencies.RemoveRange(task.Dependencies);
            
            // Add new ones
            var newDependencies = new List<TaskDependency>();
            foreach (var depId in taskDto.DependencyIds)
            {
                // Ensure dependency exists and is in the same project
                var depTask = await _context.Tasks.FirstOrDefaultAsync(t => t.Id == depId && t.ProjectId == task.ProjectId);
                if (depTask != null && depId != task.Id) // A task can't depend on itself
                {
                    newDependencies.Add(new TaskDependency { TaskId = taskId, DependsOnTaskId = depId });
                }
            }
            await _context.TaskDependencies.AddRangeAsync(newDependencies);
            
            await _context.SaveChangesAsync();
            return true;
        }

        // --- UPDATED DeleteTaskAsync ---
        public async Task<bool> DeleteTaskAsync(Guid taskId, Guid userId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.Project!.UserId == userId);
            if (task == null) return false;
            
            // We must check if any *other* task depends on this one
            var isDependedOn = await _context.TaskDependencies
                .AnyAsync(d => d.DependsOnTaskId == taskId);

            if (isDependedOn)
            {
                // Can't delete: Another task depends on this.
                // You could throw an exception here to let the user know.
                // For now, we'll just fail silently.
                return false; 
            }

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        // --- COMPLETELY REWRITTEN GetTaskScheduleAsync ---
        public async Task<SchedulerOutputDto> GetTaskScheduleAsync(Guid projectId, Guid userId)
        {
            // Verify user owns project and load all tasks/dependencies for it
            var project = await _context.Projects
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.Dependencies)
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
            {
                return new SchedulerOutputDto(); // Return empty
            }

            var tasks = project.Tasks;
            var recommendedOrder = new List<string>();
            var adjacencyList = new Dictionary<Guid, List<Guid>>();
            var inDegrees = new Dictionary<Guid, int>();
            var idToTitle = new Dictionary<Guid, string>();

            // 1. Build graph, in-degrees, and title map from DB models
            foreach (var task in tasks)
            {
                inDegrees[task.Id] = 0;
                adjacencyList[task.Id] = new List<Guid>();
                idToTitle[task.Id] = task.Title;
            }

            foreach (var task in tasks)
            {
                foreach (var dep in task.Dependencies)
                {
                    // Add edge from dependency (DependsOnTaskId) to the task (TaskId)
                    adjacencyList[dep.DependsOnTaskId].Add(dep.TaskId);
                    inDegrees[dep.TaskId]++;
                }
            }

            // 2. Find nodes with in-degree 0
            var queue = new Queue<Guid>();
            foreach (var task in inDegrees)
            {
                if (task.Value == 0)
                {
                    queue.Enqueue(task.Key);
                }
            }

            // 3. Process the queue (Topological Sort)
            while (queue.Count > 0)
            {
                var currentTaskId = queue.Dequeue();
                recommendedOrder.Add(idToTitle[currentTaskId]);

                foreach (var neighborId in adjacencyList[currentTaskId])
                {
                    inDegrees[neighborId]--;
                    if (inDegrees[neighborId] == 0)
                    {
                        queue.Enqueue(neighborId);
                    }
                }
            }
            
            return new SchedulerOutputDto { RecommendedOrder = recommendedOrder };
        }
    }
}