import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { NotFoundError } from '@/lib/errors'

export interface SearchParams {
  q?: string
  state?: string
  type?: string
  minRating?: number
  maxFees?: number
  sortBy?: 'rating' | 'fees' | 'name'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export const collegeService = {
  async search(params: SearchParams) {
    const {
      q,
      state,
      type,
      minRating,
      maxFees,
      sortBy = 'rating',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
    } = params

    const where: Prisma.CollegeWhereInput = {}

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { state: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }
    if (state) where.state = { equals: state, mode: 'insensitive' }
    if (type) where.type = { equals: type, mode: 'insensitive' }
    if (minRating !== undefined) where.rating = { gte: minRating }
    if (maxFees !== undefined) where.fees = { lte: maxFees }

    const skip = (page - 1) * limit

    const [data, total] = await prisma.$transaction([
      prisma.college.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          location: true,
          state: true,
          type: true,
          fees: true,
          rating: true,
          established: true,
          description: true,
          _count: { select: { courses: true } },
        },
      }),
      prisma.college.count({ where }),
    ])

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    }
  },

  async findById(id: string) {
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: { orderBy: { fees: 'asc' } },
        cutoffs: { orderBy: [{ year: 'desc' }, { rankFrom: 'asc' }] },
      },
    })
    if (!college) throw new NotFoundError(`College with id "${id}" not found`)
    return college
  },

  async getStates() {
    const states = await prisma.college.findMany({
      select: { state: true },
      distinct: ['state'],
      orderBy: { state: 'asc' },
    })
    return states.map(s => s.state)
  },

  async getTypes() {
    const types = await prisma.college.findMany({
      select: { type: true },
      distinct: ['type'],
      orderBy: { type: 'asc' },
    })
    return types.map(t => t.type)
  },
}
