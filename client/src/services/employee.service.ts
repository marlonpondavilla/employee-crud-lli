import api from '../api/axios';
import type { Employee, EmployeeInput } from '../types/employee';

export interface EmployeeListOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
}

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

export const employeesRequest = async (
  options: EmployeeListOptions = {}
): Promise<EmployeeListResponse> => {
  const { data } = await api.get<{ employees: EmployeeApiRow[]; total: number }>('/employees', {
    params: options,
  });

  return { employees: data.employees.map(mapEmployee), total: data.total };
};

const mapEmployee = (employee: EmployeeApiRow): Employee => ({
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
});

export const createEmployeeRequest = async (employee: EmployeeInput): Promise<Employee> => {
  const { data } = await api.post<{ employee: EmployeeApiRow }>('/employees', employee);
  return mapEmployee(data.employee);
};

export const updateEmployeeRequest = async (
  id: number,
  employee: EmployeeInput
): Promise<Employee> => {
  const { data } = await api.put<{ employee: EmployeeApiRow }>(`/employees/${id}`, employee);
  return mapEmployee(data.employee);
};

export const deleteEmployeeRequest = async (id: number): Promise<void> => {
  await api.delete(`/employees/${id}`);
};