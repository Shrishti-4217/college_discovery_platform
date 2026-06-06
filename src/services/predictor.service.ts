import { prisma } from '@/lib/prisma'

export interface PredictParams {
  exam: string
  rank: number
  category: string
  limit?: number
}

export const predictorService = {
  async predict({ exam, rank, category, limit = 20 }: PredictParams) {
    const cutoffs = await prisma.cutoff.findMany({
      where: {
        exam: exam.toUpperCase(),
        category: category.toLowerCase(),
        rankFrom: { lte: rank },
        rankTo: { gte: rank },
        year: 2023,
      },
      orderBy: { rankFrom: 'asc' }, // closer to rank = better match
      take: limit,
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
    })

    return {
      params: { exam, rank, category },
      total: cutoffs.length,
      colleges: cutoffs.map(c => ({
        ...c.college,
        cutoff: {
          rankFrom: c.rankFrom,
          rankTo: c.rankTo,
          exam: c.exam,
          category: c.category,
          year: c.year,
        },
      })),
    }
  },

  getSupportedExams() {
    return ['JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'CAT', 'JAM', 'CUET']
  },

  getSupportedCategories() {
    return ['general', 'obc', 'sc', 'st', 'ews']
  },
}
