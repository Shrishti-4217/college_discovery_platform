import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { collegeService } from '@/services/college.service'
import { handleError } from '@/lib/handleError'

const querySchema = z.object({
  q: z.string().optional(),
  state: z.string().optional(),
  type: z.enum(['engineering', 'medical', 'management', 'science', 'arts']).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['rating', 'fees', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const params = querySchema.parse(req.query)
    const result = await collegeService.search(params)
    return res.status(200).json(result)
  } catch (err) {
    return handleError(err, res)
  }
}
