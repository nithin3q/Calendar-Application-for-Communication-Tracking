import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [methods, setMethods] = useState([]);
  const [lastFiveCommunicationDate, setLastFiveCommunicationDate] = useState(
    []
  );
  const [nextCommunications, setNextCommunications] = useState({});
  // optional:
  const [activeSchedules, setActiveSchedules] = useState({});

  const [notifications, setNotifications] = useState({
    overdue: [],
    dueToday: [],
  });
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || '');

  const defaultPeriodicInterval = 14; // Default interval in days (2 weeks)

  // Fetch initial data for companies and communication methods
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [companiesRes, methodsRes, schedulesRes] = await Promise.all([
          axios.get("https://calendar-backend-azure.vercel.app/api/companies"),
          axios.get("https://calendar-backend-azure.vercel.app/api/communication-methods"),
          axios.get("https://calendar-backend-azure.vercel.app/api/next-communications"),
        ]);

        const fetchedCompanies = companiesRes.data || [];
        setCompanies(fetchedCompanies);
        setMethods(methodsRes.data || []);

        // Update lastFiveCommunicationDate with populated communication data
        const communicationsData = fetchedCompanies.map((company) =>
          (company.lastCommunications || [])
            .map((comm) => ({
              _id: comm._id,
              communicationDate: comm.communicationDate,
              method: comm.communicationType,
              notes: comm.notes,
            }))
            .sort(
              (a, b) =>
                new Date(b.communicationDate) - new Date(a.communicationDate)
            )
            .slice(0, 5)
        );
        setLastFiveCommunicationDate(communicationsData);

        // Handle schedules
        const schedulesMap = schedulesRes.data.reduce((acc, schedule) => {
          acc[schedule.companyId] = schedule;
          return acc;
        }, {});
        setActiveSchedules(schedulesMap);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  // Compute overdue and due today notifications
  useEffect(() => {
    const computeNotifications = () => {
      const overdue = [];
      const dueToday = [];
      const today = new Date().toISOString().split('T')[0];
  
      companies.forEach((company) => {
        // Check active schedules first
        const schedule = activeSchedules[company._id];
        if (schedule) {
          const scheduledDate = new Date(schedule.scheduledDate).toISOString().split('T')[0];
          
          if (scheduledDate < today) {
            overdue.push(company);
          } else if (scheduledDate === today) {
            dueToday.push(company);
          }
        } else {
          // Fallback to company's nextCommunication if no active schedule
          if (company.nextCommunication) {
            const nextDate = new Date(company.nextCommunication).toISOString().split('T')[0];
            
            if (nextDate < today) {
              overdue.push(company);
            } else if (nextDate === today) {
              dueToday.push(company);
            }
          }
        }
      });
  
      setNotifications({ overdue, dueToday });
    };
  
    computeNotifications();
  }, [companies, activeSchedules]);
  

  // Add a new company
  const addCompany = async (newCompany) => {
    try {
      if (!newCompany.nextCommunication) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + defaultPeriodicInterval);
        newCompany.nextCommunication = nextDate.toISOString().split("T")[0];
      }
      await axios.post("https://calendar-backend-azure.vercel.app/api/companies", newCompany);
      const response = await axios.get("https://calendar-backend-azure.vercel.app/api/companies");
      setCompanies(response.data || []);
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  // Update an existing company
  const updateCompany = async (updatedCompany) => {
    try {
      if (!updatedCompany.nextCommunication) {
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + defaultPeriodicInterval);
        updatedCompany.nextCommunication = nextDate.toISOString().split("T")[0];
      }

      await axios.put(
        `https://calendar-backend-azure.vercel.app/api/companies/${updatedCompany._id}`,
        updatedCompany
      );
      setCompanies((prev) =>
        prev.map((company) =>
          company._id === updatedCompany._id ? updatedCompany : company
        )
      );
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  // Delete a company
  const deleteCompany = async (id) => {
    try {
      await axios.delete(`https://calendar-backend-azure.vercel.app/api/companies/${id}`);
      setCompanies((prev) => prev.filter((company) => company._id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  // Schedule a new communication
  // Add this to the existing state in AppProvider

  // Update the scheduleNextCommunication function
  const scheduleNextCommunication = async (
    companyId,
    communicationType,
    scheduledDate
  ) => {
    try {
      let response;
      if (activeSchedules[companyId]) {
        // Update existing schedule
        response = await axios.put(
          `https://calendar-backend-azure.vercel.app/api/next-communications/${activeSchedules[companyId]._id}`,
          {
            communicationType,
            scheduledDate,
          }
        );
      } else {
        // Create new schedule
        response = await axios.post(
          "https://calendar-backend-azure.vercel.app/api/next-communications",
          {
            companyId,
            communicationType,
            scheduledDate,
          }
        );
      }

      // Update local state with the new/updated schedule
      setActiveSchedules((prev) => ({
        ...prev,
        [companyId]: response.data,
      }));
    } catch (error) {
      console.error("Error scheduling next communication:", error);
    }
  };

  // Log a communication action
  const logCommunication = async (companyId, communicationData) => {
    try {
      const response = await axios.post(
        "https://calendar-backend-azure.vercel.app/api/communications",
        {
          companyId,
          communicationType: communicationData.communicationType,
          communicationDate: communicationData.communicationDate,
          notes: communicationData.notes,
          nextCommunication: communicationData.nextCommunication,
        }
      );

      // Update the companies state with the new data from response
      setCompanies((prevCompanies) =>
        prevCompanies.map((company) =>
          company._id === companyId ? response.data.updatedCompany : company
        )
      );

      // Update lastFiveCommunicationDate with the new communication
      setLastFiveCommunicationDate((prev) => {
        const companyIndex = companies.findIndex((c) => c._id === companyId);
        const newCommunications = [...prev];
        newCommunications[companyIndex] = [
          {
            communicationDate: communicationData.communicationDate,
            method: communicationData.communicationType,
            notes: communicationData.notes,
          },
          ...(prev[companyIndex] || []),
        ].slice(0, 5);
        return newCommunications;
      });
    } catch (error) {
      console.error("Error logging communication:", error);
    }
  };

  // Add a new communication method
  const addMethod = async (newMethod) => {
    try {
      await axios.post(
        "https://calendar-backend-azure.vercel.app/api/communication-methods",
        newMethod
      );
      const response = await axios.get(
        "https://calendar-backend-azure.vercel.app/api/communication-methods"
      );
      setMethods(response.data || []);
      // setMethods((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding communication method:", error);
    }
  };

  // Update an existing communication method
  const updateMethod = async (updatedMethod) => {
    try {
      await axios.put(
        `https://calendar-backend-azure.vercel.app/api/communication-methods/${updatedMethod._id}`,
        updatedMethod
      );
      setMethods((prev) =>
        prev.map((method) =>
          method._id === updatedMethod._id ? updatedMethod : method
        )
      );
    } catch (error) {
      console.error("Error updating communication method:", error);
    }
  };

  // Delete a communication method
  const deleteMethod = async (id) => {
    try {
      await axios.delete(
        `https://calendar-backend-azure.vercel.app/api/communication-methods/${id}`
      );
      setMethods((prev) => prev.filter((method) => method._id !== id));
    } catch (error) {
      console.error("Error deleting communication method:", error);
    }
  };
  const updateLastFiveCommunicationDate = (companyId, newCommunication) => {
    setLastFiveCommunicationDate((prev) => {
      // Create a new array with updated communications for the specific company index
      return prev.map((communications, index) => {
        if (index === companies.findIndex((c) => c._id === companyId)) {
          // Add new communication to existing ones and keep last 5
          return [newCommunication, ...(communications || [])]
            .sort(
              (a, b) =>
                new Date(b.communicationDate) - new Date(a.communicationDate)
            )
            .slice(0, 5);
        }
        return communications;
      });
    });
  };

  // Add this function inside AppProvider
const cancelNextCommunication = async (companyId) => {
  try {
    if (activeSchedules[companyId]) {
      await axios.delete(`https://calendar-backend-azure.vercel.app/api/next-communications/${activeSchedules[companyId]._id}`);
      setActiveSchedules((prev) => {
        const newSchedules = { ...prev };
        delete newSchedules[companyId];
        return newSchedules;
      });
    }
  } catch (error) {
    console.error("Error cancelling next communication:", error);
  }
};
const removeCommunication = async (companyId, communicationId) => {
  try {
    await axios.delete(`https://calendar-backend-azure.vercel.app/api/communications/${communicationId}`);
    
    // Update companies state
    setCompanies(prevCompanies => 
      prevCompanies.map(company => {
        if (company._id === companyId) {
          return {
            ...company,
            lastCommunications: company.lastCommunications.filter(
              comm => comm._id !== communicationId
            )
          };
        }
        return company;
      })
    );

    // Update lastFiveCommunicationDate state
    setLastFiveCommunicationDate(prev => {
      const companyIndex = companies.findIndex(c => c._id === companyId);
      const newCommunications = [...prev];
      newCommunications[companyIndex] = prev[companyIndex].filter(
        comm => comm._id !== communicationId
      );
      return newCommunications;
    });
  } catch (error) {
    console.error("Error removing communication:", error);
  }
};
// optional

const getNotificationCount = () => {
  return notifications.overdue.length + notifications.dueToday.length;
};
  return (
    <AppContext.Provider
      value={{
        companies,
        methods,
        notifications,
        addCompany,
        updateCompany,
        deleteCompany,
        logCommunication,
        addMethod,
        updateMethod,
        deleteMethod,
        lastFiveCommunicationDate,
        updateLastFiveCommunicationDate,
        nextCommunications,
        scheduleNextCommunication,
        activeSchedules,
        getNotificationCount,
        cancelNextCommunication,
        removeCommunication,
        userRole,
        setUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
