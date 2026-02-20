---
name: React Email Templates
scope: react-email-templates
description: Creating responsive, type-safe email templates using React Email components with Tailwind CSS support
---

# React Email Templates

## Metadata
- **Rule Name**: react-email-templates
- **Scope**: Email Template Components
- **Applies To**: `emails/**/*.tsx`, `components/emails/**/*.tsx`

---

## Directrices Críticas

### MUST

1. **MUST** use `@react-email/components` for all email structure elements
2. **MUST** define TypeScript interfaces for all template props
3. **MUST** include `Preview` component for email preview text
4. **MUST** use `pixelBasedPreset` for consistent Tailwind styling in emails
5. **MUST** provide `PreviewProps` for local development testing
6. **MUST** use inline styles as fallback for email client compatibility
7. **MUST** include `Html` wrapper with `lang` attribute for accessibility

### FORBIDDEN

1. **FORBIDDEN** to use external CSS files or `<style>` tags (use Tailwind or inline styles)
2. **FORBIDDEN** to use JavaScript-dependent features (hover effects, animations)
3. **FORBIDDEN** to use `div` for layout (use `Section`, `Row`, `Column`)
4. **FORBIDDEN** to use relative URLs for images (always use absolute URLs)
5. **FORBIDDEN** to use custom fonts without fallbacks

### WHY

- **React Email Components**: Optimized for email client compatibility (Gmail, Outlook, Apple Mail)
- **TypeScript Interfaces**: Ensures type safety and IDE autocomplete
- **Preview Text**: Critical for email open rates; appears in inbox preview
- **Pixel Preset**: Email clients have limited CSS support; pixel-based units are safest
- **Inline Styles**: Many email clients strip `<style>` tags; inline styles ensure rendering
- **Table Layout**: Email clients have poor flexbox/grid support; table-based layout is most reliable

---

## Ejemplos

### ✅ Correct: Contact Form Email Template

```tsx
// emails/contact-email.tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Tailwind,
  pixelBasedPreset,
} from '@react-email/components';
import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactEmail({
  name,
  email,
  subject,
  message,
}: ContactEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <Section className="bg-blue-600 px-8 py-6">
              <Heading className="text-white text-2xl font-bold m-0">
                New Contact Form Submission
              </Heading>
            </Section>

            {/* Content */}
            <Section className="px-8 py-6">
              <Text className="text-gray-700 text-base mb-4">
                <strong>From:</strong> {name} &lt;{email}&gt;
              </Text>
              
              <Text className="text-gray-700 text-base mb-4">
                <strong>Subject:</strong> {subject}
              </Text>

              <Hr className="border-gray-200 my-4" />

              <Text className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                {message}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-8 py-4">
              <Text className="text-gray-500 text-sm text-center m-0">
                This email was sent from your website contact form
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

// Preview props for development
ContactEmail.PreviewProps = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Question about your services',
  message: `Hi there,

I'm interested in learning more about your services. Could you please provide more information about pricing and availability?

Thanks,
John`,
} satisfies ContactEmailProps;
```

### ✅ Correct: Welcome Email Template

```tsx
// emails/welcome-email.tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Link,
  Tailwind,
  pixelBasedPreset,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  username: string;
  verificationUrl: string;
  supportEmail: string;
}

export default function WelcomeEmail({
  username,
  verificationUrl,
  supportEmail,
}: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to Acme! Please verify your email address</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: '#0070f3',
                'brand-dark': '#0051a8',
              },
            },
          },
        }}
      >
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <Section className="bg-brand px-8 py-8 text-center">
              <Heading className="text-white text-3xl font-bold m-0">
                Welcome to Acme!
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="px-8 py-8">
              <Text className="text-gray-800 text-lg mb-4">
                Hi {username},
              </Text>

              <Text className="text-gray-600 text-base leading-relaxed mb-6">
                Thanks for signing up! We're excited to have you on board. 
                Please verify your email address to get started.
              </Text>

              <Section className="text-center mb-6">
                <Button
                  href={verificationUrl}
                  className="bg-brand text-white px-8 py-4 rounded-lg font-semibold text-base no-underline inline-block"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-gray-500 text-sm text-center">
                Or copy and paste this URL into your browser:
              </Text>
              
              <Text className="text-brand text-sm text-center break-all">
                <Link href={verificationUrl} className="text-brand underline">
                  {verificationUrl}
                </Link>
              </Text>
            </Section>

            <Hr className="border-gray-200 mx-8" />

            {/* Footer */}
            <Section className="px-8 py-6">
              <Text className="text-gray-500 text-sm text-center leading-relaxed">
                If you didn't create an account, you can safely ignore this email.
                <br />
                Questions? Contact us at{' '}
                <Link href={`mailto:${supportEmail}`} className="text-brand underline">
                  {supportEmail}
                </Link>
              </Text>
              
              <Text className="text-gray-400 text-xs text-center mt-4">
                © {new Date().getFullYear()} Acme Inc. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WelcomeEmail.PreviewProps = {
  username: 'John Doe',
  verificationUrl: 'https://acme.com/verify?token=abc123',
  supportEmail: 'support@acme.com',
} satisfies WelcomeEmailProps;
```

