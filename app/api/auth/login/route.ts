import { NextRequest, NextResponse } from 'next/server';
import { users } from '../users';

export async function POST(req: NextRequest) {
    const { username, password } = await req.json();
  
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  
    return NextResponse.json({ message: 'Login successful', user: { username: user.username } });
  }