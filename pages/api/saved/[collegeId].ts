import type { NextApiResponse } from 'next'
import { withAuth, AuthedRequest } from '@/middleware/auth'
import { savedService } from '@/services/saved.service'
import { handleError } from '@/lib/handleError'

export default withAuth(async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { collegeId } = req.query
    if (typeof collegeId !== 'string') {
      return res.status(400).json({ error: 'Invalid college ID' })
    }
    const result = await savedService.unsave(req.user.userId, collegeId)
    return res.status(200).json(result)
  } catch (err) {
    return handleError(err, res)
  }
})
