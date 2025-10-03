import { useEffect, useState } from 'react';
import './App.css';

interface Employee {
    id: number;
    name: string;
    value: number;
}

function App() {
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        const response = await fetch('api/employees');
        const data = await response.json();
        setEmployees(data);
    }

    return (
        <div className="app-container">
            <h1>Metricell Employees</h1>

            <table className="employees-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;