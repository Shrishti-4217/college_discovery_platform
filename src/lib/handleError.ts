import { NextApiResponse } from 'next'
import { ZodError } from 'zod'
import { NotFoundError, ConflictError, UnauthorizedError, ValidationError } from './errors'

export function handleError(err: unknown, res: NextApiResponse) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
    })
  }
  if (err instanceof ValidationError) return res.status(400).json({ error: err.message })
  if (err instanceof UnauthorizedError) return res.status(401).json({ error: err.message })
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message })
  if (err instanceof ConflictError) return res.status(409).json({ error: err.message })

  console.error('[Unhandled error]', err)
  return res.status(500).json({ error: 'Internal server error' })
}
