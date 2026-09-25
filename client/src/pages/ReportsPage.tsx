import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  DownloadOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import jsPDF from 'jspdf';
import { employeesRequest } from '../services/employee.service';
import type { Employee } from '../types/employee';
import { useAuth } from '../context/useAuth';

const { Title, Text } = Typography;

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);

const reportRows = (employees: Employee[]) =>
  employees.map((employee) => ({
    EmployeeCode: employee.employeeCode,
    FirstName: employee.firstName,
    LastName: employee.lastName,
    Email: employee.email,
    Department: employee.department,
    Position: employee.position,
    Salary: employee.salary,
    HireDate: employee.hireDate.slice(0, 10),
    Status: employee.status,
  }));

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportPage, setReportPage] = useState(1);
  const [reportPageSize, setReportPageSize] = useState(10);

  useEffect(() => {
    if (user?.role !== 'Admin') return;

    const loadReportData = async () => {
      try {
        const response = await employeesRequest({ page: 1, pageSize: 1000, sortField: 'id' });
        setEmployees(response.employees);
      } catch {
        setError('Unable to load report data. Please check the server connection.');
      } finally {
        setLoading(false);
      }
    };

    void loadReportData();
  }, [user?.role]);

  const metrics = useMemo(() => {
    const active = employees.filter((employee) => employee.status === 'Active').length;
    const departments = new Set(employees.map((employee) => employee.department)).size;
    const payroll = employees.reduce((total, employee) => total + employee.salary, 0);
    return { active, departments, payroll };
  }, [employees]);

  if (user?.role !== 'Admin') return <Navigate to="/dashboard" replace />;

  const exportCsv = () => {
    const rows = reportRows(employees);
    const headers = Object.keys(rows[0] ?? {
      EmployeeCode: '',
      FirstName: '',
      LastName: '',
      Email: '',
      Department: '',
      Position: '',
      Salary: '',
      HireDate: '',
      Status: '',
    });
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header as keyof typeof row]).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');

    downloadFile(csv, 'employee-report.csv', 'text/csv;charset=utf-8;');
    message.success('CSV report downloaded');
  };

  const exportPdf = () => {
    const rows = reportRows(employees);
    const document = new jsPDF({ orientation: 'landscape' });
    let y = 18;

    document.setFontSize(16);
    document.text('Employee Report', 14, y);
    y += 8;
    document.setFontSize(9);
    document.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
    y += 10;

    rows.forEach((row) => {
      if (y > 185) {
        document.addPage();
        y = 18;
      }

      document.setFontSize(10);
      document.text(`${row.EmployeeCode} - ${row.FirstName} ${row.LastName}`, 14, y);
      document.setFontSize(9);
      document.text(
        `${row.Email} | ${row.Department} | ${row.Position} | ${formatCurrency(row.Salary)}`,
        14,
        y + 5
      );
      document.text(`Hire Date: ${row.HireDate} | Status: ${row.Status}`, 14, y + 10);
      y += 18;
    });

    document.save('employee-report.pdf');
    message.success('PDF report downloaded');
  };

  const columns: ColumnsType<Employee> = [
    { title: 'Code', dataIndex: 'employeeCode', key: 'employeeCode' },
    { title: 'First Name', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Last Name', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Position', dataIndex: 'position', key: 'position' },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Hire Date',
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
    <>
      <Card style={{ marginBottom: 24 }}>
        <div className="reports-toolbar">
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Employee Reports
            </Title>
            <Text type="secondary">Export a summary of the employee records.</Text>
          </div>
          <Space wrap>
            <Dropdown
              trigger={['click']}
              disabled={!employees.length}
              menu={{
                items: [
                  { key: 'csv', icon: <FileTextOutlined />, label: 'CSV file' },
                  { key: 'pdf', icon: <FilePdfOutlined />, label: 'PDF file' },
                ],
                onClick: ({ key }) => {
                  if (key === 'csv') exportCsv();
                  if (key === 'pdf') exportPdf();
                },
              }}
            >
              <Button type="primary" icon={<DownloadOutlined />}>
                Export Report
              </Button>
            </Dropdown>
          </Space>
        </div>
      </Card>

      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 24 }} />}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic title="Total Employees" value={employees.length} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic title="Active Employees" value={metrics.active} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card loading={loading}>
            <Statistic title="Total Payroll" value={metrics.payroll} prefix={<DownloadOutlined />} />
          </Card>
        </Col>
      </Row>

      <Card title="Employee Report Preview">
        <Table<Employee>
          rowKey="id"
          columns={columns}
          dataSource={employees}
          loading={loading}
          pagination={{
            current: reportPage,
            pageSize: reportPageSize,
            total: employees.length,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30, 50],
            showTotal: (total) => `${total} employees`,
          }}
          onChange={(pagination) => {
            setReportPage(pagination.current || 1);
            setReportPageSize(pagination.pageSize || 10);
          }}
          scroll={{ x: 1100 }}
        />
      </Card>
    </>
  );
};

export default ReportsPage;
