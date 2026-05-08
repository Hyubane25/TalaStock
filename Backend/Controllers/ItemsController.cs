using Microsoft.AspNetCore.Mvc;
using TalaStock.Backend.Models;
using TalaStock.Backend.Repositories;

namespace TalaStock.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemsController : ControllerBase
    {
        private readonly IItemRepository _itemRepository;

        public ItemsController(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _itemRepository.GetAllItemsAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _itemRepository.GetItemByIdAsync(id);
            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Item item)
        {
            var id = await _itemRepository.CreateItemAsync(item);
            item.ItemId = id;
            return CreatedAtAction(nameof(GetById), new { id = item.ItemId }, item);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Item item)
        {
            if (id != item.ItemId) return BadRequest();
            var success = await _itemRepository.UpdateItemAsync(item);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _itemRepository.DeleteItemAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
