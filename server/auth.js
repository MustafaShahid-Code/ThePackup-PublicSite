import crypto from 'node:crypto'
import { readSecretFile, writeSecretFile } from './store.js'

const COOKIE = 'pu_admin'
const MAX_AGE = 60 * 60 * 8 // 8 hours

const hash = (pw, salt) => crypto.scryptSync(pw, salt, 64).toString('hex')

let auth = readSecretFile('auth.json')
if (!auth) {
  const pw = process.env.ADMIN_PASSWORD
  if (!pw || pw.length < 10) {
    console.error('\n[cms] First start: set ADMIN_PASSWORD (min 10 chars) in your environment, then restart.\n')
    process.exit(1)
  }
  const salt = crypto.randomBytes(16).toString('hex')
  auth = {
    email: (process.env.ADMIN_EMAIL || 'admin@thepackup.local').toLowerCase(),
    salt,
    hash: hash(pw, salt),
    secret: crypto.randomBytes(32).toString('hex'),
  }
  writeSecretFile('auth.json', auth)
  console.log(`[cms] Admin account created for ${auth.email}. You can remove ADMIN_PASSWORD from the environment now.`)
}
if (process.env.SESSION_SECRET) auth.secret = process.env.SESSION_SECRET

const safeEq = (a, b) => {
  const x = Buffer.from(a), y = Buffer.from(b)
  return x.length === y.length && crypto.timingSafeEqual(x, y)
}

const sign = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return body + '.' + crypto.createHmac('sha256', auth.secret).update(body).digest('base64url')
}
const verify = (token) => {
  if (!token || !token.includes('.')) return null
  const [body, sig] = token.split('.')
  const expect = crypto.createHmac('sha256', auth.secret).update(body).digest('base64url')
  if (!safeEq(sig, expect)) return null
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString())
    return p.exp > Date.now() / 1000 ? p : null
  } catch {
    return null
  }
}

const parseCookies = (h = '') => Object.fromEntries(h.split(';').map((c) => c.trim().split('=')).filter((p) => p[0]).map(([k, ...v]) => [k, v.join('=')]))

// naive in-memory login throttle: 8 attempts / 15 min per IP
const attempts = new Map()
export function throttled(ip) {
  const now = Date.now()
  const a = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60 * 1000)
  attempts.set(ip, a)
  return a.length >= 8
}
export const noteFail = (ip) => attempts.set(ip, [...(attempts.get(ip) || []), Date.now()])

export function login(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') return false
  return safeEq(email.toLowerCase(), auth.email) && safeEq(hash(password, auth.salt), auth.hash)
}

export function setSession(req, res) {
  const token = sign({ sub: auth.email, exp: Math.floor(Date.now() / 1000) + MAX_AGE })
  const secure = req.secure ? '; Secure' : '' // Secure only over HTTPS (works on http://localhost too)
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}${secure}`)
}
export const clearSession = (res) => res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`)
export const currentUser = (req) => verify(parseCookies(req.headers.cookie)[COOKIE])?.sub ?? null

/** Guard for admin routes. Mutations also need a custom header (CSRF defence on top of SameSite=Strict). */
export function requireAdmin(req, res, next) {
  if (!currentUser(req)) return res.status(401).json({ error: 'Not signed in' })
  if (req.method !== 'GET' && req.headers['x-requested-with'] !== 'pack-up-admin') return res.status(403).json({ error: 'Bad request' })
  next()
}

export function changePassword(current, next) {
  if (!login(auth.email, current)) return 'Current password is wrong'
  if (typeof next !== 'string' || next.length < 10) return 'New password must be at least 10 characters'
  auth.salt = crypto.randomBytes(16).toString('hex')
  auth.hash = hash(next, auth.salt)
  writeSecretFile('auth.json', auth)
  return null
}
export const adminEmail = () => auth.email
