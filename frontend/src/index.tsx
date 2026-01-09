import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import RegisterPage from "./pages/RegisterPage";
import LoginHeader from "./components/LoginHeader";
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmailPage from "./pages/verifyEmailPage";
import VerifiedEmail from "./pages/verifiedEmail";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import UserLayout from "./layout/UserLayout";
import Purchase from "./pages/Purchase";
import ChangePassword from "./pages/ChangePassword";
import AdminLayout from "./layout/adminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCustomer from "./pages/admin/AdminCustomer";
import AdminOrder from "./pages/admin/AdminOrder";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategory from "./pages/admin/AdminCategory";
import AdminSubCategory from "./pages/admin/AdminSubCategory";
import CategoryPage from "./pages/CategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import ProductsPage from "./pages/ProductsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import SaleOffPageDetail from "./pages/SaleOffPageDetail";
import ProductDetailPage from "./pages/ProductDetailPage";
import AllSubCategoriesPage from "./pages/AllSubCategoriesPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/cart",
        element: (
          <>
            <Header /> <CartPage /> <Footer />
          </>
        ),
      },
      {
        path: "",
        element: (
          <>
            <Header /> <Home /> <Footer />
          </>
        ),
      },
      {
        path: "/search",
        element: (
          <>
            <Header /> <SearchPage /> <Footer />
          </>
        ),
      },
      {
        // SEO: /category/:categoryName-:categoryId
        path: "/category/:categoryName-:categoryId",
        element: (
          <>
            <Header /> <CategoryPage /> <Footer />
          </>
        ),
      },
      {
        // Hỗ trợ cả truy cập cũ: /category/:categoryId (không có tên, fallback)
        path: "/category/:categoryId",
        element: (
          <>
            <Header /> <CategoryPage /> <Footer />
          </>
        ),
      },
      {
        path: "/subcategory/:subCategoryId",
        element: (
          <>
            <Header /> <SubCategoryPage /> <Footer />
          </>
        ),
      },
      {
        path: "/products",
        element: (
          <>
            <Header /> <ProductsPage /> <Footer />
          </>
        ),
      },
      {
        path: "/login",
        element: (
          <>
            <LoginHeader /> <LoginPage /> <Footer />
          </>
        ),
      },
      {
        path: "/register",
        element: (
          <>
            <LoginHeader /> <RegisterPage /> <Footer />
          </>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <>
            <LoginHeader /> <ForgotPassword /> <Footer />
          </>
        ),
      },
      {
        path: "/verify-email",
        element: (
          <>
            <LoginHeader /> <VerifyEmailPage /> <Footer />
          </>
        ),
      },
      {
        path: "/verify-successfully",
        element: (
          <>
            <LoginHeader /> <VerifiedEmail /> <Footer />
          </>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <>
            <LoginHeader /> <ResetPassword /> <Footer />
          </>
        ),
      },
      {
        path: "/user/account/profile",
        element: (
          <ProtectedRoute>
            <Header />
            <UserLayout>
              <Profile />
            </UserLayout>
            <Footer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/account/change-password",
        element: (
          <ProtectedRoute>
            <Header />
            <UserLayout>
              <ChangePassword />
            </UserLayout>
            <Footer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/purchases",
        element: (
          <ProtectedRoute>
            <Header />
            <UserLayout>
              <Purchase />
            </UserLayout>
            <Footer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/customers",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <AdminCustomer />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/orders",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <AdminOrder />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/products",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/categories",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <AdminCategory />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/sub-categories",
        element: (
          <ProtectedRoute>
            <AdminLayout>
              <AdminSubCategory />
            </AdminLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: "/sale-off",
        element: (
          <>
            <Header /> <SaleOffPageDetail /> <Footer />
          </>
        ),
      },
      {
        path: "/products/:category/:subcategory/:slug",
        element: (
          <>
            <Header /> <ProductDetailPage /> <Footer />
          </>
        ),
      },
      {
        path: "/subcategories",
        element: (
          <>
            <Header /> <AllSubCategoriesPage /> <Footer />
          </>
        ),
      },
      {
        path: "/checkout",
        element: (
          <>
            <LoginHeader /> <CheckoutPage /> <Footer />
          </>
        ),
      },
      // {
      //   path: "/product/:id",
      //   element: (
      //     <>
      //       <Header /> <ProductDetailPage /> <Footer />
      //     </>
      //   ),
      // },
    ],
  },
]);

export default router;

// Khi tạo link tới category, dùng dạng `/category/${slugify(category.name)}-${category._id}`
// Ví dụ trong ProductDropdown, Navbar, CategorySlideshow, SearchPage, ...
// VD:
// <Link to={`/category/${slugify(category.name)}-${category._id}`}>{category.name}</Link>
