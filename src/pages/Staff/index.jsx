import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  const mockData = [
    {
      id: 1,
      name: '张三',
      phone: '13800138000',
      position: '服务员',
      status: 'active',
      email: 'zhangsan@example.com',
      hireDate: '2025-01-15',
    },
    {
      id: 2,
      name: '李四',
      phone: '13900139000',
      position: '经理',
      status: 'active',
      email: 'lisi@example.com',
      hireDate: '2024-06-20',
    },
    {
      id: 3,
      name: '王五',
      phone: '13700137000',
      position: '收银员',
      status: 'inactive',
      email: 'wangwu@example.com',
      hireDate: '2025-03-01',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStaffList(mockData);
  };

  const handleAdd = () => {
    setEditingStaff(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingStaff(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个工作人员吗？',
      onOk: () => {
        setStaffList(staffList.filter(item => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingStaff) {
        setStaffList(staffList.map(item =>
          item.id === editingStaff.id ? { ...item, ...values } : item
        ));
        message.success('更新成功');
      } else {
        const newStaff = { id: Date.now(), ...values, status: 'active' };
        setStaffList([...staffList, newStaff]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns = [
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '职位', dataIndex: 'position', key: 'position' },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    { title: '入职日期', dataIndex: 'hireDate', key: 'hireDate' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '在职' : '离职'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>工作人员管理</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        添加工作人员
      </Button>
      <Table columns={columns} dataSource={staffList} rowKey="id" loading={loading} />

      <Modal
        title={editingStaff ? '编辑工作人员' : '添加工作人员'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              { required: true },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="position" label="职位" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="服务员">服务员</Select.Option>
              <Select.Option value="收银员">收银员</Select.Option>
              <Select.Option value="经理">经理</Select.Option>
              <Select.Option value="主管">主管</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true },
              { type: 'email', message: '请输入正确的邮箱' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="hireDate" label="入职日期" rules={[{ required: true }]}>
            <Input type="date" />
          </Form.Item>
          {editingStaff && (
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="active">在职</Select.Option>
                <Select.Option value="inactive">离职</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Staff;

