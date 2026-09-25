import { getPool } from '../config/db';

export interface UserRow {
  Id: number;
  Username: string;
  PasswordHash: string;
  FullName: string;
  Role: string;
  IsActive: boolean;
  CreatedAt: Date;
}

export const findUserByUsername = async (username: string): Promise<UserRow | null> => {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('username', username)
    .query<UserRow>(
      'SELECT TOP 1 Id, Username, PasswordHash, FullName, Role, IsActive, CreatedAt FROM Users WHERE Username = @username'
    );
  return result.recordset[0] ?? null;
};