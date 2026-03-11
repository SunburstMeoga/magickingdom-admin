import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Tag, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getStaffList, createStaff, updateStaff, deleteStaff } from '../../services';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getStaffList();
      if (res.code === 0) {
        setStaffList(res.data?.list || res.data || []);
      } else {
        message.error(res.message || '获取工作人员列表失败');
      }
    } catch (error) {
      console.error('加载工作人员列表失败:', error);
      message.error('加载工作人员列表失败');
    } finally {
      setLoading(false);
    }
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
      onOk: async () => {
        try {
          const res = await deleteStaff(id);
          if (res.code === 0) {
            message.success('删除成功');
            loadData();
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

      if (editingStaff) {
        const res = await updateStaff(editingStaff.id, values);
        if (res.code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          loadData();
        } else {
          message.error(res.message || '更新失败');
        }
      } else {
        const res = await createStaff(values);
        if (res.code === 0) {
          message.success('添加成功');
          setModalVisible(false);
          loadData();
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

  const columns = [
    { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
    { title: '微信号', dataIndex: 'wechat_id', key: 'wechat_id' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    {
      title: '头像',
      dataIndex: 'avatar_url',
      key: 'avatar_url',
      render: (url) => url ? <img src={url} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} /> : '-'
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
    { title: '排序', dataIndex: 'sort_order', key: 'sort_order' },
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
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="avatar_url" label="头像URL" rules={[{ required: true, message: '请输入头像URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="wechat_id" label="微信号" rules={[{ required: true, message: '请输入微信号' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="wechat_qrcode_url" label="微信二维码URL" rules={[{ required: true, message: '请输入微信二维码URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue={1}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" checked={form.getFieldValue('status') === 1} onChange={(checked) => form.setFieldsValue({ status: checked ? 1 : 0 })} />
          </Form.Item>
          <Form.Item name="sort_order" label="排序" initialValue={0}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Staff;

