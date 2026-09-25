import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Card, Col, Row, Statistic, Typography } from 'antd';
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/useAuth';
import { employeesRequest } from '../services/employee.service';
import type { Employee } from '../types/employee';

const { Title, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'Admin') return;

    const loadEmployees = async () => {
      setLoading(true);
      try {
        setEmployees(await employeesRequest());
        setError(null);
      } catch {
        setError('Unable to load administrator metrics.');
      } finally {
        setLoading(false);
      }
    };

    void loadEmployees();
  }, [user?.role]);

  const metrics = useMemo(() => {
    const activeEmployees = employees.filter((employee) => employee.status === 'Active');
    const departments = new Set(employees.map((employee) => employee.department));
    const annualPayroll = employees.reduce((total, employee) => total + employee.salary, 0);

    return {
      total: employees.length,
      active: activeEmployees.length,
      departments: departments.size,
      annualPayroll,
    };
  }, [employees]);

  return (
    <>
      <Card style={{ marginBottom: 24 }}>
        <Title level={3}>
          Hello, {user?.role === 'Admin' ? 'Administrator' : 'Employee'} 👋
        </Title>
        <Paragraph type="secondary">
          Welcome back, <strong>{user?.fullName}</strong> — role:{' '}
          <strong>{user?.role}</strong>
        </Paragraph>
        <Paragraph type="secondary">
          {user?.role === 'Admin'
            ? 'Here is a quick overview of your workforce.'
            : 'Use the dashboard to review your account information.'}
        </Paragraph>
      </Card>

      {user?.role === 'Admin' && (
        <>
          {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 24 }} />}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={6}>
              <Card loading={loading}>
                <Statistic
                  title="Total Employees"
                  value={metrics.total}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#1677ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <Card loading={loading}>
                <Statistic
                  title="Active Employees"
                  value={metrics.active}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#389e0d' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <Card loading={loading}>
                <Statistic
                  title="Departments"
                  value={metrics.departments}
                  prefix={<ApartmentOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <Card loading={loading}>
                <Statistic
                  title="Annual Payroll"
                  value={metrics.annualPayroll}
                  formatter={(value) =>
                    new Intl.NumberFormat('en-PH', {
                      style: 'currency',
                      currency: 'PHP',
                    }).format(Number(value))
                  }
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#d48806' }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default DashboardPage;