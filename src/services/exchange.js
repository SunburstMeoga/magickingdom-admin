import request from '../utils/request';

// 获取兑换商品列表
export const getExchangeItemList = (params) => {
  return request({
    url: '/exchange-items',
    method: 'get',
    params,
  });
};

// 创建兑换商品
export const createExchangeItem = (data) => {
  return request({
    url: '/exchange-items',
    method: 'post',
    data,
  });
};

// 更新兑换商品
export const updateExchangeItem = (id, data) => {
  return request({
    url: `/exchange-items/${id}`,
    method: 'put',
    data,
  });
};

// 删除兑换商品
export const deleteExchangeItem = (id) => {
  return request({
    url: `/exchange-items/${id}`,
    method: 'delete',
  });
};

// 获取兑换记录列表
export const getExchangeList = (params) => {
  return request({
    url: '/exchange-records/all',
    method: 'get',
    params,
  });
};

// 审核兑换申请
export const approveExchange = (id, data) => {
  return request({
    url: `/exchange-records/${id}/review`,
    method: 'post',
    data,
  });
};

