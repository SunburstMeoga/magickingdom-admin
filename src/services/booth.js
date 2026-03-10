import request from '../utils/request';

// 获取卡座列表
export const getBoothList = (params) => {
  return request({
    url: '/booth/list',
    method: 'get',
    params,
  });
};

// 创建卡座
export const createBooth = (data) => {
  return request({
    url: '/booth/create',
    method: 'post',
    data,
  });
};

// 更新卡座
export const updateBooth = (id, data) => {
  return request({
    url: `/booth/update/${id}`,
    method: 'put',
    data,
  });
};

// 删除卡座
export const deleteBooth = (id) => {
  return request({
    url: `/booth/delete/${id}`,
    method: 'delete',
  });
};

// 获取预订列表
export const getBookingList = (params) => {
  return request({
    url: '/booth/booking/list',
    method: 'get',
    params,
  });
};

// 审核预订
export const approveBooking = (id, data) => {
  return request({
    url: `/booth/booking/approve/${id}`,
    method: 'post',
    data,
  });
};

