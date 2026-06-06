import type { NextApiRequest, NextApiResponse } from 'next'
import { collegeService } from '@/services/college.service'
import { handleError } from '@/lib/handleError'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const [states, types] = await Promise.all([
      collegeService.getStates(),
      collegeService.getTypes(),
    ])
    return res.status(200).json({ states, types })
  } catch (err) {
    return handleError(err, res)
  }
}
