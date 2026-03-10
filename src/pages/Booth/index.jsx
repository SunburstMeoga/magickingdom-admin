import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Tag, Tabs } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const Booth = () => {
  const [boothList, setBoothList] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBooth, setEditingBooth] = useState(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockBoothData = [
    { id: 1, name: 'A01', capacity: 6, price: 588, status: 'available', description: '靠窗位置，视野开阔' },
    { id: 2, name: 'A02', capacity: 8, price: 788, status: 'available', description: '豪华卡座，配备独立音响' },
    { id: 3, name: 'B01', capacity: 4, price: 388, status: 'occupied', description: '温馨小卡座' },
  ];

  const mockBookingData = [
    { id: 1, boothName: 'A01', userName: '张三', phone: '13800138000', date: '2026-03-15', status: 'pending' },
    { id: 2, boothName: 'A02', userName: '李四', phone: '13900139000', date: '2026-03-16', status: 'pending' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setBoothList(mockBoothData);
    setBookingList(mockBookingData);
  };

  const handleAdd = () => {
    setEditingBooth(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingBooth(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个卡座吗？',
      onOk: () => {
        setBoothList(boothList.filter(item => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingBooth) {
        setBoothList(boothList.map(item => 
          item.id === editingBooth.id ? { ...item, ...values } : item
        ));
        message.success('更新成功');
      } else {
        const newBooth = { id: Date.now(), ...values, status: 'available' };
        setBoothList([...boothList, newBooth]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleApprove = (id, approved) => {
    setBookingList(bookingList.map(item =>
      item.id === id ? { ...item, status: approved ? 'approved' : 'rejected' } : item
    ));
    message.success(approved ? '审核通过' : '已拒绝');
  };

  const boothColumns = [
    { title: '卡座编号', dataIndex: 'name', key: 'name' },
    { title: '容纳人数', dataIndex: 'capacity', key: 'capacity' },
    { title: '价格', dataIndex: 'price', key: 'price', render: (price) => `¥${price}` },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'available' ? 'green' : 'red'}>
          {status === 'available' ? '可用' : '已占用'}
        </Tag>
      ),
    },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const bookingColumns = [
    { title: '卡座', dataIndex: 'boothName', key: 'boothName' },
    { title: '预订人', dataIndex: 'userName', key: 'userName' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '预订日期', dataIndex: 'date', key: 'date' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { text: '待审核', color: 'orange' },
          approved: { text: '已通过', color: 'green' },
          rejected: { text: '已拒绝', color: 'red' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        record.status === 'pending' && (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleApprove(record.id, true)}
            >
              通过
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleApprove(record.id, false)}
            >
              拒绝
            </Button>
          </Space>
        )
      ),
    },
  ];

  const tabItems = [
    {
      key: '1',
      label: '卡座列表',
      children: (
        <>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
            添加卡座
          </Button>
          <Table columns={boothColumns} dataSource={boothList} rowKey="id" loading={loading} />
        </>
      ),
    },
    {
      key: '2',
      label: '预订审核',
      children: <Table columns={bookingColumns} dataSource={bookingList} rowKey="id" loading={loading} />,
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>卡座管理</h1>
      <Tabs items={tabItems} />

      <Modal
        title={editingBooth ? '编辑卡座' : '添加卡座'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="卡座编号" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="capacity" label="容纳人数" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Booth;

