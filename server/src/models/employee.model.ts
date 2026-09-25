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

export const findEmployees = async (): Promise<EmployeeRow[]> => {
  const pool = await getPool();
  const result = await pool.request().query<EmployeeRow>(`
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
    ORDER BY Id;
  `);

  return result.recordset;
};
