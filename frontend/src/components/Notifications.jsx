import React, { useContext } from 'react';
import AppContext from '../context/AppContext';

const Notifications = () => {
  const { notifications } = useContext(AppContext);
  const totalCount = notifications.overdue.length + notifications.dueToday.length;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md relative">
      {totalCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
          {totalCount}
        </span>
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Notifications
        {notifications.overdue.length > 0 && (
          <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
            {notifications.overdue.length} overdue
          </span>
        )}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-red-600 mb-4">
            Overdue Communications ({notifications.overdue.length})
          </h3>
          <ul className="space-y-2">
            {notifications.overdue.map((company) => (
              <li 
                key={company._id}
                className="p-3 bg-white rounded border border-red-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {company.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Today's Communications ({notifications.dueToday.length})
          </h3>
          <ul className="space-y-2">
            {notifications.dueToday.map((company) => (
              <li 
                key={company._id}
                className="p-3 bg-white rounded border border-blue-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {company.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
