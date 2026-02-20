---
name: custom-domains
description: Custom domains, SSL certificates, DNS configuration, and redirects.
version: 4.0.0
---

# Custom Domains - Domain Configuration

> Connect your own domain with automatic SSL and global CDN.

---

## MUST

### 1. Add Domain in Dashboard

**✅ CORRECT:**
```
Dashboard → Project → Settings → Domains
→ Add Domain → Enter domain → Verify
```

### 2. Configure DNS Records

**✅ CORRECT:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Enable HTTPS (Automatic)

**✅ CORRECT:**
```
Vercel automatically provisions SSL certificates
via Let's Encrypt
```

---

## FORBIDDEN

### 1. Never Use IP Addresses in Production

**❌ FORBIDDEN:**
```
http://76.76.21.21
```

**✅ CORRECT:**
```
https://example.com
```

### 2. Never Forget to Renew Domain

**❌ FORBIDDEN:**
```
Domain expired → Site down
```

**✅ CORRECT:**
```
Enable auto-renew with registrar
```

---

## WHY

### Domain Benefits

| Feature | Benefit |
|---------|---------|
| Custom domain | Professional branding |
| SSL | Security & SEO |
| CDN | Global performance |
| Redirects | URL management |

---

## EXAMPLES

### Adding a Domain

```bash
# Via CLI
vercel domains add example.com

# Or via Dashboard
# Project → Settings → Domains → Add
```

### WWW Redirect

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "www.example.com" }],
      "destination": "https://example.com/:path*",
      "permanent": true
    }
  ]
}
```

### Apex to WWW

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "example.com" }],
      "destination": "https://www.example.com/:path*",
      "permanent": true
    }
  ]
}
```

### Multiple Domains

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "app.example.com" }],
      "destination": "/app/:path*"
    },
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "blog.example.com" }],
      "destination": "/blog/:path*"
    }
  ]
}
```

---

## Related Assets

- [Domain Config Template](../assets/templates/domain-config.json)
