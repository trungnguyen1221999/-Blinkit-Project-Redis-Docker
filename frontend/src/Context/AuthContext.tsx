// AuthContext.tsx
import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/api";
import getUserApi from "../api/userApi/getUserApi";
import logoutApi from "../api/userApi/logoutApi";

export type User = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: "USER " | "ADMIN";
  status: "Active" | "Inactive" | "Suspended";
  verify_email: boolean;
};

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  fetchUser: (userId: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // lazy init để tránh gọi localStorage trên server hoặc parse sai
  const initUser = (): User | null => {
    try {
      if (typeof window === "undefined") return null;
      const s = localStorage.getItem("user");
      if (!s) return null;
      // tránh parse "null" / "undefined" string
      if (s === "null" || s === "undefined") return null;
      return JSON.parse(s) as User;
    } catch (err) {
      console.error("AuthProvider: failed parsing localStorage user:", err);
      return null;
    }
  };

  const [user, setUserState] = useState<User | null>(initUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Bắt đầu với false, sẽ check sau
  const [loading, setLoading] = useState<boolean>(true); // Loading = true để check auth trước

  // wrapper setUser để luôn đồng bộ localStorage
  const setUser = (u: User | null) => {
    setUserState(u);
    try {
      if (typeof window !== "undefined") {
        if (u) localStorage.setItem("user", JSON.stringify(u));
        else localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("AuthProvider: setUser localStorage error", err);
    }
  };

  // fetch user từ backend nếu cần (chỉ dùng khi bạn muốn cập nhật từ server)
  const fetchUser = async (userId: string) => {
    try {
      const res = await getUserApi(userId);
      const fetchedUser = res?.data; // chỉ lấy data chứa _id, name, email, avatar
      console.log(fetchUser);
      if (fetchedUser) setUser(fetchedUser);
    } catch (err) {
      await logoutApi(); // logout nếu fetch user fail (token invalid...)
      console.error("fetchUser error:", err);
    }
  };

  // Kiểm tra auth state khi app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra có user trong localStorage không
        const localUser = initUser();
        if (!localUser) {
          setLoading(false);
          return;
        }

        // Verify với server nếu có user trong localStorage
        const res = await api.get("/user/check-auth", {
          withCredentials: true,
        });
        
        const isValid = !!res?.data?.success;
        if (isValid && res.data.userId) {
          // Token hợp lệ, fetch thông tin user mới nhất
          await fetchUser(res.data.userId);
          setIsAuthenticated(true);
        } else {
          // Token không hợp lệ, clear localStorage
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        console.warn("Auth check failed:", err);
        // Token expired hoặc lỗi, clear state
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        loading,
        setLoading,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
