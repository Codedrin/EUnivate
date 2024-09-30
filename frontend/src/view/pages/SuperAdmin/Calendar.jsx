import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';
import CustomToolbar from './Library/CustomToolbar';
import CustomDayHeader from './Library/CustomDayHeader'; // Import your custom day header component

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }), // Start the week on Sunday
    getDay,
    locales,
});

const Calendar = ({ tasks }) => {
    const [selectedTask, setSelectedTask] = useState(null);

    const events = tasks.map(task => {
        const startDate = new Date(task.startDate);
        const endDate = new Date(task.dueDate);

        return {
            title: task.taskName,
            start: startDate,
            end: endDate,
            allDay: true,
            task,
        };
    });

    const stringToColor = (string) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `#${((hash >> 24) & 0xff).toString(16).padStart(2, '0')}${((hash >> 16) & 0xff).toString(16).padStart(2, '0')}${((hash >> 8) & 0xff).toString(16).padStart(2, '0')}`;
        return color;
    };

    const eventPropGetter = (event) => {
        const backgroundColor = stringToColor(event.task.taskName);
        return { style: { backgroundColor, color: 'white', borderRadius: '8px', border: 'none', padding: '4px' } };
    };

    const handleEventClick = (event) => {
        setSelectedTask(event.task);
    };

    const closeModal = () => {
        setSelectedTask(null);
    };

    const TaskEvent = ({ event }) => (
        <div className="flex items-center p-1">
            <div className="mr-2">
                {event.task.assignee && event.task.assignee.length > 0 ? (
                    <img src={event.task.assignee[0].profilePicture} alt="Assignee Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md" />
                ) : (
                    <img src="/path/to/default/avatar.png" alt="Default Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md" />
                )}
            </div>
            <div className="font-semibold">{event.title}</div>
        </div>
    );

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 relative">
            {/* Apply fixed height and scroll behavior on mobile */}
            <div className="overflow-auto md:overflow-visible" style={{ height: '500px' }}>
                <BigCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    style={{ minHeight: '500px' }}
                    eventPropGetter={eventPropGetter}
                    components={{
                        event: TaskEvent,
                        toolbar: (props) => <CustomToolbar {...props} view={props.view} />,
                        day: {
                            header: (props) => <CustomDayHeader {...props} tasks={tasks} />, // Pass tasks to the header
                        },
                    }}
                    className="bg-gray-50 p-4 rounded-lg"
                    onSelectEvent={handleEventClick}
                />
            </div>

            {selectedTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white shadow-lg p-6 rounded-lg border border-gray-300 w-96">
                        <h2 className="text-lg font-semibold mb-4">{selectedTask.taskName}</h2>
                        <p><strong>Start Date:</strong> {format(new Date(selectedTask.startDate), 'PPP')}</p>
                        <p><strong>Due Date:</strong> {format(new Date(selectedTask.dueDate), 'PPP')}</p>
                        <div className="text-right">
                            <button
                                className="mt-4 bg-red-700 text-white py-2 px-4 rounded"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
