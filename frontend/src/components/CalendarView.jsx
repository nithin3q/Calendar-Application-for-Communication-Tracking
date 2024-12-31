import React, { useContext, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import AppContext from '../context/AppContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import NextContactModal from './NextContactModal';


const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const CalendarView = () => {
  const { companies, activeSchedules, methods, scheduleNextCommunication } = useContext(AppContext);
  const [selectedView, setSelectedView] = useState('month');

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [nextContactData, setNextContactData] = useState({
    nextCommunicationType: '',
    nextCommunicationDate: '',
  });

  const handleEventClick = (event) => {
    if (event.type === 'upcoming') {
      setSelectedEvent(event);
      setNextContactData({
        nextCommunicationType: event.method,
        nextCommunicationDate: new Date(event.start).toISOString().split('T')[0],
      });
      setShowRescheduleModal(true);
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    scheduleNextCommunication(
      selectedEvent.companyId,
      nextContactData.nextCommunicationType,
      nextContactData.nextCommunicationDate
    );
    setShowRescheduleModal(false);
    setSelectedEvent(null);
  };

  const events = companies.flatMap(company => {
    const pastEvents = (company.lastCommunications || []).map(comm => ({
      title: `${company.name} - ${comm.communicationType}`,
      start: new Date(comm.communicationDate),
      end: new Date(comm.communicationDate),
      type: 'past',
      notes: comm.notes,
      company: company.name,
      companyId: company._id
    }));

    const upcomingEvent = activeSchedules[company._id] ? [{
      title: `${company.name} - ${activeSchedules[company._id].communicationType}`,
      start: new Date(activeSchedules[company._id].scheduledDate),
      end: new Date(activeSchedules[company._id].scheduledDate),
      type: 'upcoming',
      company: company.name,
      companyId: company._id,
      method: activeSchedules[company._id].communicationType
    }] : [];

    return [...pastEvents, ...upcomingEvent];
  });
  const moveEvent = ({ event, start, end }) => {
    if (event.type === 'upcoming') {
      const newDate = moment(start).format('YYYY-MM-DD');
      scheduleNextCommunication(
        event.companyId,
        event.method,
        newDate
      );
    }
  };

  const eventStyleGetter = (event) => {
    const isUpcoming = event.type === 'upcoming';
    const today = new Date().toISOString().split('T')[0];
    const eventDate = new Date(event.start).toISOString().split('T')[0];
    
    let backgroundColor = '#4A5568'; // default gray for past events
    
    if (isUpcoming) {
      if (eventDate < today) {
        backgroundColor = '#EF4444'; // red for overdue
      } else if (eventDate === today) {
        backgroundColor = '#F59E0B'; // yellow for due today
      } else {
        backgroundColor = '#2B6CB0'; // blue for upcoming
      }
    }
  
    const baseStyle = {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      display: 'block',
      padding: '2px 5px',
      cursor: isUpcoming ? 'move' : 'default',
      position: 'relative',
      transition: 'all 0.3s ease'
    };
  
    if (isUpcoming) {
      return {
        className: 'upcoming-event',
        style: baseStyle
      };
    }
  
    return {
      style: baseStyle
    };
  };

  const CustomToolbar = (toolbar) => (
    <div className="flex flex-col gap-4 mb-4 p-2 bg-gray-100 rounded">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => toolbar.onNavigate('PREV')}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => toolbar.onNavigate('NEXT')}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
        <span className="text-lg font-semibold">{toolbar.label}</span>
        <div className="flex gap-2">
          {['month', 'week', 'day'].map(view => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              className={`px-3 py-1 rounded transition-colors ${
                selectedView === view 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-[#EF4444]"></div>
        <span>Overdue</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-[#F59E0B]"></div>
        <span>Due Today</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-[#2B6CB0]"></div>
        <span>Upcoming</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded bg-[#4A5568]"></div>
        <span>Past</span>
      </div>
    </div>
    </div>
  );
  return (
    <div className="p-4">
      {/* <h2 className="text-2xl font-bold mb-6">Communication Calendar</h2> */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <style>
          {`
            .upcoming-event:hover {
              transform: scale(1.02);
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .upcoming-event:hover::after {
              content: '';
              position: absolute;
              top: 25px;
              left: 50%;
              transform: translateX(-50%);
              width: 20px;
              height: 20px;
              background: url('https://aquarlabs.com/assets/imgs/template/icons/cursor-drag.svg') center/contain no-repeat;
              background-color: rgba(0,0,0,0.8);
              border-radius: 50%;
              padding: 10px;
            }
            .upcoming-event:hover::before {
              content: 'Drag';
              position: absolute;
              top: -15px;
              left: 50%;
              transform: translateX(-50%);
              background-color: rgba(0,0,0,0.8);
              color: white;
              padding: 2px 6px;
              border-radius: 40px;
              font-size: 12px;
              white-space: nowrap;
              z-index: 1;
            }
          `}
        </style>
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={event => `${event.company}: ${event.notes || ''}`}
          views={['month', 'week', 'day']}
          view={selectedView}
          onView={setSelectedView}
          onEventDrop={moveEvent}
          draggableAccessor={event => event.type === 'upcoming'}
          resizable={false}
          components={{
            toolbar: CustomToolbar
          }}
          selectable
          popup
          step={60}
          defaultDate={new Date()}
          longPressThreshold={250}
          onSelectEvent={handleEventClick}
        />
      </div>
      <NextContactModal
        show={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        methods={methods}
        nextContactData={nextContactData}
        setNextContactData={setNextContactData}
        onSubmit={handleRescheduleSubmit}
      />
    </div>
  );
};

export default CalendarView;