import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import CatalogPage from '../pages/CatalogPage/CatalogPage';
import AuthPage from '../pages/AuthPage/AuthPage';
import ProductPage from '../pages/ProductPage/ProductPage';
import ProductEditPage from '../pages/ProductEditPage/ProductEditPage';
import CartPage from '../pages/CartPage/CartPage';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';

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
    ],
  },
  { path: '/auth', element: <AuthPage /> },
]);
