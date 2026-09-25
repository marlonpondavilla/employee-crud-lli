import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Dropdown,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Employee } from '../types/employee';

const { Title, Text } = Typography;

// MOCK DATA — will be replaced with a real API call in Phase 4.
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 1,
    employeeCode: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    department: 'IT',
    position: 'Software Engineer',
    salary: 75000,
    hireDate: '2023-01-15',
    status: 'Active',
  },
  {
    id: 2,
    employeeCode: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    department: 'HR',
    position: 'HR Manager',
    salary: 65000,
    hireDate: '2022-05-20',
    status: 'Active',
  },
  {
    id: 3,
    employeeCode: 'EMP003',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@example.com',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 70000,
    hireDate: '2021-11-01',
    status: 'Active',
  },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);

const EmployeesPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_EMPLOYEES;
    return MOCK_EMPLOYEES.filter(
      (e) =>
        e.employeeCode.toLowerCase().includes(q) ||
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
    );
  }, [search]);

  const notImplemented = (feature: string) =>
    message.info(`${feature} — coming in a later phase`);

  const columns: ColumnsType<Employee> = [
    { title: 'Code', dataIndex: 'employeeCode', key: 'employeeCode', width: 110 },
    {
      title: 'Name',
      key: 'name',
      render: (_, r) => `${r.firstName} ${r.lastName}`,
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Department', dataIndex: 'department', key: 'department', width: 130 },
    { title: 'Position', dataIndex: 'position', key: 'position' },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      align: 'right',
      width: 140,
      render: (v: number) => formatCurrency(v),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: string) => (
        <Tag color={s === 'Active' ? 'green' : 'default'}>{s}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center',
      render: () => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => notImplemented('Edit employee')}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => notImplemented('Delete employee')}
          />
        </Space>
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
          <Text type="secondary">Manage your workforce records</Text>
        </div>

        <Space wrap>
          <Input
            placeholder="Search name, code, or email"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            style={{ width: 260 }}
          />

          <Dropdown
            menu={{
              items: [
                {
                  key: 'csv',
                  icon: <FileTextOutlined />,
                  label: 'Download as CSV',
                  onClick: () => notImplemented('CSV export'),
                },
                {
                  key: 'excel',
                  icon: <FileExcelOutlined />,
                  label: 'Download as Excel',
                  onClick: () => notImplemented('Excel export'),
                },
              ],
            }}
          >
            <Button icon={<DownloadOutlined />}>Generate Report</Button>
          </Dropdown>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => notImplemented('Add employee')}
          >
            Add Employee
          </Button>
        </Space>
      </div>

      <Table<Employee>
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 900 }}
      />
    </Card>
  );
};

export default EmployeesPage;