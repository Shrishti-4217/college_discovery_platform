import { prisma } from '@/lib/prisma'
import { NotFoundError, ValidationError } from '@/lib/errors'

export const compareService = {
  async compare(ids: string[]) {
    if (ids.length < 2 || ids.length > 3) {
      throw new ValidationError('Provide 2 or 3 college IDs to compare')
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: {
        courses: { orderBy: { fees: 'asc' } },
        cutoffs: {
          where: { year: 2023, category: 'general' },
          orderBy: { rankFrom: 'asc' },
          take: 1,
        },
      },
    })

    // Validate all IDs exist
    const foundIds = new Set(colleges.map(c => c.id))
    const missing = ids.filter(id => !foundIds.has(id))
    if (missing.length > 0) {
      throw new NotFoundError(`Colleges not found: ${missing.join(', ')}`)
    }

    // Return in the same order as requested IDs
    const ordered = ids.map(id => colleges.find(c => c.id === id)!)

    // Build diff — keyed by field for easy frontend rendering
    const diff = {
      colleges: ordered.map(c => ({
        id: c.id,
        name: c.name,
        location: c.location,
        state: c.state,
        type: c.type,
      })),
      fields: {
        fees: ordered.map(c => ({ collegeId: c.id, value: c.fees })),
        rating: ordered.map(c => ({ collegeId: c.id, value: c.rating })),
        established: ordered.map(c => ({ collegeId: c.id, value: c.established ?? 'N/A' })),
        totalCourses: ordered.map(c => ({ collegeId: c.id, value: c.courses.length })),
        topCourse: ordered.map(c => ({
          collegeId: c.id,
          value: c.courses[0]?.name ?? 'N/A',
        })),
        cutoffRank: ordered.map(c => ({
          collegeId: c.id,
          value: c.cutoffs[0] ? `${c.cutoffs[0].rankFrom} – ${c.cutoffs[0].rankTo}` : 'N/A',
        })),
      },
    }

    return diff
  },
}
