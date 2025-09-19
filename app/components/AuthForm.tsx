'use client';

import { useState } from 'react';

export default function AuthForm({ onLogin }: { onLogin: (username: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async () => {
    const url = `http://127.0.0.1:8000/api/auth/${isRegister ? 'register' : 'login'}/`;
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    
    if (!isRegister) {
      localStorage.setItem('accessToken', data.access); 
      onLogin(username); 
      alert(data.message ?? 'Success!');}
     else {
    alert(data.error ?? JSON.stringify(data));
  }
    
  };

  return (

    <div className="flex flex-col gap-2">
    <h1 className="text-2xl font-semibold">Memory Match Game</h1>

      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        className="p-2 rounded border text-black"
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        className="p-2 rounded border text-black"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isRegister ? 'Register' : 'Login'}
      </button>
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="text-sm underline mt-1"
      >
        {isRegister ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </div>
  );
}