import { Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
export const UserRoute = ({ children }) => {
  const { userRole, setUserRole } = useContext(AppContext);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated && storedRole) {
      setUserRole(storedRole);
    }
  }, [setUserRole]);

  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const storedRole = localStorage.getItem('userRole');

  if (!isAuthenticated || !storedRole) {
    return <Navigate to="/login" />;
  }

  if (storedRole === 'admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { userRole, setUserRole } = useContext(AppContext);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (isAuthenticated && storedRole) {
      setUserRole(storedRole);
    }
  }, [setUserRole]);

  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const storedRole = localStorage.getItem('userRole');

  if (!isAuthenticated || !storedRole) {
    return <Navigate to="/login" />;
  }

  if (storedRole === 'user') {
    return <Navigate to="/" />;
  }

  return children;
};

