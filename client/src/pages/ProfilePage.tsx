import React from 'react';
import { Avatar, Card, Descriptions, Tag, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../context/useAuth';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card>
      <div className="profile-header">
        <Avatar size={64} style={{ background: '#389e0d' }} icon={<UserOutlined />} />
        <div>
          <Title level={3} style={{ margin: 0 }}>
            My Profile
          </Title>
          <Text type="secondary">View your employee account information</Text>
        </div>
      </div>

      <Descriptions bordered column={{ xs: 1, sm: 2 }}>
        <Descriptions.Item label="Full Name">{user?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Username">{user?.username}</Descriptions.Item>
        <Descriptions.Item label="Account ID">{user?.id}</Descriptions.Item>
        <Descriptions.Item label="Role">
          <Tag color="blue">{user?.role}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Account Status">
          <Tag color="green">Active</Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default ProfilePage;
