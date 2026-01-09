import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { CartDrawerProvider, useCartDrawer } from "./components/CartDrawerContext";
import CartDrawer from "./components/CartDrawer";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <>
      <AuthProvider>
        <CartDrawerProvider>
          <ScrollToTop />
          <CartDrawerPortal />
          <main>
            <Outlet />
          </main>
        </CartDrawerProvider>
      </AuthProvider>
    </>
  );
}

function CartDrawerPortal() {
  const { open, closeDrawer } = useCartDrawer();
  const location = useLocation();
  // Always render CartDrawer, but force open=false on /cart and /login
  const shouldHide = location.pathname.startsWith("/cart") || location.pathname.startsWith("/login");
  return <CartDrawer open={shouldHide ? false : open} onClose={closeDrawer} />;
}

export default App;
