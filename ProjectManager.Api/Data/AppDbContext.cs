using Microsoft.EntityFrameworkCore;
using ProjectManager.Api.Models;

namespace ProjectManager.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<TaskItem> Tasks { get; set; }
        
        public DbSet<TaskDependency> TaskDependencies { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<User>()
                .HasMany(u => u.Projects)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.Tasks)
                .WithOne(t => t.Project)
                .HasForeignKey(t => t.ProjectId);

            modelBuilder.Entity<TaskDependency>()
                .HasKey(td => new { td.TaskId, td.DependsOnTaskId });

            modelBuilder.Entity<TaskDependency>()
                .HasOne(td => td.Task)
                .WithMany(t => t.Dependencies)
                .HasForeignKey(td => td.TaskId)
                .OnDelete(DeleteBehavior.Cascade); // If a task is deleted, its dependency links are deleted

            modelBuilder.Entity<TaskDependency>()
                .HasOne(td => td.DependsOnTask)
                .WithMany(t => t.IsDependencyFor)
                .HasForeignKey(td => td.DependsOnTaskId)
                .OnDelete(DeleteBehavior.Restrict); // Doesn't let a task be deleted if another task depends on it
        }
    }
}