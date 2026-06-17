import jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_EXPIRE = (process.env.NEXT_PUBLIC_JWT_EXPIRE || '7d') as SignOptions['expiresIn']

export interface JWTPayload {
  userId: string
  email: string
  role: 'admin' | 'user'
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: JWT_EXPIRE,
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload
  } catch {
    return null
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required')
  }

  return secret
}

export async function getTokenFromCookies(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  return token?.value || null
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getTokenFromCookies()
  if (!token) return null
  return verifyToken(token)
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}
