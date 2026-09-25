import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import {
  createEmployeeRequest,
  deleteEmployeeRequest,
  employeesRequest,
  updateEmployeeRequest,
} from '../services/employee.service';
import type { Employee, EmployeeInput } from '../types/employee';
import { useAuth } from '../context/useAuth';

const { Title, Text } = Typography;

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);

type EmployeeFormValues = Omit<EmployeeInput, 'salary'> & { salary?: number };

const emptyEmployee: EmployeeFormValues = {
  employeeCode: '',
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  position: '',
  salary: undefined,
  hireDate: '',
  status: 'Active',
};

const EmployeesPage: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm<EmployeeFormValues>();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('id');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (user?.role !== 'Admin') return;

    const loadEmployees = async () => {
      try {
        setError(null);
        const response = await employeesRequest({
          page,
          pageSize,
          search,
          sortField,
          sortOrder,
        });
        setEmployees(response.employees);
        setTotal(response.total);
      } catch {
        setError('Unable to load employees. Please check the server connection.');
      } finally {
        setLoading(false);
      }
    };

    void loadEmployees();
  }, [page, pageSize, refreshKey, search, sortField, sortOrder, user?.role]);

  if (user?.role !== 'Admin') return <Navigate to="/dashboard" replace />;

  const openCreateModal = () => {
    setEditingEmployee(null);
    form.setFieldsValue(emptyEmployee);
    setModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue({
      employeeCode: employee.employeeCode,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      hireDate: employee.hireDate.slice(0, 10),
      status: employee.status,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const handleSubmit = async (values: EmployeeFormValues) => {
    if (values.salary === undefined) {
      form.setFields([{ name: 'salary', errors: ['Enter a valid salary'] }]);
      return;
    }

    const employee: EmployeeInput = { ...values, salary: values.salary };
    setSubmitting(true);
    try {
      if (editingEmployee) {
        await updateEmployeeRequest(editingEmployee.id, employee);
        message.success('Employee updated successfully');
      } else {
        await createEmployeeRequest(employee);
        message.success('Employee added successfully');
      }
      closeModal();
      setRefreshKey((key) => key + 1);
    } catch {
      message.error('Unable to save employee. Check that the code and email are unique.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployeeRequest(id);
      message.success('Employee deleted successfully');
      if (employees.length === 1 && page > 1) setPage((current) => current - 1);
      setRefreshKey((key) => key + 1);
    } catch {
      message.error('Unable to delete employee.');
    }
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: unknown,
    sorter: SorterResult<Employee> | SorterResult<Employee>[]
  ) => {
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
    setSortField(typeof activeSorter?.field === 'string' ? activeSorter.field : 'id');
    setSortOrder(activeSorter?.order === 'descend' ? 'descend' : 'ascend');
  };

  const columns: ColumnsType<Employee> = [
    {
      title: 'Code',
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      width: 110,
      sorter: (a, b) => a.employeeCode.localeCompare(b.employeeCode),
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 240,
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      align: 'right',
      sorter: (a, b) => a.salary - b.salary,
      render: (value: number) => formatCurrency(value),
    },
    {
      title: 'Hire Date',
      dataIndex: 'hireDate',
      key: 'hireDate',
      sorter: (a, b) => a.hireDate.localeCompare(b.hireDate),
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (value: string) => (
        <Tag color={value === 'Active' ? 'green' : 'default'}>{value}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 110,
      render: (_, employee) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            aria-label={`Edit ${employee.employeeCode}`}
            onClick={() => openEditModal(employee)}
          />
          <Popconfirm
            title="Delete this employee?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(employee.id)}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              aria-label={`Delete ${employee.employeeCode}`}
            />
          </Popconfirm>
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
          <Text type="secondary">Create, edit, and manage employee records</Text>
        </div>
        <Space>
          <Input
            placeholder="Search employees"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            allowClear
            style={{ width: 260 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Add Employee
          </Button>
        </Space>
      </div>

      {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />}

      <Table<Employee>
        rowKey="id"
        columns={columns}
        dataSource={employees}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 30, 50],
          showTotal: (count) => `${count} employees`,
        }}
        scroll={{ x: 1450 }}
      />

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add Employee'}
        open={modalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        destroyOnHidden
        width={680}
      >
        <Form<EmployeeFormValues>
          form={form}
          layout="vertical"
          initialValues={emptyEmployee}
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Space style={{ display: 'flex' }} size="middle" align="start">
            <Form.Item
              label="Employee Code"
              name="employeeCode"
              rules={[{ required: true, message: 'Enter an employee code' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="EMP004" />
            </Form.Item>
            <Form.Item
              label="Hire Date"
              name="hireDate"
              rules={[{ required: true, message: 'Select a hire date' }]}
              style={{ flex: 1 }}
            >
              <Input type="date" />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex' }} size="middle" align="start">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: 'Enter a first name' }]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: 'Enter a last name' }]}
              style={{ flex: 1 }}
            >
              <Input />
            </Form.Item>
          </Space>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
          >
            <Input />
          </Form.Item>

          <Space style={{ display: 'flex' }} size="middle" align="start">
            <Form.Item
              label="Department"
              name="department"
              rules={[{ required: true, message: 'Enter a department' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="IT" />
            </Form.Item>
            <Form.Item
              label="Position"
              name="position"
              rules={[{ required: true, message: 'Enter a position' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Software Engineer" />
            </Form.Item>
          </Space>

          <Space style={{ display: 'flex' }} size="middle" align="start">
            <Form.Item
              label="Salary"
              name="salary"
              rules={[{ required: true, type: 'number', min: 0, message: 'Enter a valid salary' }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="Status" name="status" style={{ flex: 1 }}>
              <Select options={[{ value: 'Active' }, { value: 'Inactive' }]} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </Card>
  );
};

export default EmployeesPage;
