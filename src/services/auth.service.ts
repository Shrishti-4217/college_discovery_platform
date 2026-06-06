import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/jwt'
import { ConflictError, UnauthorizedError } from '@/lib/errors'

export const authService = {
  async register(email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new ConflictError('Email already registered')

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, password: hashed },
      select: { id: true, email: true, createdAt: true },
    })

    const token = signToken({ userId: user.id, email: user.email })
    return { user, token }
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    // Always run bcrypt compare to prevent timing attacks
    const dummyHash = '$2b$12$invalidhashusedfortimingprotection000000000000000000000'
    const isValid = await bcrypt.compare(password, user?.password ?? dummyHash)

    if (!user || !isValid) throw new UnauthorizedError('Invalid email or password')

    const token = signToken({ userId: user.id, email: user.email })
    return { user: { id: user.id, email: user.email, createdAt: user.createdAt }, token }
  },
}
