import * as jose from 'jose';
import * as crypto from 'node:crypto';

export async function createJWT(algorithm: string, jwtSecret: string, payload: object, expiresIn: number): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
}
