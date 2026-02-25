using System.Data;
using TalaStock.Backend.Models;
using TalaStock.Backend.Data;

namespace TalaStock.Backend.Repositories
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetAllItemsAsync();
        Task<Item?> GetItemByIdAsync(int id);
        Task<int> CreateItemAsync(Item item);
        Task<bool> UpdateItemAsync(Item item);
        Task<bool> DeleteItemAsync(int id);
    }

    public class ItemRepository : BaseRepository, IItemRepository
    {
        public ItemRepository(DbContext context) : base(context) { }

        public async Task<IEnumerable<Item>> GetAllItemsAsync()
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = @"
                    SELECT i.*, c.Name as CategoryName 
                    FROM Items i 
                    LEFT JOIN Categories c ON i.CategoryId = c.CategoryId 
                    ORDER BY i.CreatedAt DESC";
                var items = new List<Item>();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        items.Add(MapItem(reader));
                    }
                }
                return items;
            });
        }

        public async Task<Item?> GetItemByIdAsync(int id)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = @"
                    SELECT i.*, c.Name as CategoryName 
                    FROM Items i 
                    LEFT JOIN Categories c ON i.CategoryId = c.CategoryId 
                    WHERE i.ItemId = @Id";
                AddParameter(command, "@Id", id);
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read()) return MapItem(reader);
                }
                return null;
            });
        }

        public async Task<int> CreateItemAsync(Item item)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = @"
                    INSERT INTO Items (Name, Description, Quantity, Price, CategoryId) 
                    VALUES (@Name, @Description, @Quantity, @Price, @CategoryId); 
                    SELECT LAST_INSERT_ID();";
                
                AddParameter(command, "@Name", item.Name);
                AddParameter(command, "@Description", item.Description);
                AddParameter(command, "@Quantity", item.Quantity);
                AddParameter(command, "@Price", item.Price);
                AddParameter(command, "@CategoryId", item.CategoryId);

                return Convert.ToInt32(command.ExecuteScalar());
            });
        }

        public async Task<bool> UpdateItemAsync(Item item)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = @"
                    UPDATE Items 
                    SET Name = @Name, Description = @Description, Quantity = @Quantity, Price = @Price, CategoryId = @CategoryId, UpdatedAt = CURRENT_TIMESTAMP 
                    WHERE ItemId = @Id";
                
                AddParameter(command, "@Name", item.Name);
                AddParameter(command, "@Description", item.Description);
                AddParameter(command, "@Quantity", item.Quantity);
                AddParameter(command, "@Price", item.Price);
                AddParameter(command, "@CategoryId", item.CategoryId);
                AddParameter(command, "@Id", item.ItemId);

                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<bool> DeleteItemAsync(int id)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "DELETE FROM Items WHERE ItemId = @Id";
                AddParameter(command, "@Id", id);
                return command.ExecuteNonQuery() > 0;
            });
        }

        private Item MapItem(IDataReader reader)
        {
            return new Item
            {
                ItemId = GetValue<int>(reader, "ItemId"),
                Name = GetValue<string>(reader, "Name"),
                Description = GetValue<string>(reader, "Description") ?? "",
                Quantity = GetValue<int>(reader, "Quantity"),
                Price = GetValue<decimal>(reader, "Price"),
                CategoryId = reader.IsDBNull(reader.GetOrdinal("CategoryId")) ? (int?)null : GetValue<int>(reader, "CategoryId"),
                CategoryName = reader.IsDBNull(reader.GetOrdinal("CategoryName")) ? "" : GetValue<string>(reader, "CategoryName"),
                CreatedAt = GetValue<DateTime>(reader, "CreatedAt"),
                UpdatedAt = GetValue<DateTime>(reader, "UpdatedAt")
            };
        }
    }
}
