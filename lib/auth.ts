import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Rate limiting — simple in-memory store
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record) return { allowed: true }

  // Reset if lockout period passed
  if (now - record.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(ip)
    return { allowed: true }
  }

  if (record.count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - record.lastAttempt)) / 1000 / 60)
    return { allowed: false, remainingTime }
  }

  return { allowed: true }
}

function recordFailedAttempt(ip: string) {
  const now = Date.now()
  const record = loginAttempts.get(ip)

  if (!record) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
  } else {
    loginAttempts.set(ip, { count: record.count + 1, lastAttempt: now })
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip)
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Get IP for rate limiting
        const ip =
          (req?.headers?.['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
          (req?.headers?.['x-real-ip'] as string) ||
          'unknown'

        // Check rate limit
        const rateCheck = checkRateLimit(ip)
        if (!rateCheck.allowed) {
          throw new Error(`Too many attempts. Try again in ${rateCheck.remainingTime} minutes.`)
        }

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
          throw new Error('Server configuration error')
        }

        // Email check (case-insensitive)
        if (credentials.email.toLowerCase() !== adminEmail.toLowerCase()) {
          recordFailedAttempt(ip)
          throw new Error('Invalid credentials')
        }

        // Password check — support both plain and bcrypt hashed
        let passwordValid = false

        if (adminPassword.startsWith('$2')) {
          // Bcrypt hash
          passwordValid = await bcrypt.compare(credentials.password, adminPassword)
        } else {
          // Plain text (dev only)
          passwordValid = credentials.password === adminPassword
        }

        if (!passwordValid) {
          recordFailedAttempt(ip)
          throw new Error('Invalid credentials')
        }

        // Success — clear rate limit
        clearAttempts(ip)

        return {
          id: '1',
          email: adminEmail,
          name: 'Admin',
          role: 'admin',
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours (not 30 days)
  },
  jwt: {
    maxAge: 8 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as { role?: string }).role = token.role as string
        ;(session.user as { id?: string }).id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}
