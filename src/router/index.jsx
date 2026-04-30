import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />
  }
]);
