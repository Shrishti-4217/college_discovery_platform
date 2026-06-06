import type { NextApiResponse } from 'next'
import { z } from 'zod'
import { withAuth, AuthedRequest } from '@/middleware/auth'
import { savedService } from '@/services/saved.service'
import { handleError } from '@/lib/handleError'

const saveSchema = z.object({
  collegeId: z.string().cuid('Invalid college ID'),
})

export default withAuth(async (req: AuthedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const items = await savedService.listForUser(req.user.userId)
      return res.status(200).json({ data: items, total: items.length })
    } catch (err) {
      return handleError(err, res)
    }
  }

  if (req.method === 'POST') {
    try {
      const { collegeId } = saveSchema.parse(req.body)
      const result = await savedService.save(req.user.userId, collegeId)
      return res.status(200).json(result)
    } catch (err) {
      return handleError(err, res)
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
})
