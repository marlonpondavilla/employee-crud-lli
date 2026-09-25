# Employee CRUD System

A full-stack employee management application consisting of:

- **Client:** React 19, TypeScript, Vite, Ant Design, Axios, and React Router
- **Server:** Node.js, Express, TypeScript, JWT authentication, bcrypt password verification, and `mssql`
- **Database:** Microsoft SQL Server

The application provides a login flow and a protected dashboard. The database script creates the application database, authentication users, and sample employee records.

> **Important:** The client and server are separate applications. Run `npm install` and `npm run dev` in both the `client` and `server` directories.

---

## 1. Prerequisites

Install the following before starting:

| Requirement                  | Recommended version / notes                                       |
| ---------------------------- | ----------------------------------------------------------------- |
| Windows                      | Local Windows 10/11 machine or equivalent development environment |
| Node.js                      | 18 or newer; Node.js 22 is also supported                         |
| npm                          | Installed automatically with Node.js                              |
| Microsoft SQL Server         | SQL Server Express 2025 or another recent SQL Server instance     |
| SQL Server Management Studio | SSMS, Azure Data Studio, or `sqlcmd`                              |

### SQL Server authentication requirements

The application connects using SQL Server credentials from `server/.env`. Enable **SQL Server and Windows Authentication mode** if you intend to use a SQL login:

1. Open SQL Server Management Studio.
2. Right-click the connected server and select **Properties**.
3. Open **Security**.
4. Select **SQL Server and Windows Authentication mode**.
5. Select **OK** and restart the SQL Server service if prompted.

If you use Windows authentication or a different SQL login, update the database connection settings accordingly. The application currently reads `DB_USER` and `DB_PASSWORD`; it does not use Windows integrated authentication automatically.

---

## 2. Get the project

Clone the repository and enter its root directory:

```powershell
git clone https://github.com/marlonpondavilla/employee-crud-lli.git
Set-Location employee-crud-lli
```

The important folders and files are:

```text
employee-crud-lli/
├── client/                 React + Vite frontend
├── server/                 Express + TypeScript backend
├── schema.sql              Database creation and seed script
└── README.md               This guide
```

---

## 3. Create and seed the database

### 3.1 Run `schema.sql`

1. Open SSMS and connect to your SQL Server instance.
2. Open the root-level `schema.sql` file.
3. Execute the complete script as a user allowed to create databases and tables.

The script is safe to run more than once for the objects and seed records it manages. It creates:

- Database: `EmployeeCrudDB`
- Table: `Users`
- Table: `Employees`
- Users: `admin` and `employee`
- Sample employees: `EMP001`, `EMP002`, and `EMP003`

### 3.2 Optional: create the application SQL login

Run the following in SSMS as a SQL Server administrator if you want to use the default credentials from `server/.env.example`:

```sql
CREATE LOGIN employee_lli
WITH PASSWORD = 'employeelli', CHECK_POLICY = OFF;
GO

USE EmployeeCrudDB;
GO

CREATE USER employee_lli FOR LOGIN employee_lli;
GO

ALTER ROLE db_owner ADD MEMBER employee_lli;
GO
```

For a safer or shared examiner environment, use an existing SQL login with only the permissions required by the application and place those credentials in `server/.env` instead.

### 3.3 Verify the seed data

In SSMS, select the `EmployeeCrudDB` database and run:

```sql
SELECT Id, Username, FullName, Role, IsActive
FROM Users;
GO

SELECT EmployeeCode, FirstName, LastName, Email, Department, Position, Status
FROM Employees
ORDER BY Id;
GO
```

The default users are:

| Username   | Password      | Role    |
| ---------- | ------------- | ------- |
| `admin`    | `password123` | `Admin` |
| `employee` | `password123` | `User`  |

Passwords are stored as bcrypt hashes. Do not store plain-text passwords in the database.

---

## 4. Configure the backend

Open a new PowerShell terminal from the project root:

```powershell
Set-Location server
npm install
Copy-Item .env.example .env
```

Open `server/.env` and set values appropriate for the local SQL Server installation:

```env
PORT=3333
DB_SERVER=localhost
DB_DATABASE=EmployeeCrudDB
DB_USER=employee_lli
DB_PASSWORD=employeelli
JWT_SECRET=change_this_to_a_long_random_value
JWT_EXPIRES_IN=1d
ADMIN_USERNAMES=admin
```

### Backend environment variables

| Variable          | Required           | Description                                                               |
| ----------------- | ------------------ | ------------------------------------------------------------------------- |
| `PORT`            | No                 | API port. Defaults to `3333`.                                             |
| `DB_SERVER`       | No                 | SQL Server host name. Defaults to `localhost`.                            |
| `DB_DATABASE`     | No                 | Database name. Defaults to `EmployeeCrudDB`.                              |
| `DB_USER`         | Yes                | SQL Server login used by the API.                                         |
| `DB_PASSWORD`     | Yes                | Password for `DB_USER`.                                                   |
| `JWT_SECRET`      | Yes for production | Secret used to sign access tokens. Use a long random value.               |
| `JWT_EXPIRES_IN`  | No                 | JWT lifetime, such as `1d` or `2h`. Defaults to `1d`.                     |
| `ADMIN_USERNAMES` | No                 | Comma-separated usernames treated as administrators. Defaults to `admin`. |

> Do not commit `server/.env`. It is ignored by Git. Commit only `.env.example` files.

### Start the backend

Keep this terminal open:

