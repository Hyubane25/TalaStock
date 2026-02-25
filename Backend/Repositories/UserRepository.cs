using System.Data;
using TalaStock.Backend.Models;
using TalaStock.Backend.Data;

namespace TalaStock.Backend.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<int> CreateUserAsync(User user);
        Task<IEnumerable<Role>> GetRolesAsync();
    }

    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(DbContext context) : base(context) { }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = @"
                    SELECT u.*, r.RoleName 
                    FROM Users u 
                    JOIN Roles r ON u.RoleId = r.RoleId 
                    WHERE u.Username = @Username";
                
                AddParameter(command, "@Username", username);
                
                using (var reader = command.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new User
                        {
                            UserId = GetValue<int>(reader, "UserId"),
                            Username = GetValue<string>(reader, "Username"),
                            Email = GetValue<string>(reader, "Email"),
                            PasswordHash = GetValue<string>(reader, "PasswordHash"),
                            RoleId = GetValue<int>(reader, "RoleId"),
                            RoleName = GetValue<string>(reader, "RoleName"),
                            CreatedAt = GetValue<DateTime>(reader, "CreatedAt")
                        };
                    }
                }
                return null;
            });
        }

        public async Task<int> CreateUserAsync(User user)
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = @"
                    INSERT INTO Users (Username, Email, PasswordHash, RoleId) 
                    VALUES (@Username, @Email, @PasswordHash, @RoleId); 
                    SELECT LAST_INSERT_ID();";
                
                AddParameter(command, "@Username", user.Username);
                AddParameter(command, "@Email", user.Email);
                AddParameter(command, "@PasswordHash", user.PasswordHash);
                AddParameter(command, "@RoleId", user.RoleId);

                return Convert.ToInt32(command.ExecuteScalar());
            });
        }

        public async Task<IEnumerable<Role>> GetRolesAsync()
        {
            return await ExecuteAsync(async command =>
            {
                command.CommandText = "SELECT * FROM Roles";
                var roles = new List<Role>();
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        roles.Add(new Role
                        {
                            RoleId = GetValue<int>(reader, "RoleId"),
                            RoleName = GetValue<string>(reader, "RoleName")
                        });
                    }
                }
                return roles;
            });
        }
    }
}
