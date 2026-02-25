using Microsoft.AspNetCore.Mvc;
using TalaStock.Backend.Models;
using TalaStock.Backend.Services;

namespace TalaStock.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.LoginAsync(request);
            if (token == null)
            {
                return Unauthorized(new { message = "Invalid username or password" });
            }

            return Ok(new { token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request);
            if (!result)
            {
                return BadRequest(new { message = "Registration failed (User might already exist)" });
            }

            return Ok(new { message = "Registration successful" });
        }
    }
}
