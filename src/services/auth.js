import request from '../utils/request';

// 管理员登录
export const login = (data) => {
  return request({
    url: '/auth/admin/login',
    method: 'post',
    data,
  });
};

// 获取管理员信息
export const getAdminInfo = () => {
  return request({
    url: '/admin/info',
    method: 'get',
  });
};

// 修改密码
export const changePassword = (data) => {
  return request({
    url: '/admin/change-password',
    method: 'post',
    data,
  });
};

// 创建管理员
export const createAdmin = (data) => {
  return request({
    url: '/admin/create',
    method: 'post',
    data,
  });
};

// 获取用户信息 (兼容旧接口)
export const getUserInfo = () => {
  return getAdminInfo();
};

// 登出
export const logoutApi = () => {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
};

