"use client";
import { useState } from "react";

type AddEventFormProps = {
    date: Date;
    onSave: (newEvent: EventType) => void;
    onCancel: () => void;
  };

  type EventType = {
    id: number;
    user: string;
    date: string;
    title: string;
    description: string;
    attendees: string[];
  };

  
export default function AddEventForm({ date, onSave, onCancel }: AddEventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/events/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          date: date.toISOString().split("T")[0],
        }),
      });

      if (res.ok) {
        const newEvent = await res.json();
        onSave(newEvent);
        setTitle("");
        setDescription("");
      } else {
        console.error("Failed to add event");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded bg-gray-800 text-white">
      <h3 className="text-lg font-bold mb-2">Add Event for {date.toDateString()}</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 p-2 w-full text-black rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-2 p-2 w-full text-black rounded"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
        >
          Save Event
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
