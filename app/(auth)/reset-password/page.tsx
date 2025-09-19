'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Send } from 'lucide-react';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle reset password logic here
    console.log('Requesting password reset for:', email);
    setSubmitted(true);
  };

  if (submitted) {
    return (
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Check Your Inbox</h1>
            <p className="text-gray-300">
                We've sent a password reset link to <span className="font-bold text-cyan-400">{email}</span>. Please follow the instructions in the email to reset your password.
            </p>
            <Link href="/login" className="mt-8 inline-block text-cyan-400 hover:underline">
              &larr; Back to Login
            </Link>
        </div>
    );
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Forgot Your Password?</h1>
        <p className="text-gray-400 mt-2">No worries. Enter your email and we'll send you a reset link.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
        
        <button type="submit" className="w-full group bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-4 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all">
          Send Reset Link
          <Send className="inline-block ml-2 w-5 h-5 transition-transform" />
        </button>
      </form>
      
      <p className="text-center text-gray-400 mt-6 text-sm">
        Remembered your password?{' '}
        <Link href="/login" className="font-medium text-cyan-400 hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default ResetPasswordPage;