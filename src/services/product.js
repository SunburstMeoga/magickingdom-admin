import request from '../utils/request';

// 获取商品列表
export const getProductList = (params) => {
  return request({
    url: '/product/list',
    method: 'get',
    params,
  });
};

// 创建商品
export const createProduct = (data) => {
  return request({
    url: '/product/create',
    method: 'post',
    data,
  });
};

// 更新商品
export const updateProduct = (id, data) => {
  return request({
    url: `/product/update/${id}`,
    method: 'put',
    data,
  });
};

// 删除商品
export const deleteProduct = (id) => {
  return request({
    url: `/product/delete/${id}`,
    method: 'delete',
  });
};

// 更新库存
export const updateStock = (id, data) => {
  return request({
    url: `/product/stock/${id}`,
    method: 'put',
    data,
  });
};

