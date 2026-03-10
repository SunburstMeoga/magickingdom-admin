import request from '../utils/request';

// 获取组局列表
export const getActivityList = (params) => {
  return request({
    url: '/activity/list',
    method: 'get',
    params,
  });
};

// 审核组局
export const approveActivity = (id, data) => {
  return request({
    url: `/activity/approve/${id}`,
    method: 'post',
    data,
  });
};

// 删除组局
export const deleteActivity = (id) => {
  return request({
    url: `/activity/delete/${id}`,
    method: 'delete',
  });
};

