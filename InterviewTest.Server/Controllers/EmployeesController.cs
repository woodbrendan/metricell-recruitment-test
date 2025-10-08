using InterviewTest.Server.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace InterviewTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        [HttpGet]
        public ActionResult<List<Employee>> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Id, Name, Value FROM Employees";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        employees.Add(new Employee
                        {
                            Id = reader.GetInt32(0),
                            Name = reader.GetString(1),
                            Value = reader.GetInt32(2)
                        });
                    }
                }
            }

            return employees;
        }

        [HttpPost]
        public IActionResult Post([FromBody] Employee employee)
        {
            if (string.IsNullOrWhiteSpace(employee.Name))
            {
                return BadRequest("Name is required");
            }

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var insertCmd = connection.CreateCommand();
                insertCmd.CommandText = @"INSERT INTO Employees (Name, Value) VALUES (@name, @value)";
                insertCmd.Parameters.AddWithValue("@name", employee.Name);
                insertCmd.Parameters.AddWithValue("@value", employee.Value);
                insertCmd.ExecuteNonQuery();

                var lastIdCmd = connection.CreateCommand();
                lastIdCmd.CommandText = "SELECT last_insert_rowid()";
                employee.Id = Convert.ToInt32(lastIdCmd.ExecuteScalar());
            }

            return CreatedAtAction(nameof(Get), new { id = employee.Id }, employee);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Employee employee)
        {
            if (string.IsNullOrWhiteSpace(employee.Name))
            {
                return BadRequest("Name is required");
            }

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var updateCmd = connection.CreateCommand();
                updateCmd.CommandText = @"UPDATE Employees SET Name = @name, Value = @value WHERE Id = @id";
                updateCmd.Parameters.AddWithValue("@id", id);
                updateCmd.Parameters.AddWithValue("@name", employee.Name);
                updateCmd.Parameters.AddWithValue("@value", employee.Value);
                var rowsAffected = updateCmd.ExecuteNonQuery();

                if (rowsAffected == 0)
                {
                    return NotFound();
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var deleteCmd = connection.CreateCommand();
                deleteCmd.CommandText = @"DELETE FROM Employees WHERE Id = @id";
                deleteCmd.Parameters.AddWithValue("@id", id);
                var rowsAffected = deleteCmd.ExecuteNonQuery();

                if (rowsAffected == 0)
                {
                    return NotFound();
                }
            }

            return NoContent();
        }

        [HttpPost("increment-values")]
        public IActionResult IncrementValues()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var updateCmd = connection.CreateCommand();
                updateCmd.CommandText = @"
                    UPDATE Employees
                    SET Value = CASE
                        WHEN Name LIKE 'E%' THEN Value + 1
                        WHEN Name LIKE 'G%' THEN Value + 10
                        ELSE Value + 100
                    END";
                updateCmd.ExecuteNonQuery();
            }

            return Ok();
        }

        [HttpGet("sum-filtered")]
        public ActionResult<object> GetFilteredSum()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"
                    SELECT Name, SUM(Value) as TotalValue
                    FROM Employees
                    WHERE Name LIKE 'A%' OR Name LIKE 'B%' OR Name LIKE 'C%'
                    GROUP BY Name
                    HAVING SUM(Value) >= 11171";

                var results = new List<object>();
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        results.Add(new
                        {
                            Name = reader.GetString(0),
                            TotalValue = reader.GetInt32(1)
                        });
                    }
                }

                return Ok(results);
            }
        }
    }
}
