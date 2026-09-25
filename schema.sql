IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'EmployeeCrudDB')
    CREATE DATABASE EmployeeCrudDB;
GO

USE EmployeeCrudDB;
GO

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

IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'admin')
    INSERT INTO Users (Username, PasswordHash, FullName, Role)
    VALUES ('admin',
            '$2b$10$C/VKmwiSZH4CQEEwLE3N4eoJYkGylpP0I73LE97R5RRntClY1vzfu',
            'System Administrator', 'Admin');
GO

IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'employee')
    INSERT INTO Users (Username, PasswordHash, FullName, Role)
    VALUES ('employee',
            '$2b$10$C/VKmwiSZH4CQEEwLE3N4eoJYkGylpP0I73LE97R5RRntClY1vzfu',
            'Regular Employee', 'User');
GO

IF NOT EXISTS (SELECT 1 FROM Employees WHERE EmployeeCode = 'EMP001')
    INSERT INTO Employees (EmployeeCode, FirstName, LastName, Email, Department, Position, Salary, HireDate, Status)
    VALUES ('EMP001', 'John', 'Doe', 'john.doe@example.com', 'IT', 'Software Engineer', 75000.00, '2023-01-15', 'Active');
GO

IF NOT EXISTS (SELECT 1 FROM Employees WHERE EmployeeCode = 'EMP002')
    INSERT INTO Employees (EmployeeCode, FirstName, LastName, Email, Department, Position, Salary, HireDate, Status)
    VALUES ('EMP002', 'Jane', 'Smith', 'jane.smith@example.com', 'HR', 'HR Manager', 65000.00, '2022-05-20', 'Active');
GO

IF NOT EXISTS (SELECT 1 FROM Employees WHERE EmployeeCode = 'EMP003')
    INSERT INTO Employees (EmployeeCode, FirstName, LastName, Email, Department, Position, Salary, HireDate, Status)
    VALUES ('EMP003', 'Robert', 'Johnson', 'robert.j@example.com', 'Finance', 'Financial Analyst', 70000.00, '2021-11-01', 'Active');
GO