using MySql.Data.MySqlClient;
using System.Data;

namespace TalaStock.Backend.Data
{
    public class DbContext
    {
        private readonly string _connectionString;

        public DbContext(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                                ?? throw new ArgumentNullException("Connection string 'DefaultConnection' not found.");
        }

        public IDbConnection CreateConnection()
            => new MySqlConnection(_connectionString);
    }
}
