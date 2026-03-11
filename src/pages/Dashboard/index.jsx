import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, message } from 'antd';
import {
  ShopOutlined,
  TeamOutlined,
  ShoppingOutlined,
  UserOutlined,
  SwapOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { getDashboardStats, getDashboardActivities } from '../../services';
import './index.css';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, activitiesRes] = await Promise.all([
        getDashboardStats(),
        getDashboardActivities({ limit: 10 })
      ]);

      if (statsRes.code === 0) {
        setStats(statsRes.data);
      }
      if (activitiesRes.code === 0) {
        setActivities(activitiesRes.data?.list || []);
      }
    } catch (error) {
      console.error('加载首页数据失败:', error);
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      title: '卡座总数',
      value: stats.booth_types_count || 0,
      icon: <ShopOutlined />,
      color: '#1890ff',
    },
    {
      title: '组局数量',
      value: stats.party_events_count || 0,
      icon: <TeamOutlined />,
      color: '#52c41a',
    },
    {
      title: '商品种类',
      value: stats.gifts_count || 0,
      icon: <ShoppingOutlined />,
      color: '#faad14',
    },
    {
      title: '工作人员',
      value: stats.staff_count || 0,
      icon: <UserOutlined />,
      color: '#722ed1',
    },
    {
      title: '待审核预订',
      value: stats.pending_reservations_count || 0,
      icon: <RiseOutlined />,
      color: '#eb2f96',
    },
    {
      title: '待审核兑换',
      value: stats.pending_exchanges_count || 0,
      icon: <SwapOutlined />,
      color: '#13c2c2',
    },
  ];

  const getActivityColor = (type) => {
    const colorMap = {
      booth_reservation: '#1890ff',
      party_event_approved: '#52c41a',
      party_event_rejected: '#ff4d4f',
      exchange_approved: '#13c2c2',
      exchange_rejected: '#ff4d4f',
      gift_created: '#faad14',
      staff_created: '#722ed1',
    };
    return colorMap[type] || '#1890ff';
  };

  const formatTime = (timeStr) => {
    const now = new Date();
    const time = new Date(timeStr);
    const diff = Math.floor((now - time) / 1000 / 60);

    if (diff < 1) return '刚刚';
    if (diff < 60) return `${diff}分钟前`;
    if (diff < 1440) return `${Math.floor(diff / 60)}小时前`;
    return `${Math.floor(diff / 1440)}天前`;
  };

  return (
    <Spin spinning={loading}>
      <div className="dashboard">
        <h1 className="page-title">数据概览</h1>

        <Row gutter={[16, 16]}>
          {statsData.map((item, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card className="stat-card" hoverable>
                <div className="stat-content">
                  <div className="stat-icon" style={{ background: item.color }}>
                    {item.icon}
                  </div>
                  <div className="stat-info">
                    <Statistic
                      title={item.title}
                      value={item.value}
                      valueStyle={{ color: item.color }}
                    />
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card title="最近活动" className="activity-card">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-dot" style={{ background: getActivityColor(activity.type) }}></div>
                    <div className="activity-content">
                      <div className="activity-title">{activity.title}</div>
                      <div className="activity-time">{formatTime(activity.created_at)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                  暂无活动记录
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="快捷操作" className="quick-actions-card">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="quick-action-item" style={{ background: '#e6f7ff' }}>
                    <ShopOutlined style={{ fontSize: 32, color: '#1890ff' }} />
                    <div className="action-title">添加卡座</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="quick-action-item" style={{ background: '#f6ffed' }}>
                    <ShoppingOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                    <div className="action-title">添加商品</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="quick-action-item" style={{ background: '#fff7e6' }}>
                    <UserOutlined style={{ fontSize: 32, color: '#faad14' }} />
                    <div className="action-title">添加员工</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="quick-action-item" style={{ background: '#fff0f6' }}>
                    <RiseOutlined style={{ fontSize: 32, color: '#eb2f96' }} />
                    <div className="action-title">审核管理</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default Dashboard;

