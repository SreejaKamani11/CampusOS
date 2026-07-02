import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import StationeryPage from "../pages/stationery/StationeryPage";
import CartPage from "../pages/cart/CartPage";
import OrdersPage from "../pages/orders/OrdersPage";
import CanteenPage from "../pages/canteen/CanteenPage";
import PrintoutPage from "../pages/printout/PrintoutPage";

import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../layouts/AdminLayout";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import StationeryAdminPage from "../pages/admin/StationeryAdminPage";
import StationeryCategoriesPage from "../pages/admin/StationeryCategoriesPage";
import CanteenAdminPage from "../pages/admin/CanteenAdminPage";
import PrintJobsPage from "../pages/admin/PrintJobsPage";
import AdminOrdersPage from "../pages/admin/AdminOrdersPage";
import CanteenCategoriesPage from "../pages/admin/CanteenCategoriesPage";
import ProfilePage from "../pages/profile/ProfilePage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Student Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/stationery"
          element={
            <ProtectedRoute>
              <StationeryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/canteen"
          element={
            <ProtectedRoute>
              <CanteenPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/printout"
          element={
            <ProtectedRoute>
              <PrintoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />

          <Route path="users" element={<UsersPage />} />

          <Route
            path="stationery"
            element={<StationeryAdminPage />}
          />

          <Route
            path="stationery/categories"
            element={<StationeryCategoriesPage />}
          />

          <Route
            path="canteen"
            element={<CanteenAdminPage />}
          />
<Route
  path="canteen/categories"
  element={<CanteenCategoriesPage />}
/>
          <Route
            path="printjobs"
            element={<PrintJobsPage />}
          />

          <Route
            path="orders"
            element={<AdminOrdersPage />}
          />
        </Route>
        <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;