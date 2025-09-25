"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AddEventForm from "../components/AddEventForm"; 

type EventType = {
  id: number;
  user: string; 
  date: string;
  title: string;
  description: string;
  attendees: string[];
};



export default function CalendarPage() {
  const [view, setView] = useState< "month" | "year">("month");
  const [date, setDate] = useState<Date>(new Date()); 
  const [events, setEvents] = useState<EventType[]>([]); 

  useEffect(() => {
    async function fetchEvents() {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
  
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/auth/events/?date=${dateStr}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchEvents();
  }, [date]);

  const handleApply = async (eventId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;
  
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/auth/events/${eventId}/apply/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) {
        console.error("Failed to apply to event");
        return;
      }
  
      const updatedEvent = await res.json();
      setEvents((prev) =>
        prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e))
      );
    } catch (err) {
      console.error(err);
    }
  };
  

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>

      <select
        value={view}
        onChange={(e) => setView(e.target.value as "month" | "year")}
        className="border rounded p-2 mb-4 text-black"
      >
        <option className="text-black" value="month">Month</option>
        <option className="text-black" value="year">Year</option>
      </select>

     
      <div className="flex gap-8 items-start">
        <div className="flex flex-col flex-[2]"> 
          <Calendar
            className="react-calendar-custom mb-4"
            onChange={(val) => {
              if (val instanceof Date) {
                setDate(val);
              }
            }}
            value={date}
            view={view}
            showNeighboringMonth={false}
            onClickMonth={(month: Date) => {
              setDate(month);
              setView("month");
            }}
          />

          <AddEventForm
            date={date}
            onSave={(newEvent) => {
              setEvents((prev) => [...prev, newEvent]);
            }}
            onCancel={() => {}}
          />
        </div>

        
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">
            Events on {date.toDateString()}
          </h2>
          {events.length > 0 ? (
            <ul className="space-y-3">
              {events.map((event) => (
                <li
                key={event.id}
                className="p-3 border rounded bg-gray-100 text-black flex justify-between items-start"
              >
                
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <p>{event.description}</p>
                  <p className="text-sm text-gray-600">
                    Attendees:{" "}
                    {event.attendees && event.attendees.length > 0
                      ? event.attendees.join(", ")
                      : "None"}
                  </p>
                </div>
              
                <button
                  onClick={() => handleApply(event.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 mt-4"
                >
                  Apply
                </button>
              </li>
              ))}
            </ul>
          ) : (
            <p>No events on this date.</p>
          )}
        </div>
      </div>
    </div>
  );
}
