import React, { useContext } from 'react';
import AppContext from '../context/AppContext';

const NotificationsModal = ({ show, onClose, overdueCompanies, todayCompanies }) => {
  const { activeSchedules } = useContext(AppContext);
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-red-600 mb-3">
              Overdue Communications ({overdueCompanies.length})
            </h3>
            <div className="grid gap-3">
              {overdueCompanies.map(company => (
                <div key={company._id} className="p-3 border rounded-lg bg-red-50">
                  <p className="font-semibold">{company.name}</p>
                  {activeSchedules[company._id] && (
                    <p className="text-sm text-gray-600">
                      Due: {new Date(activeSchedules[company._id].scheduledDate).toLocaleDateString()}
                      <br />
                      Type: {activeSchedules[company._id].communicationType}
                    </p>
                  )}
                </div>
              ))}
              {overdueCompanies.length === 0 && (
                <p className="text-gray-500">No overdue communications</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-yellow-600 mb-3">
              Due Today ({todayCompanies.length})
            </h3>
            <div className="grid gap-3">
              {todayCompanies.map(company => (
                <div key={company._id} className="p-3 border rounded-lg bg-yellow-50">
                  <p className="font-semibold">{company.name}</p>
                  {activeSchedules[company._id] && (
                    <p className="text-sm text-gray-600">
                      Type: {activeSchedules[company._id].communicationType}
                    </p>
                  )}
                </div>
              ))}
              {todayCompanies.length === 0 && (
                <p className="text-gray-500">No communications due today</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
