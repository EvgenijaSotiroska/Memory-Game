'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from './components/AuthForm';

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current logged-in user from backend
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/auth/get_current_user/', {
          credentials: 'include', // include session cookies
        });
        if (!res.ok) throw new Error('Not logged in');
        const data = await res.json();
        setUser(data.username); // backend should return { username: "..." }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <main className="grid place-items-center min-h-screen bg-gray-950 text-white">
        <div className="p-6 rounded-xl bg-gray-900 text-white">
          <AuthForm onLogin={setUser} />
        </div>
      </main>
    );
  }

  function handleStartGame() {
    router.push('/gamepage');
  }

  return (
    <main className="grid place-items-center min-h-screen bg-gray-950 text-white">
      <div className="p-6 rounded-xl bg-gray-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user}!</h1>
        <button
          onClick={handleStartGame}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          Start Game
        </button>
        <button onClick={() => setUser(null)} className="ml-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600" > Logout </button>
      </div>
    </main>
  );
}
