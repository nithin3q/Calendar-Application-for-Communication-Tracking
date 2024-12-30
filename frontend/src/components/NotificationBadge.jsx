import React from "react";

const NotificationBadge = ({ count }) => {
  return (
    <div className="relative">
      <span className="material-icons text-gray-600 text-3xl">notifications</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  );
};

export default NotificationBadge;
