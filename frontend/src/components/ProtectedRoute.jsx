import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../context/AppContext';
export const UserRoute = ({ children }) => {
  const { userRole } = useContext(AppContext);
  if (!userRole) return <Navigate to="/login" />;
  if (userRole !== 'user') return <Navigate to="/admin" />;
  return children;
};
export const AdminRoute = ({ children }) => {
  const { userRole } = useContext(AppContext);
  if (!userRole) return <Navigate to="/login" />;
  if (userRole !== 'admin') return <Navigate to="/" />;
  return children;
};
