import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Booth from './pages/Booth';
import Activity from './pages/Activity';
import Product from './pages/Product';
import Staff from './pages/Staff';
import Exchange from './pages/Exchange';
import Admin from './pages/Admin';
import MainLayout from './components/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="booth" element={<Booth />} />
            <Route path="activity" element={<Activity />} />
            <Route path="product" element={<Product />} />
            <Route path="staff" element={<Staff />} />
            <Route path="exchange" element={<Exchange />} />
            <Route path="admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
