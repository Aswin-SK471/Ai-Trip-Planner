import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIGNUP REQUEST STARTED ===');
    
    const body = await request.json();
    console.log('Signup body received:', { email: body.email, passwordLength: body.password?.length });
    
    const { email, password } = body;

    if (!email || !password) {
      console.warn('Missing email or password. Email exists:', !!email, 'Password exists:', !!password);
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log('Checking if user already exists:', email);
    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    console.log('Existing users query result:', existingUsers);

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      console.warn('User already exists:', email);
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 409 }
      );
    }

    console.log('Hashing password...');
    // Hash password
    const hashedPassword = await hashPassword(password);
    console.log('Password hashed successfully');

    console.log('Inserting user into database:', email);
    // Insert user
    const [result] = await db.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    console.log('Insert result:', result);

    // Get inserted user ID
    const insertId = (result as any).insertId;
    console.log('User created with ID:', insertId);

    console.log('Creating JWT token...');
    // Create JWT token
    const token = createToken({ id: insertId, email });
    console.log('Token created successfully');

    const { setAuthCookie } = await import('@/lib/auth');
    await setAuthCookie(token);

    console.log('=== SIGNUP COMPLETED SUCCESSFULLY ===');
    return NextResponse.json({
      success: true,
      token,
      user: { id: insertId, email }
    });

  } catch (error) {
    console.error('=== SIGNUP ERROR ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
