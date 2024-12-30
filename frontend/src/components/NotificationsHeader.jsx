import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

const NotificationsHeader = ({ notificationCount, onNotificationClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUserRole } = useContext(AppContext);
  const path = location.pathname;
  const isAdmin = path.startsWith("/admin");

  const handleLogout = () => {
    setUserRole("");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const getTitle = () => {
    switch (path) {
      case "/":
        return "Dashboard Overview";
      case "/calendar":
        return "Communication Calendar";
      case "/notifications":
        return "Notifications";
      case "/admin":
        return "Admin Dashboard";
      case "/admin/companies":
        return "Manage Companies";
      case "/admin/communication-methods":
        return "Communication Methods";
      default:
        return "Dashboard Overview";
    }
  };

  const getActiveClass = (buttonPath) => {
    return path === buttonPath
      ? "bg-blue-100 text-blue-600 shadow-inner"
      : "bg-white text-gray-600 hover:bg-gray-50";
  };

  return (
    <div className="flex justify-between items-center py-4 px-6 rounded-lg">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        {getTitle()}
      </h2>
      <div className="flex items-center gap-4">
        {isAdmin ? (
          <>
            <Link
              to="/admin/companies"
              className={`relative cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 p-3 rounded-full shadow-md ${getActiveClass(
                "/admin/companies"
              )}`}
              title="Manage Companies"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              {path === "/admin/companies" && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
              )}
            </Link>
            <Link
              to="/admin/communication-methods"
              className={`relative cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 p-3 rounded-full shadow-md ${getActiveClass(
                "/admin/communication-methods"
              )}`}
              title="Communication Methods"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {path === "/admin/communication-methods" && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
              )}
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/"
              className={`relative cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 p-3 rounded-full shadow-md ${getActiveClass(
                "/"
              )}`}
              title="Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {path === "/" && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
              )}
            </Link>
            <Link
              to="/calendar"
              className={`relative cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 p-3 rounded-full shadow-md ${getActiveClass(
                "/calendar"
              )}`}
              title="Calendar View"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {path === "/calendar" && (
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
              )}
            </Link>
            <div
              className={`relative cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 p-3 rounded-full shadow-md ${getActiveClass(
                "/notifications"
              )}`}
              onClick={onNotificationClick}
              title="Notifications"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center transform transition-transform duration-200 hover:scale-110 animate-pulse">
                  {notificationCount}
                </span>
              )}
            </div>
          </>
        )}
        <button
          onClick={handleLogout}
          className="relative cursor-pointer transition-all duration-200 ease-in-out hover:scale-105 p-3 rounded-full shadow-md bg-red-50 text-red-600 hover:bg-red-100"
          title="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationsHeader;
