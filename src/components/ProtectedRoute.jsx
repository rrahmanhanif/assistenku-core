import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <div style={{ padding: 20 }}>Memuat...</div>;

  if (!currentUser) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
