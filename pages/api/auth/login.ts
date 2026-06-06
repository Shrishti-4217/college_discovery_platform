import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { authService } from '@/services/auth.service'
import { handleError } from '@/lib/handleError'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { email, password } = schema.parse(req.body)
    const result = await authService.login(email, password)
    return res.status(200).json(result)
  } catch (err) {
    return handleError(err, res)
  }
}
