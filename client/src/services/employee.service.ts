import api from '../api/axios';
import type { Employee } from '../types/employee';

interface EmployeeApiRow {
  Id: number;
  EmployeeCode: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Department: string;
  Position: string;
  Salary: number;
  HireDate: string;
  Status: string;
}

export const employeesRequest = async (): Promise<Employee[]> => {
  const { data } = await api.get<{ employees: EmployeeApiRow[] }>('/employees');

  return data.employees.map((employee) => ({
    id: employee.Id,
    employeeCode: employee.EmployeeCode,
    firstName: employee.FirstName,
    lastName: employee.LastName,
    email: employee.Email,
    department: employee.Department,
    position: employee.Position,
    salary: employee.Salary,
    hireDate: employee.HireDate,
    status: employee.Status,
  }));
};