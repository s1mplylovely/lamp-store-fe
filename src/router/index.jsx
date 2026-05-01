import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import CatalogPage from '../pages/CatalogPage/CatalogPage';
import AuthPage from '../pages/AuthPage/AuthPage';
import ProductPage from '../pages/ProductPage/ProductPage';
import ProductEditPage from '../pages/ProductEditPage/ProductEditPage';
import CartPage from '../pages/CartPage/CartPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage/OrderConfirmationPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import OrdersManagementPage from '../pages/OrdersManagementPage/OrdersManagementPage';
import OrderEditPage from '../pages/OrderEditPage/OrderEditPage';
import UserManagementPage from '../pages/UserManagementPage/UserManagementPage';
import UserFormPage from '../pages/UserFormPage/UserFormPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/catalog" replace /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'catalog/:id', element: <ProductPage /> },
      { path: 'catalog/:id/edit', element: <ProductEditPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/confirm', element: <OrderConfirmationPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'admin/orders', element: <OrdersManagementPage /> },
      { path: 'admin/orders/:id/edit', element: <OrderEditPage /> },
      { path: 'admin/users', element: <UserManagementPage /> },
      { path: 'admin/users/new', element: <UserFormPage /> },
      { path: 'admin/users/:id/edit', element: <UserFormPage /> },
    ],
  },
  { path: '/auth', element: <AuthPage /> },
]);
