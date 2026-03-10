import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import { setToken, setUser } from '../../utils/auth';
import './index.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 模拟登录 - 实际项目中替换为真实 API
      // const res = await login(values);
      
      // 模拟数据
      const mockToken = 'mock_token_' + Date.now();
      const mockUser = {
        username: values.username,
        name: '管理员',
        role: 'admin'
      };
      
      setToken(mockToken);
      setUser(mockUser);
      
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo">
          <div className="logo-circle">
            <span className="logo-text">魔法王国</span>
          </div>
          <h1 className="system-title">后台管理系统</h1>
        </div>
        
        <Card className="login-card">
          <h2 className="login-title">欢迎登录</h2>
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                block
                className="login-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;

