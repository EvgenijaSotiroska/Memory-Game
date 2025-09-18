import { NextRequest, NextResponse } from 'next/server';
import { users, User } from '../users';

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const newUser: User = { username, password };
  users.push(newUser);

  return NextResponse.json({ message: 'User registered successfully' });
}