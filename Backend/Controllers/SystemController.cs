using Microsoft.AspNetCore.Mvc;
using TalaStock.Backend.Repositories;

namespace TalaStock.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SystemController : ControllerBase
    {
        private readonly IAdminRepository _adminRepository;

        public SystemController(IAdminRepository adminRepository)
        {
            _adminRepository = adminRepository;
        }

        [HttpGet("currency/default")]
        public async Task<IActionResult> GetDefaultCurrency()
        {
            var currency = await _adminRepository.GetDefaultCurrencyAsync();
            if (currency == null) return NotFound();
            return Ok(currency);
        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories() => Ok(await _adminRepository.GetAllCategoriesAsync());
    }
}
