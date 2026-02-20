// emails/welcome-email.tsx
// Welcome email template for new users

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
  companyName?: string;
}

export default function WelcomeEmail({
  username,
  verificationUrl,
  supportEmail,
  companyName = 'Acme',
}: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to {companyName}! Please verify your email address</Preview>
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
                Welcome to {companyName}!
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="px-8 py-8">
              <Text className="text-gray-800 text-lg mb-4">
                Hi {username},
              </Text>

              <Text className="text-gray-600 text-base leading-relaxed mb-6">
                Thanks for signing up! We're excited to have you on board. 
                Please verify your email address to get started with all the features.
              </Text>

              <Section className="text-center mb-6">
                <Button
                  href={verificationUrl}
                  className="bg-brand text-white px-8 py-4 rounded-lg font-semibold text-base no-underline inline-block"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-gray-500 text-sm text-center mb-2">
                Or copy and paste this URL into your browser:
              </Text>
              
              <Text className="text-brand text-sm text-center break-all">
                <Link href={verificationUrl} className="text-brand underline">
                  {verificationUrl}
                </Link>
              </Text>

              <Text className="text-gray-500 text-sm text-center mt-6">
                This link will expire in 24 hours.
              </Text>
            </Section>

            <Hr className="border-gray-200 mx-8" />

            {/* Features Section */}
            <Section className="px-8 py-6">
              <Heading as="h2" className="text-xl font-semibold text-gray-800 mb-4">
                What's next?
              </Heading>
              
              <ul className="text-gray-600 text-base space-y-2">
                <li>✅ Complete your profile</li>
                <li>✅ Explore our features</li>
                <li>✅ Connect with your team</li>
              </ul>
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
                © {new Date().getFullYear()} {companyName} Inc. All rights reserved.
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
  companyName: 'Acme',
} satisfies WelcomeEmailProps;
