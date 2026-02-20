// emails/notification-email.tsx
// Notification email template with severity levels

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
  Link,
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
  footerText?: string;
}

const severityConfig: Record<Severity, { bg: string; text: string; label: string; icon: string }> = {
  info: { 
    bg: 'bg-sky-500', 
    text: 'text-sky-600', 
    label: 'INFO',
    icon: 'ℹ️'
  },
  warning: { 
    bg: 'bg-amber-500', 
    text: 'text-amber-600', 
    label: 'WARNING',
    icon: '⚠️'
  },
  error: { 
    bg: 'bg-red-500', 
    text: 'text-red-600', 
    label: 'ERROR',
    icon: '❌'
  },
  success: { 
    bg: 'bg-green-500', 
    text: 'text-green-600', 
    label: 'SUCCESS',
    icon: '✅'
  },
};

export default function NotificationEmail({
  title,
  message,
  severity,
  timestamp,
  actionUrl,
  actionLabel = 'View Details',
  footerText = 'This is an automated notification. Please do not reply to this email.',
}: NotificationEmailProps) {
  const config = severityConfig[severity];

  return (
    <Html lang="en">
      <Head />
      <Preview>{config.icon} {title} - {config.label}</Preview>
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
                  <Section className="text-center">
                    <Link
                      href={actionUrl}
                      className={`inline-block px-6 py-3 text-white font-semibold rounded no-underline ${config.bg}`}
                    >
                      {actionLabel}
                    </Link>
                  </Section>
                </>
              )}
            </Section>

            <Hr className="border-gray-200 mx-8" />

            <Section className="px-8 py-4">
              <Text className="text-gray-400 text-xs text-center">
                {footerText}
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
  message: 'Your application has been successfully deployed to production. All health checks are passing.',
  severity: 'success',
  timestamp: new Date(),
  actionUrl: 'https://dashboard.example.com/deployments/123',
  actionLabel: 'View Deployment',
} satisfies NotificationEmailProps;
