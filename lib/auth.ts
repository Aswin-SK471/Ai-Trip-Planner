// @ts-ignore - No types available for bcrypt
import bcrypt from 'bcrypt';
// @ts-ignore - No types available for jsonwebtoken  
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  isGuest?: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error('Password hashing error:', error);
    throw new Error('Failed to hash password');
  }
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

export function createToken(payload: { id: string | number; email: string; name?: string }): string {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }
    // Ensure id is a string
    const normalizedPayload = {
      ...payload,
      id: String(payload.id)
    };
    console.log('Creating token with payload:', normalizedPayload);
    return jwt.sign(normalizedPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
  } catch (error) {
    console.error('Token creation error:', error);
    throw new Error('Failed to create authentication token');
  }
}

export function verifyToken(token: string): { id: string; email: string; name: string } | null {
  try {
    if (!process.env.JWT_SECRET) {
      return null;
    }
    return jwt.verify(token, process.env.JWT_SECRET) as { id: string; email: string; name: string };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
  } catch (error) {
    console.error('Error setting auth cookie:', error);
  }
}

export async function clearAuthCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
  } catch (error) {
    console.error('Error clearing auth cookie:', error);
  }
}

export async function getAuthUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    return verifyToken(token);
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

// Guest mode fallback
export function createGuestUser(): User {
  return {
    id: 'guest',
    email: 'guest@example.com',
    name: 'Guest User'
  };
}

// Mock user storage for MVP
class UserStore {
  private static users: User[] = [
    {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User'
    }
  ];

  public static async findByEmail(email: string): Promise<User | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.users.find(user => user.email === email) || null;
  }

  public static async create(userData: { email: string; name: string; password: string }): Promise<User> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      email: userData.email,
      name: userData.name
    };
    
    this.users.push(newUser);
    return newUser;
  }

  public static async validateCredentials(email: string, password: string): Promise<User | null> {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // For demo: accept any password for demo@example.com
    if (email === 'demo@example.com') {
      return this.users.find(user => user.email === email) || null;
    }
    
    return null;
  }
}

export const userStore = UserStore;
