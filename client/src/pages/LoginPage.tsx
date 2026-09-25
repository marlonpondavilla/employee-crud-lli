import React, { useState } from 'react';
import { Alert, Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import { isAxiosError } from 'axios';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import LoginIllustration from '../components/LoginIllustration';

const { Title, Text, Paragraph } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to="/dashboard" replace />;

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      await login(values.username.trim(), values.password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errorMessage = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message
        : undefined;
      setError(errorMessage || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#f5f5f5',
      }}
    >
      <Row style={{ flex: 1, margin: 0 }}>
        {/* Left panel — illustration */}
        <Col
          className="login-illustration-panel"
          xs={0}
          md={12}
          lg={14}
          style={{
            background: 'linear-gradient(135deg, #389e0d 0%, #237804 100%)',
            color: '#fff',
            padding: '48px 64px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <Title level={1} style={{ color: '#fff', marginBottom: 8, fontSize: 40 }}>
              Employee CRUD
            </Title>
            <Paragraph
              style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, marginBottom: 24 }}
            >
              Manage your workforce, track records, and generate reports — all in one
              place.
            </Paragraph>
            <LoginIllustration style={{ width: '100%', maxWidth: 460 }} />
          </div>
        </Col>

        {/* Right panel — form */}
        <Col
          xs={24}
          md={12}
          lg={10}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <Card
            style={{
              width: '100%',
              maxWidth: 400,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              border: 'none',
            }}
            styles={{ body: { padding: 32 } }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Title level={3} style={{ marginBottom: 4 }}>
                Welcome back
              </Title>
              <Text type="secondary">Sign in to continue to your dashboard</Text>
            </div>

            {error && (
              <Alert
                type="error"
                message={error}
                showIcon
                closable
                onClose={() => setError(null)}
                style={{ marginBottom: 16 }}
              />
            )}

            <Form<LoginForm>
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please enter your username' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="e.g. admin"
                  autoFocus
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Enter your password"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;