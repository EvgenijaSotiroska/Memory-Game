'use client';

import { useEffect, useState } from "react";

type LeaderboardRow = {
  user__username: string;
  total_score: number;
};

export default function Scores() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [level, setLevel] = useState("");
  const [period, setPeriod] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (level) params.append("level", level);
      if (period && period !== "all") params.append("period", period);

      const res = await fetch(`http://127.0.0.1:8000/api/auth/leaderboard/?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("Leaderboard data:", data); 
      setLeaderboard(data);
    } catch (err: any) {
      console.error("Failed to fetch leaderboard:", err);
      setError("Failed to load leaderboard. Please try again.");
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  function exportCSV() {
    if (leaderboard.length === 0) return;
  
  
    const headers = ["Rank", "Player", "Score"];

    const rows = leaderboard.map((row, idx) => [
      idx + 1,
      `"${row.user__username}"`,
      row.total_score,
    ]);
  
  const csvContent = [headers, ...rows].map((r) => r.join(";")).join("\r\n");

  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "leaderboard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  useEffect(() => {
    fetchLeaderboard();
  }, [level, period]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Leaderboard</h2>
  
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-medium text-white">Level:</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-md border border-gray-400 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
        </div>
  
        <div className="flex items-center gap-2">
          <label className="font-medium text-white">Period:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-md border border-gray-400 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Time</option>
            <option value="monthly">This Month</option>
            <option value="yearly">This Year</option>
          </select>
        </div>
      </div>
  
      
      {loading && <p className="text-gray-800 text-center">Loading leaderboard...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
  
      
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-blue-400">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-900 border-b">Rank</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900 border-b">Player</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-900 border-b">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-blue-100" : "bg-blue-300"}
                  >
                    <td className="px-4 py-3 border-b text-gray-900">{idx + 1}</td>
                    <td className="px-4 py-3 border-b text-gray-900">{row.user__username}</td>
                    <td className="px-4 py-3 border-b text-gray-900">{row.total_score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-4 py-3 text-center text-gray-900"
                    colSpan={3}
                  >
                    No scores found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <br></br>
              <button
      onClick={exportCSV}
      className="rounded-md bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-500 transition"
    >
      Export CSV
    </button>
        </div>
      )}
    </div>
  );
  
}
