// app/api/send-email/route.ts
// Complete API route for handling contact form submissions with Resend

import { Resend } from 'resend';
import { z } from 'zod';
import { ContactEmail } from '@/emails/contact-email';

// Initialize Resend client as singleton
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // Generate idempotency key to prevent duplicate emails
    const idempotencyKey = Buffer.from(
      `${validatedData.email}:${validatedData.subject}:${Date.now().toString().slice(0, -3)}`
    ).toString('base64').slice(0, 32);

    // Send email using React Email template
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>',
      to: [process.env.RESEND_TO_EMAIL || 'admin@example.com'],
      replyTo: validatedData.email,
      subject: `Contact Form: ${validatedData.subject}`,
      react: ContactEmail(validatedData),
      headers: {
        'X-Idempotency-Key': idempotencyKey,
      },
    });

    if (error) {
      console.error('Resend API Error:', error);
      
      // Handle specific error types
      switch (error.name) {
        case 'validation_error':
          return Response.json(
            { error: 'Invalid email configuration', details: error.message },
            { status: 400 }
          );
        case 'rate_limit_exceeded': {
          const retryAfter = error.statusCode === 429 ? '60' : undefined;
          return Response.json(
            { error: 'Rate limit exceeded. Please try again later.', retryAfter },
            { status: 429, headers: retryAfter ? { 'Retry-After': retryAfter } : undefined }
          );
        }
        case 'not_found':
          return Response.json(
            { error: 'Email resource not found' },
            { status: 404 }
          );
        default:
          return Response.json(
            { error: 'Failed to send email', details: error.message },
            { status: 500 }
          );
      }
    }

    return Response.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Request processing error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return Response.json(
        { 
          error: 'Validation failed', 
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
