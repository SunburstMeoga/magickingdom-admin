import request from '../utils/request';

// 获取兑换记录列表
export const getExchangeList = (params) => {
  return request({
    url: '/exchange/list',
    method: 'get',
    params,
  });
};

// 审核兑换
export const approveExchange = (id, data) => {
  return request({
    url: `/exchange/approve/${id}`,
    method: 'post',
    data,
  });
};

