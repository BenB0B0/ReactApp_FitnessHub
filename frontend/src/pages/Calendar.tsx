import { useState } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { parse, format, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useWorkout } from "../context/WorkoutContext";
import { enUS } from 'date-fns/locale/en-US';
import WorkoutForm from "../components/WorkoutForm";
import { Workout } from '../types/workout';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});


const CalendarView = () => {
  const { workouts, workoutOptions, setIsFormVisible, isFormVisible } = useWorkout();
  const [view, setView] = useState<"month" | "week" | "work_week" | "day" | "agenda">("month");
  const [date, setDate] = useState(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>(undefined);
  
  const toLocalMidnight = (dateStr: string) => {
    const parsed = new Date(dateStr);
    return new Date(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate()
    );
  };
  
  const events = workouts.map(w => ({
    title: w.name,
    start: toLocalMidnight(w.date),
    end: toLocalMidnight(w.date),
    allDay: true,
    resource: w,
  }));

  const eventPropGetter = (event:any) => {
    return {
      style: {
        backgroundColor: workoutOptions.find(option => option.value ===  event.resource?.name)?.cardio ? "#ffc107" : "#0d6efd",
        color: workoutOptions.find(option => option.value ===  event.resource?.name)?.cardio ? "black" : "white",
      },
    };
  };

  return (
    <>
    {isFormVisible && <WorkoutForm initialFormData={selectedWorkout} />}
    <div style={{ height: '80vh', padding: '1rem' }}>
      <Calendar
        localizer={localizer}
        events={events}
        eventPropGetter={eventPropGetter}
        startAccessor="start"
        endAccessor="end"
        views={["month"]}
        view={view}
        onView={(newView) => setView(newView)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        style={{ height: '100%' }}
        onSelectEvent={(event) => {
          setSelectedWorkout(event.resource); 
          setIsFormVisible(true);
        }}
        onSelectSlot={() => {
          setSelectedWorkout(undefined);
          setIsFormVisible(true);
        }}
        selectable
        popup
        dayPropGetter={() => ({
          className: "hover-calendar"
        })}
      />
    </div>
    </>
  );
};


export default CalendarView;
