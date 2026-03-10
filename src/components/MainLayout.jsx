import { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, message } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShopOutlined,
  TeamOutlined,
  ShoppingOutlined,
  UserOutlined,
  SwapOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout, getUser } from '../utils/auth';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: '/booth',
      icon: <ShopOutlined />,
      label: '卡座管理',
    },
    {
      key: '/activity',
      icon: <TeamOutlined />,
      label: '组局管理',
    },
    {
      key: '/product',
      icon: <ShoppingOutlined />,
      label: '商品管理',
    },
    {
      key: '/staff',
      icon: <UserOutlined />,
      label: '工作人员管理',
    },
    {
      key: '/exchange',
      icon: <SwapOutlined />,
      label: '兑换记录',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    message.success('退出登录成功');
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} className="layout-sider">
        <div className="logo">
          <div className="logo-icon">魔</div>
          {!collapsed && <span className="logo-title">魔法王国管理</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="layout-header">
          <div className="header-left">
            {collapsed ? (
              <MenuUnfoldOutlined
                className="trigger"
                onClick={() => setCollapsed(!collapsed)}
              />
            ) : (
              <MenuFoldOutlined
                className="trigger"
                onClick={() => setCollapsed(!collapsed)}
              />
            )}
          </div>
          <div className="header-right">
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-info">
                <Avatar icon={<UserOutlined />} />
                <span className="username">{user?.name || '管理员'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

