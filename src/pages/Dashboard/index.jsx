import { Row, Col, Card, Statistic } from 'antd';
import {
  ShopOutlined,
  TeamOutlined,
  ShoppingOutlined,
  UserOutlined,
  SwapOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import './index.css';

const Dashboard = () => {
  const statsData = [
    {
      title: '卡座总数',
      value: 48,
      icon: <ShopOutlined />,
      color: '#1890ff',
    },
    {
      title: '组局数量',
      value: 126,
      icon: <TeamOutlined />,
      color: '#52c41a',
    },
    {
      title: '商品种类',
      value: 89,
      icon: <ShoppingOutlined />,
      color: '#faad14',
    },
    {
      title: '工作人员',
      value: 32,
      icon: <UserOutlined />,
      color: '#722ed1',
    },
    {
      title: '待审核预订',
      value: 15,
      icon: <RiseOutlined />,
      color: '#eb2f96',
    },
    {
      title: '待审核兑换',
      value: 8,
      icon: <SwapOutlined />,
      color: '#13c2c2',
    },
  ];

  return (
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
            <div className="activity-item">
              <div className="activity-dot" style={{ background: '#1890ff' }}></div>
              <div className="activity-content">
                <div className="activity-title">新增卡座预订</div>
                <div className="activity-time">5分钟前</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot" style={{ background: '#52c41a' }}></div>
              <div className="activity-content">
                <div className="activity-title">组局审核通过</div>
                <div className="activity-time">15分钟前</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot" style={{ background: '#faad14' }}></div>
              <div className="activity-content">
                <div className="activity-title">商品库存更新</div>
                <div className="activity-time">30分钟前</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot" style={{ background: '#eb2f96' }}></div>
              <div className="activity-content">
                <div className="activity-title">新增兑换申请</div>
                <div className="activity-time">1小时前</div>
              </div>
            </div>
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
  );
};

export default Dashboard;

