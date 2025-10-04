import { useEffect, useState } from 'react';
import './App.css';

interface Employee {
    id: number;
    name: string;
    value: number;
}

function App() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Employee>>({ name: '', value: 0 });

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        const response = await fetch('api/employees');
        const data = await response.json();
        setEmployees(data);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const response = await fetch('api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setFormData({ name: '', value: 0 });
            setIsModalOpen(false);
            fetchEmployees();
        }
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

            <button className="fab" onClick={() => setIsModalOpen(true)}>+</button>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add Employee</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="value">Value:</label>
                                <input
                                    type="number"
                                    id="value"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;