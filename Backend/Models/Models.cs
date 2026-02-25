namespace TalaStock.Backend.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class Role
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }

    public class Category
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
    }

    public class Item
    {
        public int ItemId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class Currency
    {
        public int CurrencyId { get; set; }
        public string Symbol { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }

    public class InventoryHistory
    {
        public int HistoryId { get; set; }
        public int ItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int ChangeQuantity { get; set; }
        public int TotalQuantity { get; set; }
        public string ChangeType { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class DashboardStats
    {
        public int TotalTransactions { get; set; }
        public decimal TotalValue { get; set; }
        public List<HistoryPoint> Timeline { get; set; } = new();
        public List<CategoryStat> CategoryBreakdown { get; set; } = new();
    }

    public class CategoryStat
    {
        public string CategoryName { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Value { get; set; }
    }

    public class HistoryPoint
    {
        public string Date { get; set; } = string.Empty;
        public int TotalQuantity { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public int RoleId { get; set; } = 2; // Default to User
    }
}
