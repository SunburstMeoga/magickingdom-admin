import request from '../utils/request';

// 获取工作人员列表
export const getStaffList = (params) => {
  return request({
    url: '/staff/list',
    method: 'get',
    params,
  });
};

// 创建工作人员
export const createStaff = (data) => {
  return request({
    url: '/staff/create',
    method: 'post',
    data,
  });
};

// 更新工作人员
export const updateStaff = (id, data) => {
  return request({
    url: `/staff/update/${id}`,
    method: 'put',
    data,
  });
};

// 删除工作人员
export const deleteStaff = (id) => {
  return request({
    url: `/staff/delete/${id}`,
    method: 'delete',
  });
};

