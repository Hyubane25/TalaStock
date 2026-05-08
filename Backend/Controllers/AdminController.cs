using Microsoft.AspNetCore.Mvc;
using TalaStock.Backend.Models;
using TalaStock.Backend.Repositories;

namespace TalaStock.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _adminRepository;

        public AdminController(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers() => Ok(await _adminRepository.GetAllUsersAsync());

        [HttpPost("users")]
        public async Task<IActionResult> CreateUser([FromBody] UserCreateRequest request)
        {
            // Validate for duplicate username
            if (await _adminRepository.IsUsernameExistsAsync(request.Username))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Validate for duplicate email
            if (await _adminRepository.IsEmailExistsAsync(request.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var user = new User { Username = request.Username, Email = request.Email, RoleId = request.RoleId };
            var success = await _adminRepository.CreateUserAsync(user, request.Password);
            return success ? Ok() : BadRequest();
        }

        public class UserCreateRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public int RoleId { get; set; }
        }

        [HttpPut("users/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] UserUpdateRequest request)
        {
            // Validate for duplicate username (excluding current user)
            if (await _adminRepository.IsUsernameExistsAsync(request.Username, userId))
            {
                return BadRequest(new { message = "Username already exists" });
            }

            // Validate for duplicate email (excluding current user)
            if (await _adminRepository.IsEmailExistsAsync(request.Email, userId))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var success = await _adminRepository.UpdateUserAsync(userId, request.Username, request.Email);
            return success ? NoContent() : NotFound();
        }

        public class UserUpdateRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
        }

        [HttpPut("users/{userId}/role")]
        public async Task<IActionResult> UpdateRole(int userId, [FromBody] RoleUpdateRequest request)
        {
            var success = await _adminRepository.UpdateUserRoleAsync(userId, request.RoleId);
            return success ? NoContent() : NotFound();
        }

        public class RoleUpdateRequest
        {
            public int RoleId { get; set; }
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            // Check if user can be safely deleted
            if (!await _adminRepository.CanDeleteUserAsync(userId))
            {
                return BadRequest(new { message = "Cannot delete this user. This might be the last admin user." });
            }

            var success = await _adminRepository.DeleteUserAsync(userId);
            return success ? NoContent() : NotFound();
        }

        [HttpGet("roles")]
        public async Task<IActionResult> GetRoles() => Ok(await _adminRepository.GetAllRolesAsync());

        [HttpGet("currencies")]
        public async Task<IActionResult> GetCurrencies() => Ok(await _adminRepository.GetAllCurrenciesAsync());

        [HttpPost("currencies")]
        public async Task<IActionResult> AddCurrency([FromBody] Currency currency)
        {
            var success = await _adminRepository.AddCurrencyAsync(currency);
            return success ? Ok() : BadRequest();
        }

        [HttpPut("currencies/{id}")]
        public async Task<IActionResult> UpdateCurrency(int id, [FromBody] Currency currency)
        {
            currency.CurrencyId = id;
            var success = await _adminRepository.UpdateCurrencyAsync(currency);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("currencies/{id}")]
        public async Task<IActionResult> DeleteCurrency(int id)
        {
            var success = await _adminRepository.DeleteCurrencyAsync(id);
            return success ? NoContent() : NotFound();
        }

        [HttpPost("currencies/{id}/default")]
        public async Task<IActionResult> SetDefaultCurrency(int id)
        {
            var success = await _adminRepository.SetDefaultCurrencyAsync(id);
            return success ? Ok() : BadRequest();
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics([FromQuery] string period = "30d")
        {
            return Ok(await _adminRepository.GetAnalyticsAsync(period));
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories() => Ok(await _adminRepository.GetAllCategoriesAsync());

        [HttpPost("categories")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            var success = await _adminRepository.AddCategoryAsync(category.Name);
            return success ? Ok() : BadRequest();
        }

        [HttpPut("categories/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            var success = await _adminRepository.UpdateCategoryAsync(id, category.Name);
            return success ? NoContent() : NotFound();
        }

        [HttpDelete("categories/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var success = await _adminRepository.DeleteCategoryAsync(id);
            return success ? NoContent() : NotFound();
        }
    }
}
