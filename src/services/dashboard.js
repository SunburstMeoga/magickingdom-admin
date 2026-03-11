import request from '../utils/request';

// 获取首页统计数据
export const getDashboardStats = () => {
  return request({
    url: '/dashboard/stats',
    method: 'get',
  });
};

// 获取最近活动记录
export const getDashboardActivities = (params) => {
  return request({
    url: '/dashboard/activities',
    method: 'get',
    params,
  });
};
