import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Image, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProductList, createProduct, updateProduct, deleteProduct } from '../../services';

const Product = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getProductList();
      if (res.code === 0) {
        setProductList(res.data?.list || res.data || []);
      } else {
        message.error(res.message || '获取礼物列表失败');
      }
    } catch (error) {
      console.error('加载礼物列表失败:', error);
      message.error('加载礼物列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个礼物吗？',
      onOk: async () => {
        try {
          const res = await deleteProduct(id);
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

      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, values);
        if (res.code === 0) {
          message.success('更新成功');
          setModalVisible(false);
          loadData();
        } else {
          message.error(res.message || '更新失败');
        }
      } else {
        const res = await createProduct(values);
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
    {
      title: '图片',
      dataIndex: 'image_url',
      key: 'image_url',
      render: (image) => <Image src={image || 'https://via.placeholder.com/50'} width={50} height={50} />,
    },
    { title: '礼物名称', dataIndex: 'name', key: 'name' },
    { title: '价格（金币）', dataIndex: 'price', key: 'price' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === 1 ? 'green' : 'red' }}>
          {status === 1 ? '启用' : '禁用'}
        </span>
      ),
    },
    { title: '排序', dataIndex: 'sort_order', key: 'sort_order' },
    { title: '描述', dataIndex: 'description', key: 'description' },
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
      <h1 style={{ marginBottom: 24 }}>礼物管理</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        添加礼物
      </Button>
      <Table columns={columns} dataSource={productList} rowKey="id" loading={loading} />

      <Modal
        title={editingProduct ? '编辑礼物' : '添加礼物'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="礼物名称" rules={[{ required: true, message: '请输入礼物名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="image_url" label="图片URL" rules={[{ required: true, message: '请输入图片URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="price" label="价格（金币）" rules={[{ required: true, message: '请输入价格' }]}>
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

export default Product;

