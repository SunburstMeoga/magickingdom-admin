import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Tag, message, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const Exchange = () => {
  const [exchangeList, setExchangeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentExchange, setCurrentExchange] = useState(null);

  const mockData = [
    {
      id: 1,
      orderNo: 'EX202603100001',
      userName: '张三',
      phone: '13800138000',
      productName: '可乐',
      quantity: 2,
      points: 160,
      status: 'pending',
      createTime: '2026-03-10 10:30:00',
      address: '北京市朝阳区xxx街道',
    },
    {
      id: 2,
      orderNo: 'EX202603100002',
      userName: '李四',
      phone: '13900139000',
      productName: '桌游套装',
      quantity: 1,
      points: 2990,
      status: 'pending',
      createTime: '2026-03-10 11:15:00',
      address: '上海市浦东新区xxx路',
    },
    {
      id: 3,
      orderNo: 'EX202603090001',
      userName: '王五',
      phone: '13700137000',
      productName: '薯片',
      quantity: 3,
      points: 360,
      status: 'approved',
      createTime: '2026-03-09 15:20:00',
      address: '广州市天河区xxx大道',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setExchangeList(mockData);
  };

  const handleApprove = (id, approved) => {
    setExchangeList(exchangeList.map(item =>
      item.id === id ? { ...item, status: approved ? 'approved' : 'rejected' } : item
    ));
    message.success(approved ? '审核通过' : '已拒绝');
  };

  const handleViewDetail = (record) => {
    setCurrentExchange(record);
    setDetailVisible(true);
  };

  const columns = [
    { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
    { title: '用户姓名', dataIndex: 'userName', key: 'userName' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '兑换商品', dataIndex: 'productName', key: 'productName' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '消耗积分', dataIndex: 'points', key: 'points' },
    { title: '申请时间', dataIndex: 'createTime', key: 'createTime' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { text: '待审核', color: 'orange' },
          approved: { text: '已通过', color: 'green' },
          rejected: { text: '已拒绝', color: 'red' },
          completed: { text: '已完成', color: 'blue' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id, true)}
              >
                通过
              </Button>
              <Button
                type="link"
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleApprove(record.id, false)}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>兑换记录</h1>
      <Table columns={columns} dataSource={exchangeList} rowKey="id" loading={loading} />

      <Modal
        title="兑换详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {currentExchange && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="订单号">{currentExchange.orderNo}</Descriptions.Item>
            <Descriptions.Item label="用户姓名">{currentExchange.userName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{currentExchange.phone}</Descriptions.Item>
            <Descriptions.Item label="兑换商品">{currentExchange.productName}</Descriptions.Item>
            <Descriptions.Item label="数量">{currentExchange.quantity}</Descriptions.Item>
            <Descriptions.Item label="消耗积分">{currentExchange.points}</Descriptions.Item>
            <Descriptions.Item label="收货地址">{currentExchange.address}</Descriptions.Item>
            <Descriptions.Item label="申请时间">{currentExchange.createTime}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                currentExchange.status === 'pending' ? 'orange' :
                currentExchange.status === 'approved' ? 'green' :
                currentExchange.status === 'rejected' ? 'red' : 'blue'
              }>
                {currentExchange.status === 'pending' ? '待审核' :
                 currentExchange.status === 'approved' ? '已通过' :
                 currentExchange.status === 'rejected' ? '已拒绝' : '已完成'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Exchange;

