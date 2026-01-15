import { Routes, Route } from "react-router-dom";
import AppLayout from "../layout/AppLayout";

/* ===== PUBLIC ===== */
import SplashPage from "../pages/SplashPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AfterLoginPage from "../pages/AfterLoginPage";

/* ===== PUBLIC CONTENT ===== */
import ProductsPage from "../pages/ProductsPage";
import GalleryPage from "../pages/GalleryPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";

/* ===== USER ===== */
import UserDashboardPage from "../pages/user/UserDashboardPage";
import UserProfilePage from "../pages/user/UserProfilePage";
import UserProductsPage from "../pages/user/UserProductsPage";
import UserProductDetailsPage from "../pages/user/UserProductDetailsPage";
import UserGalleryPage from "../pages/user/UserGalleryPage";
import UserGalleryDetailsPage from "../pages/user/UserGalleryDetailsPage";

// 🔥 ZMIANA: Wskazujemy na plik w folderze 'user', który naprawialiśmy!
import UserCart from "../pages/user/UserCart"; 

/* ===== ADMIN ===== */
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

        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/after-login" element={<AfterLoginPage />} />

        {/* ===== PUBLIC CONTENT ===== */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />

        {/* ===== USER ===== */}
        <Route path="/user/dashboard" element={<UserDashboardPage />} />
        <Route path="/user/profile" element={<UserProfilePage />} />
        
        {/* Tu będzie teraz ładowany właściwy, naprawiony koszyk */}
        <Route path="/user/cart" element={<UserCart />} />

        <Route path="/user/products" element={<UserProductsPage />} />
        <Route
          path="/user/products/:id"
          element={<UserProductDetailsPage />}
        />

        <Route path="/user/gallery" element={<UserGalleryPage />} />
        <Route
          path="/user/gallery/:id"
          element={<UserGalleryDetailsPage />}
        />

        {/* ===== ADMIN ===== */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />

        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route
          path="/admin/products/add"
          element={<AdminAddEditProductPage />}
        />
        <Route
          path="/admin/products/edit/:id"
          element={<AdminAddEditProductPage />}
        />

        <Route path="/admin/gallery" element={<AdminGalleryPage />} />
        <Route
          path="/admin/gallery/add"
          element={<AdminAddEditGalleryPage />}
        />
        <Route
          path="/admin/gallery/edit/:id"
          element={<AdminAddEditGalleryPage />}
        />

        {/* ===== ADMIN STATS ===== */}
        <Route path="/admin/stats" element={<AdminStatsPage />} />

      </Route>
    </Routes>
  );
}