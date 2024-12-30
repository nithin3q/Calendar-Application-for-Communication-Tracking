import React from "react";

const CompanyCard = ({
  company,
  isSelected,
  highlightDisabled,
  notifications,
  lastFiveDates,
  activeSchedules,
  onToggleSelection,
  onToggleHighlight,
  onScheduleNext,
  hoveredCommunication,
  setHoveredCommunication,
  onCancelNext,
  onRemoveCommunication,
}) => {
  const overdue = notifications.overdue?.some((comp) => comp._id === company._id) || false;
  const dueToday = notifications.dueToday?.some((comp) => comp._id === company._id) || false;

  const highlightClass = !highlightDisabled[company._id] && overdue
    ? "bg-red-50 border-l-4 border-red-500"
    : !highlightDisabled[company._id] && dueToday
    ? "bg-yellow-50 border-l-4 border-yellow-500"
    : "bg-white";

  return (
    <div className={`p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-xl ${highlightClass}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Company Info Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleSelection}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <h3 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                {company.name}
              </h3>
            </div>
            <button
              className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={onToggleSelection}
            >
              Log Communication
            </button>
          </div>
          
          <div className="flex flex-col gap-2 text-sm text-gray-600">
            {company.location && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{company.location}</span>
              </div>
            )}
            {company.linkedInProfile && (
              <a 
                href={company.linkedInProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span>LinkedIn Profile</span>
              </a>
            )}
          </div>
        </div>
        {/* Recent Communications Section */}
        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Recent Communications
          </h4>
          <ul className="space-y-2">
            {lastFiveDates.length > 0 ? (
              lastFiveDates.map((communication) => (
                <li
                  key={communication._id}
                  className="text-sm bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 relative cursor-pointer group"
                  onMouseEnter={() => setHoveredCommunication(communication)}
                  onMouseLeave={() => setHoveredCommunication(null)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      {new Date(communication.communicationDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {communication.method}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveCommunication(communication._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded-full"
                        title="Remove communication"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {hoveredCommunication === communication && communication.notes && (
                    <div className="absolute z-10 p-4 bg-gray-800 text-white text-sm rounded-lg shadow-xl mt-2 max-w-xs transform -translate-x-1/2 left-1/2">
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-800 rotate-45"></div>
                      <p className="relative z-10">{communication.notes}</p>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 italic text-center py-6 bg-white rounded-lg">
                No communication history available
              </li>
            )}
          </ul>
        </div>

        {/* Next Scheduled Contact Section */}
        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Next Scheduled Contact
          </h4>
          <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  {activeSchedules[company._id] ? (
                    <>
                      <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {activeSchedules[company._id].communicationType}
                      </span>
                      <span className="block font-medium text-gray-700">
                        {new Date(activeSchedules[company._id].scheduledDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500 italic">Not Scheduled</span>
                  )}
                </div>
                <div className="flex gap-2">
                  {activeSchedules[company._id] && (
                    <button
                      onClick={onCancelNext}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium transition-colors duration-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={onScheduleNext}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {activeSchedules[company._id] ? "Update" : "Schedule"}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t">
                <input
                  type="checkbox"
                  id={`disable-highlight-${company._id}`}
                  checked={!!highlightDisabled[company._id]}
                  onChange={onToggleHighlight}
                  className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor={`disable-highlight-${company._id}`}
                  className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Mute Alerts
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
