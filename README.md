# Employee CRUD System

A Full-Stack Employee Management Application for Presentation to the MIS @ LLI (Built with React, Ant Design, Express, TypeScript, JWT, and Microsoft SQL Server)

## Prerequisites

Install the following on the local machine:

- Node.js 18 or newer
- npm
- Git
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)

## 1. Clone the project

Open PowerShell and run:

```powershell
git clone https://github.com/marlonpondavilla/employee-crud-lli.git
Set-Location employee-crud-lli
```

## 2. Set up the database

1. Open SSMS and connect to your local SQL Server.
2. Open the root-level `schema.sql` file.
3. Run the complete script.

This creates the `EmployeeCrudDB` database, the required tables, sample employees, and the default login users.

Default accounts:

| Username   | Password      | Role          |
| ---------- | ------------- | ------------- |
| `admin`    | `password123` | Administrator |
| `employee` | `password123` | Employee      |

## 3. Install and configure the server

Open a PowerShell terminal in the project root:

```powershell
Set-Location server
npm install
Copy-Item .env.example .env
```

Open `server/.env` and replace the database values with the SQL Server settings from your local machine:

```env
PORT=3333
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=EmployeeCrudDB
DB_USER=your_local_sql_username
DB_PASSWORD=your_local_sql_password
JWT_SECRET=local-development-secret
JWT_EXPIRES_IN=1d
ADMIN_USERNAMES=admin
```

> Use your own local SQL Server username, password, server name, and port if they are different.

Start the server:

```powershell
npm run dev
```

Keep this terminal open. The API runs at:

<http://localhost:3333>

## 4. Install and configure the client

Open a **second PowerShell terminal** in the project root:

```powershell
Set-Location client
npm install
Copy-Item .env.example .env
```

Confirm that `client/.env` contains:

```env
VITE_API_BASE_URL=http://localhost:3333/api
```

Start the client:

```powershell
npm run dev
```

Open the URL shown by Vite, normally:

<http://localhost:5173>

## 5. Test the application

1. Open the client URL in a browser.
2. Log in with `admin` / `password123` to view the administrator dashboard and employee table.
3. Log out.
4. Log in with `employee` / `password123` to view the employee dashboard and profile.

To confirm the server and database are connected, open:

<http://localhost:3333/api/health>

A successful response contains:

```json
{
  "status": "ok",
  "db": "connected"
}
```

## Project commands

### Server

Run inside `server/`:

```powershell
npm install
npm run dev
npm run build
```

### Client

Run inside `client/`:

```powershell
npm install
npm run dev
npm run lint
npm run build
```

Keep the server and client terminals running while using the application.

---

## Challenges Encountered

1. Local SQL Server Setup

My development machine did not have a working local SQL Server instance. I had primarily been using cloud-hosted databases, so I needed to reinstall and configure SQL Server 2025 Express locally.

Issue: Authentication, TCP/IP, instance configuration, and local connectivity all had to be configured manually.

Resolution: Reinstalled SQL Server 2025 Express, enabled TCP/IP on port 1433, and enabled mixed-mode authentication.

2. Port 1433 Conflict

After installing SQLEXPRESS, the service failed to start with:

10048 — Address already in use


Issue: An older MSSQLSERVER instance was already using port 1433.

Resolution: Stopped the unused instance, set its startup type to Manual, and started SQLEXPRESS.

3. Insufficient SQL Permissions

The provided employee_lli login only had db_datareader and db_datawriter permissions.

Issue: I could not create tables, modify the schema, or create a database. Attempts resulted in errors 15151 and 262.

Resolution: Moved the project to a fresh SQLEXPRESS instance and created an employee_lli login with db_owner access to the application database.

4. bcrypt Hash Mismatch

The seeded users contained bcrypt hashes that did not match the documented password password123.

Issue: Login attempts consistently returned:

401 Invalid credentials


Resolution: Generated the correct bcrypt hash, updated the seed data, and fixed schema.sql.

5. Duplicate React Context

During my login page redesign, the frontend reported:

useAuth must be used within AuthProvider


Issue: A duplicate useAuth.ts file was creating a separate createContext() instance.

Resolution: Removed the duplicate context, consolidated useAuth into AuthContext.tsx, and verified all imports referenced the same context.

6. SQL Authentication Configuration Drift

My Node.js application required SQL Authentication, while the local SQL Server configuration initially relied on Windows Authentication.

Issue: Incorrect authentication settings caused the API health check to report the database as disconnected.

Resolution: Enabled mixed-mode authentication and added a /api/health endpoint to make database connectivity issues immediately visible.