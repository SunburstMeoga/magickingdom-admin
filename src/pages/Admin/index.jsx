import { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Modal, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';
import { getAdminInfo, changePassword, createAdmin } from '../../services/auth';
import { getUser } from '../../utils/auth';

const { TabPane } = Tabs;

const Admin = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordForm] = Form.useForm();
  const [createForm] = Form.useForm();

  useEffect(() => {
    fetchAdminInfo();
  }, []);

  const fetchAdminInfo = async () => {
    try {
      const res = await getAdminInfo();
      if (res.code === 0) {
        setAdminInfo(res.data);
      }
    } catch (error) {
      // 如果接口失败，使用本地存储的用户信息
      const localUser = getUser();
      if (localUser) {
        setAdminInfo(localUser);
      }
    }
  };

  const handleChangePassword = async (values) => {
    setLoading(true);
    try {
      const res = await changePassword(values);
      if (res.code === 0) {
        message.success('密码修改成功');
        setPasswordModalVisible(false);
        passwordForm.resetFields();
      } else {
        message.error(res.message || '密码修改失败');
      }
    } catch (error) {
      message.error('密码修改失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (values) => {
    setLoading(true);
    try {
      const res = await createAdmin(values);
      if (res.code === 0) {
        message.success('管理员创建成功');
        setCreateModalVisible(false);
        createForm.resetFields();
      } else {
        message.error(res.message || '管理员创建失败');
      }
    } catch (error) {
      message.error('管理员创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey="info">
        <TabPane tab="个人信息" key="info">
          <Card title="管理员信息" style={{ maxWidth: 600 }}>
            {adminInfo && (
              <div>
                <p><strong>用户名：</strong>{adminInfo.username}</p>
                <p><strong>昵称：</strong>{adminInfo.nickname || adminInfo.name}</p>
                <p><strong>角色：</strong>{adminInfo.role}</p>
                <Button 
                  type="primary" 
                  icon={<LockOutlined />}
                  onClick={() => setPasswordModalVisible(true)}
                >
                  修改密码
                </Button>
              </div>
            )}
          </Card>
        </TabPane>
        
        <TabPane tab="管理员管理" key="manage">
          <Card 
            title="管理员管理" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                创建管理员
              </Button>
            }
          >
            <p>管理员列表功能待开发...</p>
          </Card>
        </TabPane>
      </Tabs>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          onFinish={handleChangePassword}
          layout="vertical"
        >
          <Form.Item
            name="old_password"
            label="原密码"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="新密码"
            rules={[{ required: true, message: '请输入新密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建管理员弹窗 */}
      <Modal
        title="创建管理员"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          onFinish={handleCreateAdmin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item name="nickname" label="昵称">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              创建管理员
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
