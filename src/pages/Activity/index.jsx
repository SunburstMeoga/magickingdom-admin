import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Tag, message, Descriptions } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const Activity = () => {
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);

  const mockData = [
    {
      id: 1,
      title: '周末桌游聚会',
      organizer: '王五',
      phone: '13700137000',
      date: '2026-03-20',
      time: '14:00-18:00',
      maxParticipants: 8,
      currentParticipants: 5,
      status: 'pending',
      description: '欢迎桌游爱好者参加，一起度过愉快的周末时光',
    },
    {
      id: 2,
      title: '剧本杀专场',
      organizer: '赵六',
      phone: '13600136000',
      date: '2026-03-22',
      time: '19:00-23:00',
      maxParticipants: 6,
      currentParticipants: 4,
      status: 'pending',
      description: '恐怖主题剧本杀，需要胆量',
    },
    {
      id: 3,
      title: '狼人杀大赛',
      organizer: '孙七',
      phone: '13500135000',
      date: '2026-03-18',
      time: '20:00-22:00',
      maxParticipants: 12,
      currentParticipants: 10,
      status: 'approved',
      description: '狼人杀爱好者聚会',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setActivityList(mockData);
  };

  const handleApprove = (id, approved) => {
    setActivityList(activityList.map(item =>
      item.id === id ? { ...item, status: approved ? 'approved' : 'rejected' } : item
    ));
    message.success(approved ? '审核通过' : '已拒绝');
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个组局吗？',
      onOk: () => {
        setActivityList(activityList.filter(item => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleViewDetail = (record) => {
    setCurrentActivity(record);
    setDetailVisible(true);
  };

  const columns = [
    { title: '活动标题', dataIndex: 'title', key: 'title' },
    { title: '组织者', dataIndex: 'organizer', key: 'organizer' },
    { title: '联系电话', dataIndex: 'phone', key: 'phone' },
    { title: '活动日期', dataIndex: 'date', key: 'date' },
    { title: '活动时间', dataIndex: 'time', key: 'time' },
    {
      title: '参与人数',
      key: 'participants',
      render: (_, record) => `${record.currentParticipants}/${record.maxParticipants}`,
    },
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
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>组局管理</h1>
      <Table columns={columns} dataSource={activityList} rowKey="id" loading={loading} />

      <Modal
        title="组局详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {currentActivity && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="活动标题">{currentActivity.title}</Descriptions.Item>
            <Descriptions.Item label="组织者">{currentActivity.organizer}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{currentActivity.phone}</Descriptions.Item>
            <Descriptions.Item label="活动日期">{currentActivity.date}</Descriptions.Item>
            <Descriptions.Item label="活动时间">{currentActivity.time}</Descriptions.Item>
            <Descriptions.Item label="最大人数">{currentActivity.maxParticipants}</Descriptions.Item>
            <Descriptions.Item label="当前人数">{currentActivity.currentParticipants}</Descriptions.Item>
            <Descriptions.Item label="活动描述">{currentActivity.description}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                currentActivity.status === 'pending' ? 'orange' :
                currentActivity.status === 'approved' ? 'green' : 'red'
              }>
                {currentActivity.status === 'pending' ? '待审核' :
                 currentActivity.status === 'approved' ? '已通过' : '已拒绝'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Activity;

