import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { verifyToken, JwtPayload } from '@/lib/jwt'

export interface AuthedRequest extends NextApiRequest {
  user: JwtPayload
}

type AuthedHandler = (req: AuthedRequest, res: NextApiResponse) => Promise<void> | void

export function withAuth(handler: AuthedHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' })
    }

    const token = authHeader.slice(7)
    try {
      const payload = verifyToken(token)
      ;(req as AuthedRequest).user = payload
      return handler(req as AuthedRequest, res)
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
  }
}
