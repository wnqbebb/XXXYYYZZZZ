// emails/contact-email.tsx
// Contact form submission email template

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

              <Heading as="h2" className="text-lg font-semibold text-gray-800 mb-3">
                Message:
              </Heading>

              <Text className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">
                {message}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-8 py-4">
              <Text className="text-gray-500 text-sm text-center m-0">
                This email was sent from your website contact form
              </Text>
              <Text className="text-gray-400 text-xs text-center mt-2">
                {new Date().toLocaleString('en-US', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
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

I'm looking for a solution that can handle our growing team of about 20 people.

Thanks,
John`,
} satisfies ContactEmailProps;
