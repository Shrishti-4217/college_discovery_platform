import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export const savedService = {
  async save(userId: string, collegeId: string) {
    // Verify college exists before saving
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      select: { id: true, name: true },
    })
    if (!college) throw new NotFoundError(`College not found`)

    // Upsert handles duplicate saves idempotently — no 409 needed
    await prisma.savedItem.upsert({
      where: { userId_collegeId: { userId, collegeId } },
      create: { userId, collegeId },
      update: {},
    })

    return { saved: true, college }
  },

  async unsave(userId: string, collegeId: string) {
    const item = await prisma.savedItem.findUnique({
      where: { userId_collegeId: { userId, collegeId } },
    })
    if (!item) throw new NotFoundError('Saved item not found')

    await prisma.savedItem.delete({
      where: { userId_collegeId: { userId, collegeId } },
    })
    return { saved: false }
  },

  async listForUser(userId: string) {
    const items = await prisma.savedItem.findMany({
      where: { userId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            state: true,
            type: true,
            fees: true,
            rating: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return items.map(item => ({
      savedAt: item.createdAt,
      ...item.college,
    }))
  },

  async isSaved(userId: string, collegeId: string): Promise<boolean> {
    const item = await prisma.savedItem.findUnique({
      where: { userId_collegeId: { userId, collegeId } },
      select: { id: true },
    })
    return !!item
  },
}
