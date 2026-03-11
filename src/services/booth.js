import request from '../utils/request';

// 获取卡座类型列表
export const getBoothList = (params) => {
  return request({
    url: '/booth-types',
    method: 'get',
    params,
  });
};

// 获取卡座类型列表 (别名)
export const getBoothTypeList = (params) => {
  return getBoothList(params);
};

// 创建卡座类型
export const createBooth = (data) => {
  return request({
    url: '/booth-types',
    method: 'post',
    data,
  });
};

// 更新卡座类型
export const updateBooth = (id, data) => {
  return request({
    url: `/booth-types/${id}`,
    method: 'put',
    data,
  });
};

// 删除卡座类型
export const deleteBooth = (id) => {
  return request({
    url: `/booth-types/${id}`,
    method: 'delete',
  });
};

// 获取卡座预订列表
export const getBookingList = (params) => {
  return request({
    url: '/booth-reservations',
    method: 'get',
    params,
  });
};

// 审核卡座预订
export const approveBooking = (id, data) => {
  return request({
    url: `/booth-reservations/${id}/review`,
    method: 'post',
    data,
  });
};

