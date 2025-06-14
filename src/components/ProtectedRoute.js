import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const email = localStorage.getItem("email");
  const tenant = localStorage.getItem("tenant");
  const role = localStorage.getItem("role");

  if (!email || !tenant || !role) {
    return <Navigate to="/" replace />; // redirect to login
  }

  return children;
};

export default ProtectedRoute;
