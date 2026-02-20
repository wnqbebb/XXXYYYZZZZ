// components/newsletter-form.tsx
// Simple newsletter subscription form

'use client';

import { useState } from 'react';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

interface NewsletterFormProps {
  onSuccess?: () => void;
  className?: string;
  buttonText?: string;
  placeholder?: string;
}

export function NewsletterForm({
  onSuccess,
  className = '',
  buttonText = 'Subscribe',
  placeholder = 'Enter your email',
}: NewsletterFormProps) {
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
      onSuccess?.();
      
      // Reset after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder={placeholder}
          disabled={status === 'loading'}
          aria-label="Email address"
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${status === 'loading' ? 'bg-gray-100' : 'bg-white'}
          `}
        />
        {error && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={status === 'loading'}
        className={`px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap
          ${status === 'success' 
            ? 'bg-green-500 text-white' 
            : status === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {status === 'loading' ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            Subscribing...
          </span>
        ) : status === 'success' ? (
          <span className="flex items-center">
            <svg
              className="-ml-1 mr-2 h-4 w-4"
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
            Subscribed!
          </span>
        ) : (
          buttonText
        )}
      </button>
    </form>
  );
}
