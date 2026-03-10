// 开发环境初始化脚本
// 用于自动设置测试管理员 token

export const initDevToken = () => {
  // 仅在开发环境下执行
  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_ADMIN_TOKEN) {
    const token = localStorage.getItem('admin_token');
    
    // 如果本地没有 token，则使用环境变量中的测试 token
    if (!token) {
      localStorage.setItem('admin_token', import.meta.env.VITE_ADMIN_TOKEN);
      console.log('已自动设置测试管理员 Token');
    }
  }
};

