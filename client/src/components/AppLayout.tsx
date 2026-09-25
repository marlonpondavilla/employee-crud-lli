import React from 'react';
import { Avatar, Dropdown, Layout, Menu, Typography, theme } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import SidebarIllustration from './SidebarIllustration';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const menuItems = isAdmin
    ? [
        { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/employees', icon: <TeamOutlined />, label: 'Employees' },
        { key: '/reports', icon: <FileTextOutlined />, label: 'Reports' },
        { key: '/profile', icon: <UserOutlined />, label: 'My Profile' },
      ]
    : [
        { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
        { key: '/profile', icon: <UserOutlined />, label: 'My Profile' },
      ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" width={240}>
        <div
          style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
          }}
        >
          {/* Brand */}
          <div
            style={{
              height: 64,
              padding: '0 20px',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 30,
                height: 30,
                borderRadius: 8,
                background: '#389e0d',
                textAlign: 'center',
                lineHeight: '30px',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              E
            </span>
            Employee CRUD
          </div>

          {/* Main nav */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ flexShrink: 0 }}
          />

          {/* Illustration fills remaining space */}
          <div
            style={{
              flex: 1,
              padding: '24px 20px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            <SidebarIllustration style={{ width: '100%', maxWidth: 180 }} />
          </div>

          {/* Logout pinned at bottom */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
            <Menu
              theme="dark"
              mode="inline"
              selectable={false}
              items={[
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout',
                  onClick: handleLogout,
                },
              ]}
            />
          </div>
        </div>
      </Sider>

      <Layout>
        <Header
          className="app-header"
          style={{
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout',
                  onClick: handleLogout,
                },
              ],
            }}
          >
            <span
              style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Avatar style={{ background: '#389e0d' }} icon={<UserOutlined />} />
              <Text strong>{user?.fullName}</Text>
              <Text type="secondary">({user?.role})</Text>
            </span>
          </Dropdown>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;