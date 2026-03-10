import request from '../utils/request';

// 登录
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  });
};

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/auth/userinfo',
    method: 'get',
  });
};

// 登出
export const logoutApi = () => {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
};

