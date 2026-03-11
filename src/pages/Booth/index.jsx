import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Tag, Tabs, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import {
  getBoothList,
  createBooth,
  updateBooth,
  deleteBooth,
  getBookingList,
  approveBooking
} from '../../services';

const Booth = () => {
  const [boothList, setBoothList] = useState([]);
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBooth, setEditingBooth] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('1');

  useEffect(() => {
    loadBoothData();
  }, []);

  useEffect(() => {
    if (activeTab === '2') {
      loadBookingData();
    }
  }, [activeTab]);

  const loadBoothData = async () => {
    try {
      setLoading(true);
      const res = await getBoothList();
      if (res.code === 0) {
        setBoothList(res.data?.list || res.data || []);
      } else {
        message.error(res.message || '获取卡座类型列表失败');
      }
    } catch (error) {
      console.error('加载卡座类型列表失败:', error);
      message.error('加载卡座类型列表失败');
    } finally {
      setLoading(false);
    }
  };

  const loadBookingData = async () => {
    try {
      setLoading(true);
      const res = await getBookingList();
      if (res.code === 0) {
        setBookingList(res.data?.list || res.data || []);
      } else {
        message.error(res.message || '获取预订列表失败');
      }
    } catch (error) {
      console.error('加载预订列表失败:', error);
      message.error('加载预订列表失败');
    } finally {
      setLoading(false);
    }
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
      content: '确定要删除这个卡座类型吗？',
      onOk: async () => {
        try {
          const res = await deleteBooth(id);
          if (res.code === 0) {
            message.success('删除成功');
            loadBoothData();
          } else {
            message.error(res.message || '删除失败');
          }
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingBooth) {
        const res = await updateBooth(editingBooth.id, values);
        if (res.code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          loadBoothData();
        } else {
          message.error(res.message || '更新失败');
        }
      } else {
        const res = await createBooth(values);
        if (res.code === 0) {
          message.success('添加成功');
          setModalVisible(false);
          loadBoothData();
        } else {
          message.error(res.message || '添加失败');
        }
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, approved) => {
    try {
      setLoading(true);
      const res = await approveBooking(id, {
        status: approved ? 'confirmed' : 'rejected',
        reject_reason: approved ? '' : '不符合要求'
      });
      if (res.code === 0) {
        message.success(approved ? '审核通过' : '已拒绝');
        loadBookingData();
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (error) {
      console.error('审核失败:', error);
      message.error('审核失败');
    } finally {
      setLoading(false);
    }
  };

  const boothColumns = [
    { title: '卡座类型名称', dataIndex: 'name', key: 'name' },
    { title: '卡座类型编码', dataIndex: 'code', key: 'code' },
    { title: '价格（分）', dataIndex: 'price', key: 'price', render: (price) => `¥${(price / 100).toFixed(2)}` },
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
    { title: '排序', dataIndex: 'sort_order', key: 'sort_order' },
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
    { title: '预订编号', dataIndex: 'reservation_no', key: 'reservation_no' },
    { title: '用户昵称', dataIndex: 'user_nickname', key: 'user_nickname' },
    { title: '卡座类型', dataIndex: 'booth_type_name', key: 'booth_type_name' },
    { title: '预订日期', dataIndex: 'reservation_date', key: 'reservation_date' },
    { title: '星期', dataIndex: 'reservation_weekday', key: 'reservation_weekday' },
    { title: '价格（分）', dataIndex: 'price', key: 'price', render: (price) => `¥${(price / 100).toFixed(2)}` },
    {
      title: '押金',
      key: 'deposit',
      render: (_, record) => (
        <span>
          ¥{(record.deposit_amount / 100).toFixed(2)}
          {record.deposit_paid ? <Tag color="green" style={{ marginLeft: 8 }}>已付</Tag> : <Tag color="orange" style={{ marginLeft: 8 }}>未付</Tag>}
        </span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { text: '待审核', color: 'orange' },
          confirmed: { text: '已确认', color: 'green' },
          rejected: { text: '已拒绝', color: 'red' },
          cancelled: { text: '已取消', color: 'gray' },
        };
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
      },
    },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
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
      label: '卡座类型列表',
      children: (
        <>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
            添加卡座类型
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
      <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />

      <Modal
        title={editingBooth ? '编辑卡座类型' : '添加卡座类型'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="卡座类型名称" rules={[{ required: true, message: '请输入卡座类型名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="卡座类型编码" rules={[{ required: true, message: '请输入卡座类型编码' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="价格（分）" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={form.getFieldValue('status') === 1} onChange={(checked) => form.setFieldsValue({ status: checked ? 1 : 0 })} />
          </Form.Item>
          <Form.Item name="sort_order" label="排序" initialValue={0}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Booth;

