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

      {/* Flex row: calendar (with form) on left, events on right */}
      <div className="flex gap-8 items-start">
        {/* Left side: calendar + form */}
        <div className="flex flex-col flex-[2]"> {/* wider calendar */}
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

          {/* Form stays under calendar */}
          <AddEventForm
            date={date}
            onSave={(newEvent) => {
              setEvents((prev) => [...prev, newEvent]);
            }}
            onCancel={() => {}}
          />
        </div>

        {/* Right side: events list */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">
            Events on {date.toDateString()}
          </h2>
          {events.length > 0 ? (
            <ul className="space-y-3">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="p-3 border rounded bg-gray-100 text-black"
                >
                  <h3 className="font-bold">{event.title}</h3>
                  <p>{event.description}</p>
                  <p className="text-sm text-gray-600">
                    Attendees:{" "}
                    {event.attendees && event.attendees.length > 0
                      ? event.attendees.join(", ")
                      : "None"}
                  </p>
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
