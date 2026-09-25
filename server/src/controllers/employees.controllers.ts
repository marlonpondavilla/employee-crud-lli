import { Request, Response } from 'express';
import { findEmployees } from '../models/employee.model';

export const listEmployees = async (_req: Request, res: Response) => {
  if (_req.user?.role !== 'Admin') {
    return res.status(403).json({ message: 'Administrator access required' });
  }

  try {
    const employees = await findEmployees();
    return res.json({ employees });
  } catch (err) {
    console.error('[employees.list]', err);
    return res.status(500).json({ message: 'Failed to fetch employees' });
  }
};
