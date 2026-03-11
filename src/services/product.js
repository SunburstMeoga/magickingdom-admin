import request from '../utils/request';

// 获取礼物列表
export const getProductList = (params) => {
  return request({
    url: '/gifts',
    method: 'get',
    params,
  });
};

// 获取礼物列表 (别名)
export const getGiftList = (params) => {
  return getProductList(params);
};

// 创建礼物
export const createProduct = (data) => {
  return request({
    url: '/gifts',
    method: 'post',
    data,
  });
};

// 更新礼物
export const updateProduct = (id, data) => {
  return request({
    url: `/gifts/${id}`,
    method: 'put',
    data,
  });
};

// 删除礼物
export const deleteProduct = (id) => {
  return request({
    url: `/gifts/${id}`,
    method: 'delete',
  });
};

