"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  const [view, setView] = useState< "month" | "year">("month");
  const [date, setDate] = useState<Date>(new Date()); 

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

      
      <p className="mt-4">Selected date: {date.toDateString()}</p>
    </div>
  );
}