```powershell
npm run dev
```

A successful startup displays a message similar to:

```text
Server running on http://localhost:3333
```

The database connection is opened when the health endpoint or an authenticated database operation is requested.

---

## 5. Configure and start the frontend

Open a **second** PowerShell terminal from the project root:

```powershell
Set-Location client
npm install
Copy-Item .env.example .env
```

Confirm that `client/.env` contains:

```env
VITE_API_BASE_URL=http://localhost:3333/api
```

Start the frontend:

```powershell
npm run dev
```

Vite normally serves the application at:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite automatically selects another port, such as `5174`. Use the exact URL printed in the terminal.

---

## 6. Verify the installation

### 6.1 Check the API health endpoint

With the backend running, open this URL in a browser:

<http://localhost:3333/api/health>

Or run this PowerShell command:

```powershell
Invoke-RestMethod http://localhost:3333/api/health
```

Expected response:

```json
{
  "status": "ok",
  "db": "connected",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

The timestamp will be different. The important values are `status: "ok"` and `db: "connected"`.

### 6.2 Open the client

Open the Vite URL in a browser. The protected route should redirect unauthenticated visitors to `/login`.

### 6.3 Test both accounts

1. Sign in as `admin` / `password123`.
2. Confirm that the dashboard displays the administrator user.
3. Use the avatar menu to log out.
4. Sign in as `employee` / `password123`.
5. Refresh the browser and confirm the session remains active.
6. Clear the browser's local storage and confirm the application redirects to `/login` again.

---

## 7. API smoke tests

### Login

PowerShell:

```powershell
$body = @{ username = 'admin'; password = 'password123' } | ConvertTo-Json
$login = Invoke-RestMethod `
  -Uri http://localhost:3333/api/auth/login `
  -Method Post `
  -ContentType 'application/json' `
  -Body $body

$login
$token = $login.token
```

The response contains a JWT and user information similar to:

```json
{
  "token": "<jwt-token>",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "role": "Admin"
  }
}
```

### Get the current authenticated user

```powershell
Invoke-RestMethod `
  -Uri http://localhost:3333/api/auth/me `
  -Headers @{ Authorization = "Bearer $token" }
```

Expected response:

```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "role": "Admin"
  }
}
```

### Expected authentication failures

| Request                         | Expected result |
| ------------------------------- | --------------- |
| Missing username or password    | HTTP `400`      |
| Incorrect credentials           | HTTP `401`      |
| Missing or invalid bearer token | HTTP `401`      |
| Unknown route                   | HTTP `404`      |

---

## 8. Development commands

Run commands from the relevant folder.

### Server

```powershell
npm run dev       # Start the TypeScript server with nodemon
npm run build     # Compile the server to dist/
npm start         # Start the compiled server
```

### Client

```powershell
npm run dev       # Start Vite development server
npm run build     # Type-check and create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build locally
```

Before submitting or demonstrating the project, run:

```powershell
Set-Location server
npm run build

Set-Location ..\client
npm run lint
npm run build
```

---

## 9. Troubleshooting

### `EADDRINUSE` or Vite uses port `5174`

Another process is already using port `5173`. Either use the alternate URL printed by Vite or stop the process using the port. The frontend API URL remains `http://localhost:3333/api`.

### `ECONNREFUSED` or database status is `disconnected`

Check the following:

1. The SQL Server service is running.
2. `EmployeeCrudDB` exists.
3. `DB_SERVER`, `DB_DATABASE`, `DB_USER`, and `DB_PASSWORD` in `server/.env` are correct.
4. TCP/IP is enabled in SQL Server Configuration Manager when connecting over TCP.
5. The SQL login has permission to access `EmployeeCrudDB`.
6. The SQL Server firewall allows the configured SQL Server port.

### Login returns HTTP `401`

Confirm that:

1. The `Users` seed rows exist.
2. The username is exactly `admin` or `employee`.
3. The password is exactly `password123` unless the seed password was changed.
4. The client is calling the correct API URL from `client/.env`.

### Login returns HTTP `500`

Check the server terminal for the database error. This normally indicates a SQL connection problem, a missing table, or a schema that was not created by running the complete root-level `schema.sql` script.

### The browser shows a CORS or network error

Confirm that:

- The backend is running on port `3333`.
- `client/.env` contains `VITE_API_BASE_URL=http://localhost:3333/api`.
- The client was restarted after changing `.env`.

Vite reads environment variables when it starts, so changing `client/.env` requires stopping and restarting `npm run dev`.

### Environment changes do not take effect

Stop and restart the affected development server. Never expose server secrets through variables beginning with `VITE_`; Vite exposes those values to the browser.

---

## 10. Security notes for local examination

- The credentials in this README are demonstration credentials only.
- Replace `JWT_SECRET` before deploying anywhere beyond a local examination machine.
- Do not commit `.env` files, SQL passwords, or production credentials.
- The optional example SQL login grants `db_owner` for convenience. Use narrower permissions in a production environment.
- The application uses JWT authentication and bcrypt password hashes; it does not require storing plain-text passwords.

---

## 11. Technology summary

| Layer           | Technology                                               |
| --------------- | -------------------------------------------------------- |
| Frontend        | React, TypeScript, Vite, Ant Design, Axios, React Router |
| Backend         | Node.js, Express, TypeScript, Nodemon, TSX               |
| Authentication  | JWT and bcryptjs                                         |
| Database driver | `mssql`                                                  |
| Database        | Microsoft SQL Server                                     |
