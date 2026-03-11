import { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Modal, message, Tabs, Table, Tag, Space } from 'antd';
import { UserOutlined, LockOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAdminInfo, changePassword, createAdmin, getAdminList } from '../../services/auth';
import { getUser } from '../../utils/auth';

const { TabPane } = Tabs;

const Admin = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
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

  const fetchAdminList = async (page = 1, pageSize = 10) => {
    try {
      setTableLoading(true);
      const res = await getAdminList({
        page,
        page_size: pageSize,
      });
      if (res.code === 0) {
        setAdminList(res.data?.list || []);
        setPagination({
          current: res.data?.page || page,
          pageSize: res.data?.page_size || pageSize,
          total: res.data?.total || 0,
        });
      } else {
        message.error(res.message || '获取管理员列表失败');
      }
    } catch (error) {
      console.error('获取管理员列表失败:', error);
      message.error('获取管理员列表失败');
    } finally {
      setTableLoading(false);
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
        // 刷新管理员列表
        fetchAdminList(pagination.current, pagination.pageSize);
      } else {
        message.error(res.message || '管理员创建失败');
      }
    } catch (error) {
      message.error('管理员创建失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    fetchAdminList(newPagination.current, newPagination.pageSize);
  };

  const adminColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '头像',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (url) => url ? (
        <img src={url} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />
      ) : (
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <UserOutlined />
        </div>
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          super_admin: { text: '超级管理员', color: 'red' },
          admin: { text: '管理员', color: 'blue' },
        };
        return <Tag color={roleMap[role]?.color}>{roleMap[role]?.text || role}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 1 ? 'green' : 'red'}>
          {status === 1 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />}>
            编辑
          </Button>
          {record.role !== 'super_admin' && (
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Tabs defaultActiveKey="info" onChange={(key) => {
        if (key === 'manage') {
          fetchAdminList(1, 10);
        }
      }}>
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
            title="管理员列表"
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
            <Table
              columns={adminColumns}
              dataSource={adminList}
              rowKey="id"
              loading={tableLoading}
              pagination={pagination}
              onChange={handleTableChange}
            />
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
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
              { max: 50, message: '密码最多50个字符' }
            ]}
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
