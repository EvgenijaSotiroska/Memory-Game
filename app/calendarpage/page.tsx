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
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');


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
    <div className="p-6 flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>

    
      <select
        value={view}
        onChange={(e) => setView(e.target.value as  "month" | "year")}
        className="border rounded p-2 mb-4 text-black"
      >
        <option className="text-black" value="month">Month</option>
        <option className="text-black" value="year">Year</option>
      </select>

    
      <div className="calendar-container w-full max-w-4xl">
      <Calendar
        className="react-calendar-custom"
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
      </div>

      <AddEventForm
        date={date}
        onSave={(newEvent) => {
        setEvents((prev) => [...prev, newEvent]);
      }}
      onCancel={() => {}}
      />
    </div>

    
  );
}
