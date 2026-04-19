import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { comparePassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const [users] = await db.execute(
      'SELECT id, email, password FROM users WHERE email = ?',
      [email]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = users[0] as any;

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = createToken({ id: user.id, email: user.email });

    const { setAuthCookie } = await import('@/lib/auth');
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