### ✅ Correct: Notification Email with Severity Levels

```tsx
// emails/notification-email.tsx
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Tailwind,
  pixelBasedPreset,
} from '@react-email/components';
import * as React from 'react';

type Severity = 'info' | 'warning' | 'error' | 'success';

interface NotificationEmailProps {
  title: string;
  message: string;
  severity: Severity;
  timestamp: Date;
  actionUrl?: string;
  actionLabel?: string;
}

const severityConfig: Record<Severity, { bg: string; text: string; label: string }> = {
  info: { bg: 'bg-sky-500', text: 'text-sky-600', label: 'INFO' },
  warning: { bg: 'bg-amber-500', text: 'text-amber-600', label: 'WARNING' },
  error: { bg: 'bg-red-500', text: 'text-red-600', label: 'ERROR' },
  success: { bg: 'bg-green-500', text: 'text-green-600', label: 'SUCCESS' },
};

export default function NotificationEmail({
  title,
  message,
  severity,
  timestamp,
  actionUrl,
  actionLabel = 'View Details',
}: NotificationEmailProps) {
  const config = severityConfig[severity];

  return (
    <Html lang="en">
      <Head />
      <Preview>{title} - {config.label}</Preview>
      <Tailwind config={{ presets: [pixelBasedPreset] }}>
        <Body className="bg-gray-100 font-sans py-10">
          <Container className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Severity Indicator */}
            <Section className={`${config.bg} h-2 w-full`} />

            {/* Content */}
            <Section className="px-8 py-6">
              <Text className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full mb-4 ${config.bg}`}>
                {config.label}
              </Text>

              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                {title}
              </Heading>

              <Text className="text-gray-700 text-base leading-relaxed mb-4">
                {message}
              </Text>

              <Text className="text-gray-500 text-sm">
                {timestamp.toLocaleString('en-US', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </Text>

              {actionUrl && (
                <>
                  <Hr className="border-gray-200 my-6" />
                  <Text>
                    <a
                      href={actionUrl}
                      className={`inline-block px-6 py-3 text-white font-semibold rounded no-underline ${config.bg}`}
                    >
                      {actionLabel}
                    </a>
                  </Text>
                </>
              )}
            </Section>

            <Hr className="border-gray-200 mx-8" />

            <Section className="px-8 py-4">
              <Text className="text-gray-400 text-xs text-center">
                This is an automated notification. Please do not reply to this email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

NotificationEmail.PreviewProps = {
  title: 'Deployment Successful',
  message: 'Your application has been successfully deployed to production.',
  severity: 'success',
  timestamp: new Date(),
  actionUrl: 'https://dashboard.example.com/deployments/123',
  actionLabel: 'View Deployment',
} satisfies NotificationEmailProps;
```

### ❌ Incorrect: Using Standard HTML/CSS

```tsx
// ❌ DON'T DO THIS
import * as React from 'react';

export default function BadEmail({ name }: { name: string }) {
  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      {/* ❌ No Html wrapper */}
      {/* ❌ No Preview text */}
      <h1 style={{ color: 'blue' }}>Welcome {name}!</h1>
      {/* ❌ Using div instead of Section/Container */}
      <div className="content">
        {/* ❌ External CSS class won't work in most email clients */}
        Thanks for signing up!
      </div>
      {/* ❌ Relative URL won't work */}
      <img src="/logo.png" alt="Logo" />
    </div>
  );
}
```

---

## Email Client Compatibility

| Feature | Gmail | Outlook | Apple Mail | Yahoo |
|---------|-------|---------|------------|-------|
| Tailwind CSS | ✅ | ⚠️ Limited | ✅ | ⚠️ Limited |
| Inline Styles | ✅ | ✅ | ✅ | ✅ |
| Custom Fonts | ⚠️ Limited | ❌ | ✅ | ⚠️ Limited |
| Images | ✅ | ✅ | ✅ | ✅ |
| Buttons | ✅ | ✅ | ✅ | ✅ |

---

## Best Practices

1. **Always Test**: Use React Email's preview server to test across clients
2. **Keep It Simple**: Avoid complex layouts; stick to single-column designs
3. **Alt Text**: Always include alt text for images
4. **Fallback Fonts**: Specify web-safe font fallbacks
5. **Dark Mode**: Test in both light and dark modes

---

## Related Assets

- [Contact Email Template](./assets/contact-email.tsx)
- [Welcome Email Template](./assets/welcome-email.tsx)
- [Notification Email Template](./assets/notification-email.tsx)

## References

- [React Email Documentation](https://react.email/docs)
- [Email Client CSS Support](https://www.caniemail.com/)
- [React Email Components](https://react.email/docs/components/html)
