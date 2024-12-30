import React, { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import CommunicationModal from "./CommunicationModal";
import NextContactModal from "./NextContactModal";
import NotificationsHeader from "./NotificationsHeader";
import CompanyCard from "./CompanyCard";
import NotificationsModal from "./NotificationsModal";
const Dashboard = () => {
  // Keep state and handlers here
  const {
    companies,
    notifications,
    lastFiveCommunicationDate,
    methods,
    logCommunication,
    activeSchedules,
    scheduleNextCommunication,
    getNotificationCount,
    cancelNextCommunication,
    removeCommunication
  } = useContext(AppContext);

  const [highlightDisabled, setHighlightDisabled] = useState({});
  const [hoveredCommunication, setHoveredCommunication] = useState(null);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showNextContactModal, setShowNextContactModal] = useState(false);
  const [selectedCompanyForNextContact, setSelectedCompanyForNextContact] =
    useState(null);
  const [communicationData, setCommunicationData] = useState({
    communicationType: "",
    communicationDate: "",
    notes: "",
  });
  const [nextContactData, setNextContactData] = useState({
    nextCommunicationType: "",
    nextCommunicationDate: "",
  });
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Toggle highlighting for overdue and due today alerts
  const toggleHighlight = (companyId) => {
    setHighlightDisabled((prev) => ({
      ...prev,
      [companyId]: !prev[companyId],
    }));
  };

  // Handle selecting/deselecting companies
  const toggleCompanySelection = (companyId) => {
    setSelectedCompanies((prev) =>
      prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId]
    );
  };

  // Handle submitting communication data
  const handleCommunicationSubmit = (e) => {
    e.preventDefault();
    
    const communicationDate = new Date(communicationData.communicationDate);
    const today = new Date();
    
    if (communicationDate > today) {
      alert("Cannot log future communications. Use the Schedule feature instead.");
      return;
    }

    if (!communicationData.communicationType || !communicationData.communicationDate) {
      alert("Please fill in all required fields.");
      return;
    }

    const newCommunication = {
      ...communicationData,
      communicationDate: communicationDate.toISOString(),
      method: communicationData.communicationType,
    };

    selectedCompanies.forEach((companyId) => {
      logCommunication(companyId, newCommunication);
      setHighlightDisabled((prev) => ({
        ...prev,
        [companyId]: true,
      }));
    });

    setShowCommunicationModal(false);
    setCommunicationData({
      communicationType: "",
      communicationDate: "",
      notes: "",
    });
    setSelectedCompanies([]);
  };

  // Handle submitting next contact data
  const handleNextContactSubmit = (e) => {
    e.preventDefault();
    if (
      !nextContactData.nextCommunicationType ||
      !nextContactData.nextCommunicationDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    // Create the correct data structure
    const scheduledContactData = {
      companyId: selectedCompanyForNextContact,
      communicationType: nextContactData.nextCommunicationType,
      scheduledDate: nextContactData.nextCommunicationDate,
    };

    // Call the scheduling function with correct data structure
    scheduleNextCommunication(
      selectedCompanyForNextContact,
      nextContactData.nextCommunicationType,
      nextContactData.nextCommunicationDate
    );

    setShowNextContactModal(false);
    setNextContactData({
      nextCommunicationType: "",
      nextCommunicationDate: "",
    });
    setSelectedCompanyForNextContact(null);
  };

  // Add handler for notifications click
  const handleNotificationsClick = () => {
    setShowNotificationsModal(true);
  };
  

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* <NotificationsHeader
        notificationCount={getNotificationCount()}
        onNotificationClick={handleNotificationsClick}
      />
      <NotificationsModal
        show={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        overdueCompanies={notifications.overdue}
        todayCompanies={notifications.dueToday}
        activeSchedules={activeSchedules}
      /> */}

      {selectedCompanies.length > 0 && (
        <button
          onClick={() => setShowCommunicationModal(true)}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Communication Performed ({selectedCompanies.length})
        </button>
      )}
      <CommunicationModal
        show={showCommunicationModal}
        onClose={() => setShowCommunicationModal(false)}
        methods={methods}
        communicationData={communicationData}
        setCommunicationData={setCommunicationData}
        handleCommunicationSubmit={handleCommunicationSubmit}
        setShowCommunicationModal={setShowCommunicationModal}
      />
      <NextContactModal
        show={showNextContactModal}
        onClose={() => setShowNextContactModal(false)}
        methods={methods}
        nextContactData={nextContactData}
        setNextContactData={setNextContactData}
        onSubmit={handleNextContactSubmit}
      />
      <div className="grid grid-cols-1 gap-4">
      <h1 className="text-3xl font-bold text-gray-400 mb-2 ">Company Info</h1>
        {companies.map((company, index) => (
          <CompanyCard
          key={company._id}
          company={company}
          isSelected={selectedCompanies.includes(company._id)}
          highlightDisabled={highlightDisabled}
          notifications={notifications}
          lastFiveDates={lastFiveCommunicationDate[index]}
          activeSchedules={activeSchedules}
          onToggleSelection={() => toggleCompanySelection(company._id)}
          onToggleHighlight={() => toggleHighlight(company._id)}  // This is the key handler
          onScheduleNext={() => {
            setSelectedCompanyForNextContact(company._id);
            setShowNextContactModal(true);
          }}
          onCancelNext={() => cancelNextCommunication(company._id)}
          hoveredCommunication={hoveredCommunication}
          setHoveredCommunication={setHoveredCommunication}
          onRemoveCommunication={(communicationId) => {
            if (window.confirm('Are you sure you want to remove this communication?')) {
              removeCommunication(company._id, communicationId);
            }
          }}
        />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
