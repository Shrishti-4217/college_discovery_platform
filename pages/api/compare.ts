import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { compareService } from '@/services/compare.service'
import { handleError } from '@/lib/handleError'

const schema = z.object({
  ids: z
    .array(z.string().cuid('Invalid college ID'))
    .min(2, 'Provide at least 2 colleges')
    .max(3, 'Provide at most 3 colleges'),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { ids } = schema.parse(req.body)
    const result = await compareService.compare(ids)
    return res.status(200).json(result)
  } catch (err) {
    return handleError(err, res)
  }
}
