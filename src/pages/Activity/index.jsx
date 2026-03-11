import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Tag, message, Descriptions, Input } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getActivityList, approveActivity } from '../../services';

const Activity = () => {
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getActivityList();
      if (res.code === 0) {
        setActivityList(res.data?.list || res.data || []);
      } else {
        message.error(res.message || '获取组局列表失败');
      }
    } catch (error) {
      console.error('加载组局列表失败:', error);
      message.error('加载组局列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, approved) => {
    if (!approved) {
      setCurrentActivity(activityList.find(item => item.id === id));
      setRejectModalVisible(true);
      return;
    }

    try {
      setLoading(true);
      const res = await approveActivity(id, {
        action: 'approve'
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
    if (!rejectReason.trim()) {
      message.warning('请输入拒绝原因');
      return;
    }

    try {
      setLoading(true);
      const res = await approveActivity(currentActivity.id, {
        action: 'reject',
        reject_reason: rejectReason
      });
      if (res.code === 0) {
        message.success('已拒绝');
        setRejectModalVisible(false);
        setRejectReason('');
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

  const handleDelete = (id) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个组局吗？',
      onOk: async () => {
        // 注意：API文档中没有删除组局的接口，这里保留前端逻辑
        message.info('删除功能暂未实现');
      },
    });
  };

  const handleViewDetail = (record) => {
    setCurrentActivity(record);
    setDetailVisible(true);
  };

  const columns = [
    { title: '活动标题', dataIndex: 'title', key: 'title' },
    { title: '组织者', dataIndex: 'creator_nickname', key: 'creator_nickname' },
    { title: '活动日期', dataIndex: 'event_date', key: 'event_date' },
    { title: '活动时间', dataIndex: 'event_time', key: 'event_time' },
    {
      title: '参与人数',
      key: 'participants',
      render: (_, record) => `${record.current_participants || 0}/${record.max_participants}`,
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
          dissolved: { text: '已解散', color: 'gray' },
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
            <Descriptions.Item label="组织者">{currentActivity.creator_nickname}</Descriptions.Item>
            <Descriptions.Item label="活动日期">{currentActivity.event_date}</Descriptions.Item>
            <Descriptions.Item label="活动时间">{currentActivity.event_time}</Descriptions.Item>
            <Descriptions.Item label="最大人数">{currentActivity.max_participants}</Descriptions.Item>
            <Descriptions.Item label="当前人数">{currentActivity.current_participants || 0}</Descriptions.Item>
            <Descriptions.Item label="活动描述">{currentActivity.description}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={
                currentActivity.status === 'pending' ? 'orange' :
                currentActivity.status === 'approved' ? 'green' :
                currentActivity.status === 'rejected' ? 'red' : 'gray'
              }>
                {currentActivity.status === 'pending' ? '待审核' :
                 currentActivity.status === 'approved' ? '已通过' :
                 currentActivity.status === 'rejected' ? '已拒绝' : '已解散'}
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
          setRejectReason('');
        }}
        confirmLoading={loading}
      >
        <Input.TextArea
          rows={4}
          placeholder="请输入拒绝原因"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Activity;

