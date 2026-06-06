import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { predictorService } from '@/services/predictor.service'
import { handleError } from '@/lib/handleError'

const schema = z.object({
  exam: z.enum(['JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'CAT', 'JAM', 'CUET'], {
    errorMap: () => ({
      message: 'exam must be one of: JEE_MAIN, JEE_ADVANCED, NEET, CAT, JAM, CUET',
    }),
  }),
  rank: z.number().int().min(1, 'Rank must be a positive integer'),
  category: z.enum(['general', 'obc', 'sc', 'st', 'ews'], {
    errorMap: () => ({
      message: 'category must be one of: general, obc, sc, st, ews',
    }),
  }),
  limit: z.number().int().min(1).max(50).optional(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Return supported enums so frontends can build dropdowns
    return res.status(200).json({
      exams: predictorService.getSupportedExams(),
      categories: predictorService.getSupportedCategories(),
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const params = schema.parse(req.body)
    const result = await predictorService.predict(params)
    return res.status(200).json(result)
  } catch (err) {
    return handleError(err, res)
  }
}
