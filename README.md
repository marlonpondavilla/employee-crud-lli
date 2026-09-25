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

### 1. Local SQL Server had to be rebuilt from scratch

The development machine had no working SQL Server instance — I had been working
primarily with cloud-hosted databases and had to re-install and re-configure
SQL Server 2025 Express locally from memory. Setting up a local instance is
different from using a managed cloud database: authentication mode, network
protocols, and instance naming all have to be configured manually.

**Resolution:** I broke the problem into discrete steps, verified each one in
isolation (`sqlcmd` for connectivity, `netstat` for port state, SSMS for
permission checks), and used AI assistance to recall the exact configuration
path in SQL Server Configuration Manager. Setting TCP/IP to a static port
(1433) and enabling mixed-mode authentication were the two changes that
unblocked everything.

### 2. Port 1433 conflict with an existing default instance

After installing a fresh `SQLEXPRESS` instance, the service failed to start
with error `10048 — Address already in use`. Investigation with
`netstat -ano | findstr :1433` and `Get-Process -Id <PID>` revealed that an
older default instance (`MSSQLSERVER`) was still running and holding port
1433.

**Resolution:** Stopped the unused default instance, set its startup type to
`Manual`, and started `SQLEXPRESS` — which then bound successfully to 1433.

### 3. The provided SQL login had no DDL permissions

The initial login (`employee_lli`) only had `db_datareader` and
`db_datawriter` on the existing database — no rights to create tables,
alter schema, or create a new database. Attempts to `ALTER ROLE` failed
with error `15151`, and `CREATE DATABASE` failed with `262` because the
login lacked the server-level `dbcreator` role.

**Resolution:** Rather than fight the permissions (which required `sa`
access we did not have on the legacy instance), we switched to a fresh
`SQLEXPRESS` instance where we controlled the environment end-to-end, and
created a clean `employee_lli` login scoped as `db_owner` on the new
database — following the principle of least privilege rather than
granting `sysadmin`.

### 4. bcrypt hash mismatch on seeded users

Seeded users in the schema initially stored a bcrypt hash that did not
correspond to the documented plaintext password (`password123`), causing
every login attempt to fail with `401 Invalid credentials` even though the
login flow and DB connection were correct.

**Resolution:** Generated the correct hash locally with
`node -e "console.log(require('bcryptjs').hashSync('password123', 10))"`,
updated the seed rows, and corrected `schema.sql` so a fresh setup would
work for anyone cloning the repository.

### 5. Duplicate React context from an accidental file

During the login page redesign, the frontend began throwing
`useAuth must be used within AuthProvider` — despite the provider being
correctly placed at the top of the component tree. The stack trace pointed
to a file (`useAuth.ts`) that was creating its own `createContext()` call,
producing a second, disconnected context object.

**Resolution:** Removed the duplicate context files, consolidated the
`useAuth` hook export inside `AuthContext.tsx`, and audited all imports
with `findstr /s /i "useAuth" src\*.ts src\*.tsx` to ensure every
consumer referenced the same context instance.

### 6. Development environment drift between Windows Authentication and SQL Authentication

Configuring Node to connect to a Windows-Auth-only instance required
enabling mixed-mode authentication and restarting the service, which was
easy to forget between iterations. The symptom was a silent
`db: "disconnected"` on the health endpoint with no clear error in the
browser.

**Resolution:** Added a `/api/health` endpoint that reports DB connectivity
explicitly, so the failure mode is visible immediately. Documented the
required SQL Server configuration in the README prerequisites so the
environment can be reproduced cleanly.
