---
name: Form Handling with Resend
scope: form-handling
description: Frontend form integration with React, validation, and Resend API communication
---

# Form Handling with Resend

## Metadata
- **Rule Name**: form-handling
- **Scope**: React Forms
- **Applies To**: `components/**/*.tsx`, `app/**/page.tsx`

---

## Directrices Críticas

### MUST

1. **MUST** use controlled components for form inputs
2. **MUST** implement client-side validation before API submission
3. **MUST** show loading state during API request
4. **MUST** handle and display API errors to the user
5. **MUST** provide success feedback after email is sent
6. **MUST** disable submit button while processing
7. **MUST** use `type="email"` for email inputs (browser validation)

### FORBIDDEN

1. **FORBIDDEN** to send sensitive data (passwords, API keys) through email forms
2. **FORBIDDEN** to allow form submission without validation
3. **FORBIDDEN** to clear form on error (preserve user input)
4. **FORBIDDEN** to use `alert()` for error messages
5. **FORBIDDEN** to submit form on Enter key without explicit handling

### WHY

- **Controlled Components**: Enable real-time validation and state management
- **Client Validation**: Reduces server load and provides instant feedback
- **Loading States**: Prevents double-submission and improves UX
- **Error Handling**: Users need clear feedback on what went wrong
- **Input Types**: Browser-native validation improves accessibility and mobile UX

---

## Ejemplos

### ✅ Correct: Contact Form Component

```tsx
// components/contact-form.tsx
'use client';

import { useState } from 'react';
import { z } from 'zod';

// Validation schema (should match API schema)
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  submit?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (name: keyof ContactFormData, value: string): string | undefined => {
    const fieldSchema = contactSchema.shape[name];
    const result = fieldSchema.safeParse(value);
    if (!result.success) {
      return result.error.errors[0].message;
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof ContactFormData, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate all fields
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.errors.forEach(error => {
        const field = error.path[0] as keyof FormErrors;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success!
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);

    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-green-900">
          Message Sent Successfully!
        </h3>
        <p className="mt-2 text-green-700">
          Thank you for reaching out. We'll get back to you soon.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-4 text-green-600 hover:text-green-500 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
            ${errors.name ? 'border-red-500' : 'border-gray-300'}
            ${isLoading ? 'bg-gray-100' : ''}
          `}
          placeholder="John Doe"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
            ${errors.email ? 'border-red-500' : 'border-gray-300'}
            ${isLoading ? 'bg-gray-100' : ''}
          `}
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
            ${errors.subject ? 'border-red-500' : 'border-gray-300'}
            ${isLoading ? 'bg-gray-100' : ''}
          `}
          placeholder="How can we help?"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500
            ${errors.message ? 'border-red-500' : 'border-gray-300'}
            ${isLoading ? 'bg-gray-100' : ''}
          `}
          placeholder="Tell us more about your inquiry..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
```

### ✅ Correct: Simple Newsletter Form

```tsx
// components/newsletter-form.tsx
'use client';

import { useState } from 'react';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="Enter your email"
          disabled={status === 'loading'}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${status === 'loading' ? 'bg-gray-100' : 'bg-white'}
          `}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`px-6 py-2 rounded-lg font-medium transition-colors
          ${status === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {status === 'loading' ? 'Subscribing...' : 
         status === 'success' ? 'Subscribed!' : 
         'Subscribe'}
      </button>
    </form>
  );
}
```

### ❌ Incorrect: Uncontrolled Form

```tsx
// ❌ DON'T DO THIS
'use client';

export function BadForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // ❌ No client-side validation
    await fetch('/api/send-email', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
      }),
    });
    
    // ❌ No error handling
    // ❌ No loading state
    // ❌ No success feedback
    alert('Sent!'); // ❌ Don't use alert()
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ❌ Uncontrolled inputs */}
      <input name="name" placeholder="Name" />
      <input name="email" placeholder="Email" />
      <button type="submit">Send</button>
    </form>
  );
}
```

---

## Form Accessibility

```tsx
// Accessible form with proper ARIA attributes
export function AccessibleContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  return (
    <form 
      onSubmit={handleSubmit}
      aria-label="Contact form"
      noValidate // Handle validation manually
    >
      <div>
        <label htmlFor="email">
          Email Address <span aria-label="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="error">
            {errors.email}
          </p>
        )}
      </div>
      
      <button 
        type="submit"
        aria-disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

---

## Related Assets

- [Contact Form Component](./assets/contact-form.tsx)
- [Newsletter Form Component](./assets/newsletter-form.tsx)

## References

- [React Forms Documentation](https://react.dev/reference/react-dom/components/form)
- [Zod Validation](https://zod.dev/)
- [Form Accessibility (MDN)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/forms)
