using ProjectManager.Api.DTOs;
using ProjectManager.Api.Models;

namespace ProjectManager.Api.Services
{
    public interface IAuthService
    {
        Task<User> Register(RegisterDto registerDto);
        Task<AuthResponseDto?> Login(LoginDto loginDto);
    }
}