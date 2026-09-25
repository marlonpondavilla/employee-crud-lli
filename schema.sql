-- =========================================================
-- employee-crud-lli — Database Schema + Seed Data
-- Instance: SQL Server 2025 Express (MARONDESU\SQLEXPRESS)
--
-- Run as sysadmin (Windows account) on your local instance.
-- Default credentials:
--   Admin:  admin    / password123
--   Employee:   employee / password123
--
-- Passwords are stored as bcrypt hashes (10 rounds).
-- To change, generate a new hash at https://bcrypt-generator.com
-- and replace @Hash below.
-- =========================================================

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'EmployeeCrudDB')
    CREATE DATABASE EmployeeCrudDB;
GO

USE EmployeeCrudDB;
GO

-- =========================================================
-- 1. Tables
-- =========================================================

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        Username     VARCHAR(50)  NOT NULL UNIQUE,
        PasswordHash VARCHAR(255) NOT NULL,
        FullName     VARCHAR(100) NOT NULL,
        Role         VARCHAR(20)  NOT NULL DEFAULT 'User',
        IsActive     BIT          NOT NULL DEFAULT 1,
        CreatedAt    DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Employees')
BEGIN
    CREATE TABLE Employees (
        Id           INT IDENTITY(1,1) PRIMARY KEY,
        EmployeeCode VARCHAR(20)   NOT NULL UNIQUE,
        FirstName    VARCHAR(50)   NOT NULL,
        LastName     VARCHAR(50)   NOT NULL,
        Email        VARCHAR(100)  NOT NULL UNIQUE,
        Department   VARCHAR(50)   NOT NULL,
        Position     VARCHAR(50)   NOT NULL,
        Salary       DECIMAL(18,2) NOT NULL,
        HireDate     DATE          NOT NULL,
        Status       VARCHAR(20)   NOT NULL DEFAULT 'Active',
        CreatedAt    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt    DATETIME2     NULL
    );
END
GO

-- =========================================================
-- 2. Seed Users (2 total)
-- Both passwords: password123
-- =========================================================

DECLARE @Hash VARCHAR(255) = '$2b$10$C/VKmwiSZH4CQEEwLE3N4eoJYkGylpP0I73LE97R5RRntClY1vzfu';

INSERT INTO Users (Username, PasswordHash, FullName, Role)
SELECT s.Username, @Hash, s.FullName, s.Role
FROM (VALUES
    ('admin',    'Test  Admin', 'Admin'),
    ('employee', 'Test User',     'User')
) AS s(Username, FullName, Role)
WHERE NOT EXISTS (SELECT 1 FROM Users u WHERE u.Username = s.Username);
GO

-- =========================================================
-- 3. Seed Employees (18 total — matches demo DB)
-- =========================================================

INSERT INTO Employees
    (EmployeeCode, FirstName, LastName, Email, Department, Position, Salary, HireDate, Status)
SELECT s.EmployeeCode, s.FirstName, s.LastName, s.Email, s.Department, s.Position, s.Salary, s.HireDate, s.Status
FROM (VALUES
    ('EMP001', 'John',        'Doe',       'john.doe@example.com',          'IT',         'Software Engineer',       75000.00, '2023-01-15', 'Active'),
    ('EMP002', 'Jane',        'Smith',     'jane.smith@example.com',        'HR',         'HR Manager',              65000.00, '2022-05-20', 'Active'),
    ('EMP003', 'Robert',      'Johnson',   'robert.j@example.com',          'Finance',    'Financial Analyst',       70000.00, '2021-11-01', 'Active'),
    ('EMP004', 'Michael',     'Brown',     'michael.brown@example.com',     'IT',         'Senior Developer',        85000.00, '2020-03-10', 'Active'),
    ('EMP005', 'Sarah',       'Davis',     'sarah.davis@example.com',       'Marketing',  'Marketing Manager',       72000.00, '2021-07-22', 'Active'),
    ('EMP006', 'David',       'Wilson',    'david.wilson@example.com',      'Finance',    'Accountant',              58000.00, '2019-11-05', 'Active'),
    ('EMP007', 'Emily',       'Martinez',  'emily.martinez@example.com',    'HR',         'Recruiter',               48000.00, '2022-02-14', 'Active'),
    ('EMP008', 'James',       'Anderson',  'james.anderson@example.com',    'IT',         'DevOps Engineer',         92000.00, '2018-06-01', 'Active'),
    ('EMP009', 'Jessica',     'Taylor',    'jessica.taylor@example.com',    'Operations', 'Operations Lead',         67000.00, '2020-09-18', 'Active'),
    ('EMP010', 'Daniel',      'Thomas',    'daniel.thomas@example.com',     'Sales',      'Sales Executive',         55000.00, '2023-04-03', 'Active'),
    ('EMP011', 'Ashley',      'Moore',     'ashley.moore@example.com',      'Marketing',  'Content Specialist',      50000.00, '2022-08-12', 'Active'),
    ('EMP012', 'Matthew',     'Jackson',   'matthew.jackson@example.com',   'IT',         'QA Engineer',             62000.00, '2021-01-25', 'Active'),
    ('EMP013', 'Amanda',      'White',     'amanda.white@example.com',      'Finance',    'Financial Manager',       88000.00, '2019-03-30', 'Active'),
    ('EMP014', 'Christopher', 'Harris',    'chris.harris@example.com',      'Operations', 'Logistics Coordinator',   45000.00, '2023-10-09', 'Inactive'),
    ('EMP015', 'Stephanie',   'Martin',    'steph.martin@example.com',      'HR',         'HR Generalist',           47000.00, '2022-12-01', 'Active'),
    ('EMP016', 'Andrew',      'Thompson',  'andrew.thompson@example.com',   'Sales',      'Account Manager',         64000.00, '2020-05-16', 'Active'),
    ('EMP017', 'Nicole',      'Garcia',    'nicole.garcia@example.com',     'IT',         'Data Analyst',            70000.00, '2021-11-08', 'Active'),
    ('EMP018', 'Joshua',      'Rodriguez', 'joshua.rodriguez@example.com',  'Marketing',  'SEO Specialist',          52000.00, '2023-06-19', 'Active')
) AS s(EmployeeCode, FirstName, LastName, Email, Department, Position, Salary, HireDate, Status)
WHERE NOT EXISTS (SELECT 1 FROM Employees e WHERE e.EmployeeCode = s.EmployeeCode);
GO
