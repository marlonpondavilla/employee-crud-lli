import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Input, Space, Table, Tag, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { employeesRequest } from '../services/employee.service';
import type { Employee } from '../types/employee';

const { Title, Text } = Typography;

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setError(null);
        setEmployees(await employeesRequest());
      } catch {
        setError('Unable to load employees. Please check the server connection.');
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;

    return employees.filter((employee) =>
      [
        employee.id,
        employee.employeeCode,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.department,
        employee.position,
        employee.salary,
        employee.hireDate,
        employee.status,
      ].some((value) => String(value ?? '').toLowerCase().includes(query))
    );
  }, [employees, search]);

  const columns: ColumnsType<Employee> = [
    {
      title: 'Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      width: 110,
    },
    { title: 'FirstName', dataIndex: 'firstName', key: 'firstName' },
    { title: 'LastName', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email', width: 240 },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Position', dataIndex: 'position', key: 'position' },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'HireDate',
      dataIndex: 'hireDate',
      key: 'hireDate',
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => (
        <Tag color={value === 'Active' ? 'green' : 'default'}>{value}</Tag>
      ),
    },
  ];

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Employees
          </Title>
          <Text type="secondary">Administrator view of employee records</Text>
        </div>
        <Space>
          <Input
            placeholder="Search employees"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            allowClear
            style={{ width: 260 }}
          />
        </Space>
      </div>

      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

      <Table<Employee>
        rowKey="id"
        columns={columns}
        dataSource={filteredEmployees}
        loading={loading}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 1250 }}
      />
    </Card>
  );
};

export default EmployeesPage;
