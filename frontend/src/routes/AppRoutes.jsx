import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { Role } from '../data/constants.js';

import Index from '../pages/Index.jsx';
import NotFound from '../pages/NotFound.jsx';

import AdminLogin from '../pages/admin/Login.jsx';
import AdminDashboard from '../pages/admin/Dashboard.jsx';
import AdminProducts from '../pages/admin/Products.jsx';
import AdminPlans from '../pages/admin/Plans.jsx';
import AdminSubscriptions from '../pages/admin/Subscriptions.jsx';
import AdminInvoices from '../pages/admin/Invoices.jsx';

import InternalLogin from '../pages/internal/Login.jsx';
import InternalDashboard from '../pages/internal/Dashboard.jsx';
import InternalSubscriptions from '../pages/internal/Subscriptions.jsx';
import InternalInvoices from '../pages/internal/Invoices.jsx';

import PortalLogin from '../pages/portal/Login.jsx';
import PortalSignup from '../pages/portal/Signup.jsx';
import PortalDashboard from '../pages/portal/Dashboard.jsx';
import PortalProducts from '../pages/portal/Products.jsx';
import PortalSubscriptions from '../pages/portal/Subscriptions.jsx';
import PortalInvoices from '../pages/portal/Invoices.jsx';
import PortalProfile from '../pages/portal/Profile.jsx';

import ResetPassword from '../pages/auth/ResetPassword.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/reset-password" element={<ResetPassword />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/plans"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminPlans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subscriptions"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminSubscriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/invoices"
        element={
          <ProtectedRoute allowedRoles={[Role.ADMIN]}>
            <AdminInvoices />
          </ProtectedRoute>
        }
      />

      <Route path="/internal/login" element={<InternalLogin />} />
      <Route path="/internal/reset-password" element={<ResetPassword />} />
      <Route
        path="/internal/dashboard"
        element={
          <ProtectedRoute allowedRoles={[Role.INTERNAL]}>
            <InternalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/internal/subscriptions"
        element={
          <ProtectedRoute allowedRoles={[Role.INTERNAL]}>
            <InternalSubscriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/internal/invoices"
        element={
          <ProtectedRoute allowedRoles={[Role.INTERNAL]}>
            <InternalInvoices />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<PortalLogin />} />
      <Route path="/signup" element={<PortalSignup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/portal/dashboard"
        element={
          <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
            <PortalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/products"
        element={
          <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
            <PortalProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/subscriptions"
        element={
          <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
            <PortalSubscriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/invoices"
        element={
          <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
            <PortalInvoices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/profile"
        element={
          <ProtectedRoute allowedRoles={[Role.CUSTOMER]}>
            <PortalProfile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
