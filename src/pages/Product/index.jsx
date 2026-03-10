import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, message, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Product = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [stockForm] = Form.useForm();

  const mockData = [
    {
      id: 1,
      name: '可乐',
      category: '饮料',
      price: 8,
      stock: 120,
      image: 'https://via.placeholder.com/100',
      description: '冰镇可乐',
    },
    {
      id: 2,
      name: '薯片',
      category: '零食',
      price: 12,
      stock: 80,
      image: 'https://via.placeholder.com/100',
      description: '原味薯片',
    },
    {
      id: 3,
      name: '桌游套装',
      category: '游戏',
      price: 299,
      stock: 15,
      image: 'https://via.placeholder.com/100',
      description: '经典桌游合集',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProductList(mockData);
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
      content: '确定要删除这个商品吗？',
      onOk: () => {
        setProductList(productList.filter(item => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        setProductList(productList.map(item =>
          item.id === editingProduct.id ? { ...item, ...values } : item
        ));
        message.success('更新成功');
      } else {
        const newProduct = { id: Date.now(), ...values };
        setProductList([...productList, newProduct]);
        message.success('添加成功');
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleUpdateStock = (record) => {
    setEditingProduct(record);
    stockForm.setFieldsValue({ stock: record.stock });
    setStockModalVisible(true);
  };

  const handleStockSubmit = async () => {
    try {
      const values = await stockForm.validateFields();
      setProductList(productList.map(item =>
        item.id === editingProduct.id ? { ...item, stock: values.stock } : item
      ));
      message.success('库存更新成功');
      setStockModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: (image) => <Image src={image} width={50} height={50} />,
    },
    { title: '商品名称', dataIndex: 'name', key: 'name' },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '价格', dataIndex: 'price', key: 'price', render: (price) => `¥${price}` },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <span style={{ color: stock < 20 ? 'red' : 'inherit' }}>
          {stock} {stock < 20 && '(库存不足)'}
        </span>
      ),
    },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleUpdateStock(record)}>
            更新库存
          </Button>
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
      <h1 style={{ marginBottom: 24 }}>商品管理</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        添加商品
      </Button>
      <Table columns={columns} dataSource={productList} rowKey="id" loading={loading} />

      <Modal
        title={editingProduct ? '编辑商品' : '添加商品'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="stock" label="库存" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="image" label="图片URL">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="更新库存"
        open={stockModalVisible}
        onOk={handleStockSubmit}
        onCancel={() => setStockModalVisible(false)}
      >
        <Form form={stockForm} layout="vertical">
          <Form.Item name="stock" label="库存数量" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;

