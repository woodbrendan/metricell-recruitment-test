import { useEffect, useState } from 'react';

interface Employee {
    id: number;
    name: string;
    value: number;
}

const TableHeader = ({ children }: { children: string }) => (
    <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>{children}</th>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
    <td style={{ border: '1px solid #ddd', padding: '12px' }}>{children}</td>
);

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
        <div style={{ padding: '20px' }}>
            <h1>Metricell Employees</h1>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#d3d3d3' }}>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Value</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <TableCell>{employee.id}</TableCell>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.value}</TableCell>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;