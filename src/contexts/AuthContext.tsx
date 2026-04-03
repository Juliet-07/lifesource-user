import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  activeRole: "donor" | "recipient";
  usedRoles: string[];
  bloodType: string;
  location: { type: string; coordinates: number[] };
  city: string;
  state: string;
  country: string;
  phone: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
}

interface AuthContextType {
  user: UserData | null;
  token: string | null;
  activeRole: "donor" | "recipient";
  isAuthenticated: boolean;
  login: (data: { user: UserData; accessToken: string; activeRole: string }) => void;
  logout: () => void;
  switchRole: (newRole: "donor" | "recipient") => Promise<void>;
  isSwitching: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
  const [user, setUser] = useState<UserData | null>(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("userToken"));
  const [activeRole, setActiveRole] = useState<"donor" | "recipient">(() => {
    const stored = localStorage.getItem("activeRole");
    return (stored as "donor" | "recipient") || "donor";
  });
  const [isSwitching, setIsSwitching] = useState(false);

  const login = (data: { user: UserData; accessToken: string; activeRole: string }) => {
    setUser(data.user);
    setToken(data.accessToken);
    setActiveRole(data.activeRole as "donor" | "recipient");
    localStorage.setItem("userData", JSON.stringify(data.user));
    localStorage.setItem("userToken", data.accessToken);
    localStorage.setItem("activeRole", data.activeRole);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setActiveRole("donor");
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    localStorage.removeItem("activeRole");
  };

  const switchRole = async (newRole: "donor" | "recipient") => {
    if (newRole === activeRole || !token) return;
    setIsSwitching(true);
    try {
      const { data } = await axios.patch(
        `${apiURL}/auth/switch-role`,
        { activeRole: newRole },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      setActiveRole(newRole);
      localStorage.setItem("activeRole", newRole);
      // Update user if returned
      if (data?.data?.user) {
        setUser(data.data.user);
        localStorage.setItem("userData", JSON.stringify(data.data.user));
      }
    } catch (error) {
      console.error("Failed to switch role:", error);
      throw error;
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, activeRole, isAuthenticated: !!token, login, logout, switchRole, isSwitching }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
