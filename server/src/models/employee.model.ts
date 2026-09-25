import sql from 'mssql';
import { getPool } from '../config/db';

export interface EmployeeRow {
  Id: number;
  EmployeeCode: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Department: string;
  Position: string;
  Salary: number;
  HireDate: Date;
  Status: string;
}

export interface EmployeeInput {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: string;
}

export interface EmployeeListOptions {
  page: number;
  pageSize: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
}

export interface EmployeeListResult {
  rows: EmployeeRow[];
  total: number;
}

const sortableColumns: Record<string, string> = {
  id: 'Id',
  employeeCode: 'EmployeeCode',
  firstName: 'FirstName',
  lastName: 'LastName',
  email: 'Email',
  department: 'Department',
  position: 'Position',
  salary: 'Salary',
  hireDate: 'HireDate',
  status: 'Status',
};

export const findEmployees = async (
  options: EmployeeListOptions
): Promise<EmployeeListResult> => {
  const pool = await getPool();
  const offset = (options.page - 1) * options.pageSize;
  const sortColumn = sortableColumns[options.sortField || ''] || 'Id';
  const sortDirection = options.sortOrder === 'descend' ? 'DESC' : 'ASC';
  const request = pool
    .request()
    .input('offset', sql.Int, offset)
    .input('pageSize', sql.Int, options.pageSize);

  const search = options.search?.trim();
  if (search) request.input('search', sql.VarChar(100), `%${search}%`);

  const whereClause = search
    ? `WHERE EmployeeCode LIKE @search
       OR FirstName LIKE @search
       OR LastName LIKE @search
       OR Email LIKE @search
       OR Department LIKE @search
       OR Position LIKE @search
       OR Status LIKE @search`
    : '';

  const result = await request.query<EmployeeRow>(`
    SELECT
      Id,
      EmployeeCode,
      FirstName,
      LastName,
      Email,
      Department,
      Position,
      Salary,
      HireDate,
      Status
    FROM Employees
    ${whereClause}
    ORDER BY ${sortColumn} ${sortDirection}
    OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY;
  `);

  const countResult = await pool
    .request()
    .input('countSearch', sql.VarChar(100), search ? `%${search}%` : null)
    .query<{ total: number }>(`
      SELECT COUNT(*) AS total
      FROM Employees
      ${search ? whereClause.replaceAll('@search', '@countSearch') : ''};
    `);

  return { rows: result.recordset, total: countResult.recordset[0]?.total ?? 0 };
};

const addEmployeeInputs = (request: sql.Request, employee: EmployeeInput) =>
  request
    .input('employeeCode', sql.VarChar(20), employee.employeeCode)
    .input('firstName', sql.VarChar(50), employee.firstName)
    .input('lastName', sql.VarChar(50), employee.lastName)
    .input('email', sql.VarChar(100), employee.email)
    .input('department', sql.VarChar(50), employee.department)
    .input('position', sql.VarChar(50), employee.position)
    .input('salary', sql.Decimal(18, 2), employee.salary)
    .input('hireDate', sql.Date, employee.hireDate)
    .input('status', sql.VarChar(20), employee.status);

export const createEmployee = async (employee: EmployeeInput): Promise<EmployeeRow> => {
  const pool = await getPool();
  const result = await addEmployeeInputs(pool.request(), employee).query<EmployeeRow>(`
    INSERT INTO Employees
      (EmployeeCode, FirstName, LastName, Email, Department, Position, Salary, HireDate, Status)
    OUTPUT INSERTED.Id, INSERTED.EmployeeCode, INSERTED.FirstName, INSERTED.LastName,
      INSERTED.Email, INSERTED.Department, INSERTED.Position, INSERTED.Salary,
      INSERTED.HireDate, INSERTED.Status
    VALUES
      (@employeeCode, @firstName, @lastName, @email, @department, @position,
       @salary, @hireDate, @status);
  `);

  return result.recordset[0];
};

export const updateEmployee = async (
  id: number,
  employee: EmployeeInput
): Promise<EmployeeRow | null> => {
  const pool = await getPool();
  const request = addEmployeeInputs(pool.request(), employee).input('id', sql.Int, id);
  const result = await request.query<EmployeeRow>(`
    UPDATE Employees
    SET EmployeeCode = @employeeCode,
        FirstName = @firstName,
        LastName = @lastName,
        Email = @email,
        Department = @department,
        Position = @position,
        Salary = @salary,
        HireDate = @hireDate,
        Status = @status,
        UpdatedAt = SYSUTCDATETIME()
    OUTPUT INSERTED.Id, INSERTED.EmployeeCode, INSERTED.FirstName, INSERTED.LastName,
      INSERTED.Email, INSERTED.Department, INSERTED.Position, INSERTED.Salary,
      INSERTED.HireDate, INSERTED.Status
    WHERE Id = @id;
  `);

  return result.recordset[0] ?? null;
};

export const deleteEmployee = async (id: number): Promise<boolean> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query('DELETE FROM Employees WHERE Id = @id;');

  return result.rowsAffected[0] > 0;
};
