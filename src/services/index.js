// API 服务统一导出
export * from './auth';
export * from './product';
export * from './booth';
export * from './activity';
export * from './exchange';
export * from './staff';

// 管理员相关接口
export {
  login,
  getAdminInfo,
  changePassword,
  createAdmin,
  logoutApi
} from './auth';

// 礼物管理接口
export {
  getProductList,
  getGiftList,
  createProduct,
  updateProduct,
  deleteProduct
} from './product';

// 卡座管理接口
export {
  getBoothList,
  getBoothTypeList,
  createBooth,
  updateBooth,
  deleteBooth,
  getBookingList,
  approveBooking
} from './booth';

// 组局管理接口
export {
  getActivityList,
  approveActivity
} from './activity';

// 兑换管理接口
export {
  getExchangeItemList,
  createExchangeItem,
  updateExchangeItem,
  deleteExchangeItem,
  getExchangeList,
  approveExchange
} from './exchange';

// 工作人员管理接口
export {
  getStaffList,
  createStaff,
  updateStaff,
  deleteStaff
} from './staff';

