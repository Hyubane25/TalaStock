using System.Data;
using TalaStock.Backend.Data;

namespace TalaStock.Backend.Repositories
{
    public abstract class BaseRepository
    {
        protected readonly DbContext Context;

        protected BaseRepository(DbContext context)
        {
            Context = context;
        }

        protected async Task<T> ExecuteAsync<T>(Func<IDbCommand, Task<T>> task)
        {
            using (var connection = Context.CreateConnection())
            {
                var command = connection.CreateCommand();
                connection.Open();
                return await task(command);
            }
        }

        protected void AddParameter(IDbCommand command, string name, object? value)
        {
            var parameter = command.CreateParameter();
            parameter.ParameterName = name;
            parameter.Value = value ?? DBNull.Value;
            command.Parameters.Add(parameter);
        }

        protected T GetValue<T>(IDataReader reader, string columnName)
        {
            var ordinal = reader.GetOrdinal(columnName);
            if (reader.IsDBNull(ordinal))
            {
                return default!;
            }
            return (T)reader.GetValue(ordinal);
        }
    }
}
