import type { NextApiRequest, NextApiResponse } from 'next'
import { collegeService } from '@/services/college.service'
import { handleError } from '@/lib/handleError'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { id } = req.query
    if (typeof id !== 'string') return res.status(400).json({ error: 'Invalid ID' })
    const college = await collegeService.findById(id)
    return res.status(200).json(college)
  } catch (err) {
    return handleError(err, res)
  }
}
