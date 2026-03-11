import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Tag, message, Descriptions, Input } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { getExchangeList, approveExchange } from '../../services';

const Exchange = () => {
  const [exchangeList, setExchangeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentExchange, setCurrentExchange] = useState(null);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getExchangeList();
      if (res.code === 0) {
        setExchangeList(res.data?.list || res.data || []);
      } else {
        message.error(res.message || '获取兑换记录列表失败');
      }
    } catch (error) {
      console.error('加载兑换记录列表失败:', error);
      message.error('加载兑换记录列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, approved) => {
    if (!approved) {
      setCurrentExchange(exchangeList.find(item => item.id === id));
      setRejectModalVisible(true);
      return;
    }

    try {
      setLoading(true);
      const res = await approveExchange(id, {
        approved: true,
        remark: '已通过'
      });
      if (res.code === 0) {
        message.success('审核通过');
        loadData();
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

  const handleReject = async () => {
    try {
      setLoading(true);
      const res = await approveExchange(currentExchange.id, {
        approved: false,
        remark: remark || '不符合要求'
      });
      if (res.code === 0) {
        message.success('已拒绝');
        setRejectModalVisible(false);
        setRemark('');
        loadData();
      } else {
        message.error(res.message || '操作失败');
      }
    } catch (error) {
      console.error('拒绝失败:', error);
      message.error('拒绝失败');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (record) => {
    setCurrentExchange(record);
    setDetailVisible(true);
  };

  const columns = [
    { title: '用户ID', dataIndex: 'user_id', key: 'user_id' },
    { title: '商品名称', dataIndex: 'item_name', key: 'item_name' },
    {
      title: '商品图片',
      dataIndex: 'item_image_url',
      key: 'item_image_url',
      render: (url) => url ? <img src={url} alt="item" style={{ width: 40, height: 40 }} /> : '-'
    },
    { title: '商品价格（金币）', dataIndex: 'item_price', key: 'item_price' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '总金币', dataIndex: 'total_coins', key: 'total_coins' },
    { title: '常规金币', dataIndex: 'regular_coins_used', key: 'regular_coins_used' },
    { title: '限时金币', dataIndex: 'limited_coins_used', key: 'limited_coins_used' },
    { title: '申请时间', dataIndex: 'created_at', key: 'created_at' },
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
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
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
            <Descriptions.Item label="用户ID">{currentExchange.user_id}</Descriptions.Item>
            <Descriptions.Item label="商品ID">{currentExchange.item_id}</Descriptions.Item>
            <Descriptions.Item label="商品名称">{currentExchange.item_name}</Descriptions.Item>
            <Descriptions.Item label="商品价格">{currentExchange.item_price} 金币</Descriptions.Item>
            <Descriptions.Item label="数量">{currentExchange.quantity}</Descriptions.Item>
            <Descriptions.Item label="总金币">{currentExchange.total_coins}</Descriptions.Item>
            <Descriptions.Item label="常规金币">{currentExchange.regular_coins_used}</Descriptions.Item>
            <Descriptions.Item label="限时金币">{currentExchange.limited_coins_used}</Descriptions.Item>
            <Descriptions.Item label="申请时间">{currentExchange.created_at}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                currentExchange.status === 'pending' ? 'orange' :
                currentExchange.status === 'approved' ? 'green' : 'red'
              }>
                {currentExchange.status === 'pending' ? '待审核' :
                 currentExchange.status === 'approved' ? '已通过' : '已拒绝'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="拒绝原因"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRemark('');
        }}
        confirmLoading={loading}
      >
        <Input.TextArea
          rows={4}
          placeholder="请输入拒绝原因（可选）"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Exchange;

