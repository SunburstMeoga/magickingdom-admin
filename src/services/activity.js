import request from '../utils/request';

// 获取组局列表
export const getActivityList = (params) => {
  return request({
    url: '/party-events',
    method: 'get',
    params,
  });
};

// 审核组局
export const approveActivity = (id, data) => {
  return request({
    url: `/party-events/${id}/review`,
    method: 'post',
    data,
  });
};

