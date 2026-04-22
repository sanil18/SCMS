import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Savings from "./pages/Savings";
import Loans from "./pages/Loans";
import Transactions from "./pages/Transactions";
import Anomalies from "./pages/Anomalies";
import Reports from "./pages/Reports";
import AuditLog from "./pages/AuditLog";
import Settings from "./pages/Settings";
import Staff from "./pages/Staff";
import DayEnd from "./pages/DayEnd";
import Vault from "./pages/Vault";
import { NAV } from "./data";

function Protected({ children, allow }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allow && !allow.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function Root() {
  const { user } = useAuth();
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

function LoginRoute() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route
            element={
              <Protected>
                <Layout />
              </Protected>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Protected allow={["admin", "accountant"]}><Members /></Protected>} />
            <Route path="/staff" element={<Protected allow={["admin"]}><Staff /></Protected>} />
            <Route path="/savings" element={<Savings />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/dayend" element={<Protected allow={["admin", "accountant"]}><DayEnd /></Protected>} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/anomalies" element={<Protected allow={["admin", "accountant"]}><Anomalies /></Protected>} />
            <Route path="/reports" element={<Protected allow={["admin", "accountant"]}><Reports /></Protected>} />
            <Route path="/audit" element={<Protected allow={["admin"]}><AuditLog /></Protected>} />
            <Route path="/settings" element={<Protected allow={["admin"]}><Settings /></Protected>} />
          </Route>
          <Route path="*" element={<Root />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
