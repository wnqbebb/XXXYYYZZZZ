---
name: security
description: Security vulnerability detection and prevention patterns. Load during Pillar 3 of code-review to identify and fix security issues.
metadata:
  tags: security, xss, csrf, sql-injection, authentication, authorization, encryption
---

# Security Review

**Security is not a feature, it is a foundation.**

---

## Input Validation & Sanitization

### XSS Prevention

```typescript
// WRONG: Rendering user input directly
function Comment({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />  // XSS!
}

// CORRECT: Escape output
function Comment({ text }) {
  return <div>{text}</div>  // React auto-escapes
}

// WRONG: URL without validation
<a href={userInput}>Link</a>  // javascript:alert('xss')

// CORRECT: Validate URLs
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}
```

### SQL/NoSQL Injection

```typescript
// WRONG: String concatenation
const query = `SELECT * FROM users WHERE id = '${userId}'`
// Input: "'; DROP TABLE users; --"

// CORRECT: Parameterized queries
const query = 'SELECT * FROM users WHERE id = ?'
db.query(query, [userId])

// WRONG: MongoDB injection
db.users.find({ username: req.body.username })
// Input: { "$ne": null } → returns all users

// CORRECT: Schema validation + sanitization
const username = z.string().min(3).parse(req.body.username)
db.users.find({ username })
```

---

## Authentication & Authorization

### JWT Security

```typescript
// WRONG: Client-side token verification
function Dashboard() {
  const token = localStorage.getItem('token')
  const user = JSON.parse(atob(token.split('.')[1]))  // Don't trust client!
  
// CORRECT: Server-side verification
// Client: Store token (httpOnly cookie preferred)
// Server: Verify with secret on every request

async function getUser(req) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw new UnauthorizedError()
  }
}
```

### Route Protection

```typescript
// WRONG: Client-side only protection
function AdminPage() {
  const { user } = useAuth()
  if (!user?.isAdmin) return <div>Access Denied</div>  // Bypassable!
  return <AdminPanel />
}

// CORRECT: Server-side enforcement
// Middleware
function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}

// Route
app.get('/api/admin/data', requireAdmin, getAdminData)
```

---

## Data Protection

### Environment Variables

```typescript
// WRONG: Hardcoded secrets
const API_KEY = 'sk-live-1234567890abcdef'

// CORRECT: Environment variables
const API_KEY = process.env.API_KEY
if (!API_KEY) throw new Error('API_KEY not configured')

// .env file (gitignored!)
API_KEY=sk-live-1234567890abcdef

// .env.example (committed)
API_KEY=your_api_key_here
```

### Sensitive Data Handling

```typescript
// WRONG: Logging sensitive data
console.log('User login:', { email, password })  // Never!

// CORRECT: Sanitize logs
console.log('User login:', { userId: user.id, timestamp: new Date() })

// WRONG: Storing passwords in plain text
await db.users.create({ email, password })

// CORRECT: Hash passwords
import bcrypt from 'bcrypt'
const hash = await bcrypt.hash(password, 12)
await db.users.create({ email, password: hash })
```

---

## Security Checklist

- [ ] All user input is validated/sanitized
- [ ] No dangerous HTML rendering without sanitization
- [ ] SQL queries use parameterized statements
- [ ] Authentication is server-side verified
- [ ] Authorization checks on every protected route
- [ ] Secrets in environment variables only
- [ ] Passwords hashed with bcrypt/argon2
- [ ] No sensitive data in logs
- [ ] HTTPS enforced
- [ ] Security headers set (CSP, HSTS, etc.)
