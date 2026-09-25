import React from 'react';
import { Card, Typography } from 'antd';
import { useAuth } from '../context/useAuth';

const { Title, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card>
      <Title level={3}>
        Hello, {user?.role === 'Admin' ? 'Administrator' : 'Employee'} 👋
      </Title>
      <Paragraph type="secondary">
        Welcome back, <strong>{user?.fullName}</strong> — role:{' '}
        <strong>{user?.role}</strong>
      </Paragraph>
      <Paragraph type="secondary">
        Placeholder dashboard. Admin and Employee views will be designed in the next
        phase.
      </Paragraph>
    </Card>
  );
};

export default DashboardPage;