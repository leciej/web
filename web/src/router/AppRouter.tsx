import { Routes, Route } from "react-router-dom";
import AppLayout from "../layout/AppLayout";

import SplashPage from "../pages/SplashPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AfterLoginPage from "../pages/AfterLoginPage";

import ProductDetailsPage from "../pages/ProductDetailsPage";
import AdminStatsPage from "../pages/admin/AdminStatsPage";
import AdminDashboardPage from "../pages/admin/AdminDashboard";
import AdminProfilePage from "../pages/admin/AdminProfilePage";
import AdminProductsPage from "../pages/admin/AdminProductsPage";
import AdminGalleryPage from "../pages/admin/AdminGalleryPage";
import AdminAddEditGalleryPage from "../pages/admin/AdminAddEditGalleryPage";
import AdminAddEditProductPage from "../pages/admin/AdminAddEditProductPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* PUBLIC */}
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/after-login" element={<AfterLoginPage />} />

        {/* PRODUCT DETAILS (PUBLIC) */}
        <Route path="/products/:id" element={<ProductDetailsPage />} />

        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />

        {/* PRODUCTS (ADMIN) */}
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route
          path="/admin/products/add"
          element={<AdminAddEditProductPage />}
        />
        <Route
          path="/admin/products/edit/:id"
          element={<AdminAddEditProductPage />}
        />

        {/* GALLERY (ADMIN) */}
        <Route path="/admin/gallery" element={<AdminGalleryPage />} />
        <Route
          path="/admin/gallery/add"
          element={<AdminAddEditGalleryPage />}
        />
        <Route
          path="/admin/gallery/edit/:id"
          element={<AdminAddEditGalleryPage />}
        />
        <Route path="/admin/stats" element={<AdminStatsPage />} />
      </Route>
    </Routes>
  );
}
