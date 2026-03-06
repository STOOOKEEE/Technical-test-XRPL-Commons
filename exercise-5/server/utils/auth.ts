import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { IAuthPayload } from '~~/types'

import { BCRYPT_SALT_ROUNDS } from '~~/shared/constants'

export function signToken(email: string): string {
  const config = useRuntimeConfig()
  return jwt.sign({ email }, config.jwtSecret, {
    expiresIn: Number(config.jwtExpiry),
  })
}

export function verifyToken(token: string): IAuthPayload {
  const config = useRuntimeConfig()
  return jwt.verify(token, config.jwtSecret) as IAuthPayload
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
