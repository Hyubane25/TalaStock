using System.Data;
using TalaStock.Backend.Models;
using TalaStock.Backend.Data;

namespace TalaStock.Backend.Repositories
{
    public interface IAdminRepository
    {
        // User Management
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<bool> CreateUserAsync(User user, string password);
        Task<bool> UpdateUserRoleAsync(int userId, int roleId);
        Task<bool> DeleteUserAsync(int userId);
        
        // Role Management
        Task<IEnumerable<Role>> GetAllRolesAsync();
        
        // Category Management
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<bool> AddCategoryAsync(string name);
        Task<bool> UpdateCategoryAsync(int id, string name);
        Task<bool> DeleteCategoryAsync(int categoryId);
        
        // Currency Management
        Task<IEnumerable<Currency>> GetAllCurrenciesAsync();
        Task<Currency?> GetDefaultCurrencyAsync();
        Task<bool> AddCurrencyAsync(Currency currency);
        Task<bool> UpdateCurrencyAsync(Currency currency);
        Task<bool> DeleteCurrencyAsync(int id);
        Task<bool> SetDefaultCurrencyAsync(int currencyId);
        
        // Statistics
        Task<DashboardStats> GetAnalyticsAsync(string period);
    }

    public class AdminRepository : BaseRepository, IAdminRepository
    {
        public AdminRepository(DbContext context) : base(context) { }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "SELECT u.*, r.RoleName FROM Users u JOIN Roles r ON u.RoleId = r.RoleId";
                var users = new List<User>();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        users.Add(new User
                        {
                            UserId = GetValue<int>(reader, "UserId"),
                            Username = GetValue<string>(reader, "Username"),
                            Email = GetValue<string>(reader, "Email"),
                            RoleId = GetValue<int>(reader, "RoleId"),
                            RoleName = GetValue<string>(reader, "RoleName"),
                            CreatedAt = GetValue<DateTime>(reader, "CreatedAt")
                        });
                    }
                }
                return users;
            });
        }

        public async Task<bool> CreateUserAsync(User user, string password)
        {
            return await ExecuteAsync(async command =>
            {
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
                command.CommandText = "INSERT INTO Users (Username, PasswordHash, Email, RoleId) VALUES (@User, @Pass, @Email, @Role)";
                AddParameter(command, "@User", user.Username);
                AddParameter(command, "@Pass", passwordHash);
                AddParameter(command, "@Email", user.Email);
                AddParameter(command, "@Role", user.RoleId);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<bool> UpdateUserRoleAsync(int userId, int roleId)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "UPDATE Users SET RoleId = @RoleId WHERE UserId = @UserId";
                AddParameter(command, "@RoleId", roleId);
                AddParameter(command, "@UserId", userId);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "DELETE FROM Users WHERE UserId = @UserId";
                AddParameter(command, "@UserId", userId);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<IEnumerable<Role>> GetAllRolesAsync()
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "SELECT * FROM Roles";
                var roles = new List<Role>();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        roles.Add(new Role { 
                            RoleId = GetValue<int>(reader, "RoleId"), 
                            RoleName = GetValue<string>(reader, "RoleName") 
                        });
                    }
                }
                return roles;
            });
        }

        public async Task<IEnumerable<Currency>> GetAllCurrenciesAsync()
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "SELECT * FROM Currencies";
                var currencies = new List<Currency>();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        currencies.Add(new Currency {
                            CurrencyId = GetValue<int>(reader, "CurrencyId"),
                            Symbol = GetValue<string>(reader, "Symbol"),
                            Code = GetValue<string>(reader, "Code"),
                            Name = GetValue<string>(reader, "Name"),
                            IsDefault = GetValue<bool>(reader, "IsDefault")
                        });
                    }
                }
                return currencies;
            });
        }

        public async Task<Currency?> GetDefaultCurrencyAsync()
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "SELECT * FROM Currencies WHERE IsDefault = TRUE LIMIT 1";
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new Currency {
                            CurrencyId = GetValue<int>(reader, "CurrencyId"),
                            Symbol = GetValue<string>(reader, "Symbol"),
                            Code = GetValue<string>(reader, "Code"),
                            Name = GetValue<string>(reader, "Name"),
                            IsDefault = GetValue<bool>(reader, "IsDefault")
                        };
                    }
                }
                return null;
            });
        }

        public async Task<bool> AddCurrencyAsync(Currency currency)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "INSERT INTO Currencies (Symbol, Code, Name, IsDefault) VALUES (@Symbol, @Code, @Name, @IsDefault)";
                AddParameter(command, "@Symbol", currency.Symbol);
                AddParameter(command, "@Code", currency.Code);
                AddParameter(command, "@Name", currency.Name);
                AddParameter(command, "@IsDefault", currency.IsDefault);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<bool> UpdateCurrencyAsync(Currency currency)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "UPDATE Currencies SET Symbol = @Symbol, Code = @Code, Name = @Name WHERE CurrencyId = @Id";
                AddParameter(command, "@Id", currency.CurrencyId);
                AddParameter(command, "@Symbol", currency.Symbol);
                AddParameter(command, "@Code", currency.Code);
                AddParameter(command, "@Name", currency.Name);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<bool> DeleteCurrencyAsync(int id)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "DELETE FROM Currencies WHERE CurrencyId = @Id AND IsDefault = FALSE";
                AddParameter(command, "@Id", id);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<bool> SetDefaultCurrencyAsync(int currencyId)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "UPDATE Currencies SET IsDefault = FALSE";
                command.ExecuteNonQuery();

                command.CommandText = "UPDATE Currencies SET IsDefault = TRUE WHERE CurrencyId = @Id";
                command.Parameters.Clear();
                AddParameter(command, "@Id", currencyId);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "SELECT * FROM Categories";
                var categories = new List<Category>();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        categories.Add(new Category {
                            CategoryId = GetValue<int>(reader, "CategoryId"),
                            Name = GetValue<string>(reader, "Name")
                        });
                    }
                }
                return categories;
            });
        }

        public async Task<bool> AddCategoryAsync(string name)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "INSERT INTO Categories (Name) VALUES (@Name)";
                AddParameter(command, "@Name", name);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<bool> UpdateCategoryAsync(int id, string name)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "UPDATE Categories SET Name = @Name WHERE CategoryId = @Id";
                AddParameter(command, "@Id", id);
                AddParameter(command, "@Name", name);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<bool> DeleteCategoryAsync(int categoryId)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "DELETE FROM Categories WHERE CategoryId = @Id";
                AddParameter(command, "@Id", categoryId);
                return command.ExecuteNonQuery() > 0;
            });
        }

        public async Task<DashboardStats> GetAnalyticsAsync(string period)
        {
            return await ExecuteAsync(async command =>
            {
                var stats = new DashboardStats();
                int days = period switch { "7d" => 7, "30d" => 30, "90d" => 90, _ => 30 };
                
                // Total Transactions
                command.CommandText = "SELECT COUNT(*) FROM InventoryHistory WHERE CreatedAt >= DATE_SUB(NOW(), INTERVAL @Days DAY)";
                AddParameter(command, "@Days", days);
                stats.TotalTransactions = Convert.ToInt32(command.ExecuteScalar());

                // Total Value & Category Breakdown
                command.Parameters.Clear();
                command.CommandText = @"
                    SELECT c.Name as CategoryName, COUNT(i.ItemId) as Count, SUM(i.Quantity * i.Price) as Value
                    FROM Categories c
                    LEFT JOIN Items i ON c.CategoryId = i.CategoryId
                    GROUP BY c.Name";
                
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var categoryVal = reader.IsDBNull(2) ? 0m : Convert.ToDecimal(reader.GetValue(2));
                        stats.TotalValue += categoryVal;
                        stats.CategoryBreakdown.Add(new CategoryStat {
                            CategoryName = reader.IsDBNull(0) ? "Uncategorized" : reader.GetString(0),
                            Count = Convert.ToInt32(reader.GetValue(1)),
                            Value = categoryVal
                        });
                    }
                }

                // Timeline Stats
                command.Parameters.Clear();
                command.CommandText = @"
                    SELECT DATE(CreatedAt) as Date, SUM(TotalQuantity) as Quantity 
                    FROM InventoryHistory 
                    WHERE CreatedAt >= DATE_SUB(NOW(), INTERVAL @Days DAY)
                    GROUP BY DATE(CreatedAt) 
                    ORDER BY Date ASC";
                AddParameter(command, "@Days", days);
                
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        stats.Timeline.Add(new HistoryPoint {
                            Date = reader.GetDateTime(0).ToString("MMM dd"),
                            TotalQuantity = reader.GetInt32(1)
                        });
                    }
                }

                return stats;
            });
        }
    }
}
