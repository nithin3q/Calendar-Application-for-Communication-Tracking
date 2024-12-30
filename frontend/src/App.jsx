import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import AppContext, { AppProvider } from "./context/AppContext";
import BreadCrumbs from "./components/BreadCrumbs";
import Dashboard from "./components/DashBoard";
import Notifications from "./components/Notifications";
import CalendarView from "./components/CalendarView";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageCompanies from "./components/admin/ManageCompanies";
import ManageCommunicationMethods from "./components/admin/ManageCommunicationMethods";
import NotificationsHeader from "./components/NotificationsHeader";
import NotificationsModal from "./components/NotificationsModal";
import { UserRoute, AdminRoute } from "./components/ProtectedRoute";
import Login from "./components/Login";
import { Link } from "react-router-dom";
const AppLayout = () => {
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const { notifications, activeSchedules, getNotificationCount, userRole } =
    useContext(AppContext);
  const location = useLocation();
  const handleNotificationsClick = () => {
    setShowNotificationsModal(true);
  };
  const validRoutes = ['/', '/calendar', '/admin', '/admin/companies', '/admin/communication-methods', '/'];
  const isValidRoute = validRoutes.includes(location.pathname);
  const showHeader = userRole && isValidRoute;
  return (
    <>
      {showHeader && (
        <div className="px-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <NotificationsHeader
            notificationCount={getNotificationCount()}
            onNotificationClick={handleNotificationsClick}
          />
        </div>
      )}
      <NotificationsModal
        show={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        overdueCompanies={notifications.overdue}
        todayCompanies={notifications.dueToday}
        activeSchedules={activeSchedules}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* User Routes */}
        <Route
          path="/"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <UserRoute>
              <CalendarView />
            </UserRoute>
          }
        />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <AdminRoute>
              <ManageCompanies />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/communication-methods"
          element={
            <AdminRoute>
              <ManageCommunicationMethods />
            </AdminRoute>
          }
        />
        {/* not found 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Page not found</p>
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
};
const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
};
export default App;