import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE || 'EmployeeCrudDB',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
  encrypt: false,
  trustServerCertificate: true,
  enableArithAbort: true,
},
  pool: { max: 10, min: 0, idleTimeoutMillis: 30000 },
};

let pool: sql.ConnectionPool | null = null;

export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
    console.log('[db] Connected to SQL Server:', config.database);
  }
  return pool;
};

export const testConnection = async (): Promise<boolean> => {
  try {
    const p = await getPool();
    await p.request().query('SELECT 1 AS ok');
    return true;
  } catch (err) {
    console.error('[db] Connection failed:', err);
    return false;
  }
};