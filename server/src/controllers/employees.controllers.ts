import { Request, Response } from 'express';
import {
  createEmployee,
  deleteEmployee,
  findEmployees,
  updateEmployee,
  type EmployeeInput,
} from '../models/employee.model';

const isAdmin = (req: Request, res: Response) => {
  if (req.user?.role !== 'Admin') {
    res.status(403).json({ message: 'Administrator access required' });
    return false;
  }
  return true;
};

const readEmployeeInput = (body: unknown): EmployeeInput => {
  const value = body as Partial<EmployeeInput>;
  return {
    employeeCode: String(value.employeeCode ?? '').trim(),
    firstName: String(value.firstName ?? '').trim(),
    lastName: String(value.lastName ?? '').trim(),
    email: String(value.email ?? '').trim(),
    department: String(value.department ?? '').trim(),
    position: String(value.position ?? '').trim(),
    salary: Number(value.salary),
    hireDate: String(value.hireDate ?? '').trim(),
    status: String(value.status ?? 'Active').trim(),
  };
};

const validateEmployee = (employee: EmployeeInput) =>
  employee.employeeCode &&
  employee.firstName &&
  employee.lastName &&
  employee.email &&
  employee.department &&
  employee.position &&
  Number.isFinite(employee.salary) &&
  employee.salary >= 0 &&
  employee.hireDate &&
  ['Active', 'Inactive'].includes(employee.status);

export const listEmployees = async (_req: Request, res: Response) => {
  if (!isAdmin(_req, res)) return;

  try {
    const page = Math.max(Number(_req.query.page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(_req.query.pageSize) || 10, 1), 1000);
    const sortOrder = _req.query.sortOrder === 'descend' ? 'descend' : 'ascend';
    const result = await findEmployees({
      page,
      pageSize,
      search: String(_req.query.search || ''),
      sortField: String(_req.query.sortField || 'id'),
      sortOrder,
    });
    return res.json({ employees: result.rows, total: result.total, page, pageSize });
  } catch (err) {
    console.error('[employees.list]', err);
    return res.status(500).json({ message: 'Failed to fetch employees' });
  }
};

export const addEmployee = async (req: Request, res: Response) => {
  if (!isAdmin(req, res)) return;

  const employee = readEmployeeInput(req.body);
  if (!validateEmployee(employee)) {
    return res.status(400).json({ message: 'All employee fields are required and valid' });
  }

  try {
    const created = await createEmployee(employee);
    return res.status(201).json({ employee: created });
  } catch (err) {
    console.error('[employees.create]', err);
    return res.status(400).json({ message: 'Unable to create employee. Check unique fields.' });
  }
};

export const editEmployee = async (req: Request, res: Response) => {
  if (!isAdmin(req, res)) return;

  const id = Number(req.params.id);
  const employee = readEmployeeInput(req.body);
  if (!Number.isInteger(id) || id <= 0 || !validateEmployee(employee)) {
    return res.status(400).json({ message: 'Invalid employee data' });
  }

  try {
    const updated = await updateEmployee(id, employee);
    if (!updated) return res.status(404).json({ message: 'Employee not found' });
    return res.json({ employee: updated });
  } catch (err) {
    console.error('[employees.update]', err);
    return res.status(400).json({ message: 'Unable to update employee. Check unique fields.' });
  }
};

export const removeEmployee = async (req: Request, res: Response) => {
  if (!isAdmin(req, res)) return;

  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try {
    const deleted = await deleteEmployee(id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });
    return res.status(204).send();
  } catch (err) {
    console.error('[employees.delete]', err);
    return res.status(500).json({ message: 'Unable to delete employee' });
  }
};
