import { createContext, useContext, useState } from "react";
import { USERS } from "./data";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem("scms_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (username, password) => {
    const u = USERS.find(
      (x) => x.username === username && x.password === password
    );
    if (!u) return { ok: false, error: "Invalid username or password" };
    return { ok: true, user: u };
  };

  const verifyOtp = (u, otp) => {
    if (u.otp !== otp) return { ok: false, error: "Invalid OTP code" };
    setUser(u);
    sessionStorage.setItem("scms_user", JSON.stringify(u));
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("scms_user");
  };

  return (
    <AuthCtx.Provider value={{ user, login, verifyOtp, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
