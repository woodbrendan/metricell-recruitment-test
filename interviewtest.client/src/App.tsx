import { useEffect, useState } from 'react';
import './App.css';

interface Employee {
    id: number;
    name: string;
    value: number;
}

interface SumResult {
    name: string;
    totalValue: number;
}

function App() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Employee>>({ name: '', value: 0 });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [sumResults, setSumResults] = useState<SumResult[]>([]);
    const [showSumResults, setShowSumResults] = useState(false);

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

        const url = editingId ? `api/employees/${editingId}` : 'api/employees';
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setFormData({ name: '', value: 0 });
            setIsModalOpen(false);
            setEditingId(null);
            fetchEmployees();
        }
    }

    function handleEdit(employee: Employee) {
        setFormData({ name: employee.name, value: employee.value });
        setEditingId(employee.id);
        setIsModalOpen(true);
    }

    function handleDeleteClick(id: number) {
        setDeletingId(id);
        setIsDeleteModalOpen(true);
    }

    async function confirmDelete() {
        if (deletingId === null) return;

        const response = await fetch(`api/employees/${deletingId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setIsDeleteModalOpen(false);
            setDeletingId(null);
            fetchEmployees();
        }
    }

    function handleCloseModal() {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', value: 0 });
    }

    function handleCloseDeleteModal() {
        setIsDeleteModalOpen(false);
        setDeletingId(null);
    }

    async function handleIncrementValues() {
        const response = await fetch('api/employees/increment-values', {
            method: 'POST',
        });

        if (response.ok) {
            fetchEmployees();
        }
    }

    async function handleShowFilteredSum() {
        const response = await fetch('api/employees/sum-filtered');
        if (response.ok) {
            const data = await response.json();
            setSumResults(data);
            setShowSumResults(true);
        }
    }

    return (
        <div className="app-container">
            <div className="header-section">
                <h1>Metricell Employees</h1>
                <div className="action-buttons">
                    <button className="action-btn" onClick={handleIncrementValues}>
                        Increment Values
                    </button>
                    <button className="action-btn secondary" onClick={handleShowFilteredSum}>
                        Show Filtered Sum
                    </button>
                </div>
            </div>

            <table className="employees-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.value}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(employee)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDeleteClick(employee.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="fab" onClick={() => setIsModalOpen(true)}>+</button>

            {isModalOpen && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{editingId ? 'Edit Employee' : 'Add Employee'}</h2>
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
                                <button type="button" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit">{editingId ? 'Update' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="modal-overlay" onClick={handleCloseDeleteModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Delete Employee</h2>
                        <p>Are you sure you want to delete this employee?</p>
                        <div className="modal-actions">
                            <button type="button" onClick={handleCloseDeleteModal}>Cancel</button>
                            <button type="button" className="delete-btn" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {showSumResults && (
                <div className="modal-overlay" onClick={() => setShowSumResults(false)}>
                    <div className="modal modal-scrollable" onClick={(e) => e.stopPropagation()}>
                        <h2>Filtered Sum Results</h2>
                        <p>Names starting with A, B, or C where sum &gt;= 11171:</p>
                        <div className="modal-content-scrollable">
                            {sumResults.length > 0 ? (
                                <table className="sum-results-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Total Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sumResults.map((result, index) => (
                                            <tr key={index}>
                                                <td>{result.name}</td>
                                                <td>{result.totalValue}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No results found matching the criteria.</p>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button type="button" onClick={() => setShowSumResults(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;