'use client';

import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles } from 'lucide-react';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
    }

    try {
      // const response = await fetch("/api/auth/signup", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify({ name, email, password })
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.error || 'Something went wrong');
      // }
      
      console.log('Successfully signed up:');
      window.location.href = '/verify-otp';
    } catch (error: any) {
      setError(error.message);
    } finally {
      setPassword('');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Create Your Account</h1>
        <p className="text-gray-400 mt-2">Let's get your dreams started.</p>
      </div>

      {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-center p-3 rounded-full mb-4">
              <p>{error}</p>
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>
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
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <button 
            type="submit" 
            disabled={loading}
            className="w-full group bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-4 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
          {!loading && <Sparkles className="inline-block ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />}
        </button>
      </form>

      <p className="text-center text-gray-400 mt-6 text-sm">
        Already have an account?{' '}
        <a href="/login" className="font-medium text-cyan-400 hover:underline">
          Login here
        </a>
      </p>
    </>
  );
};

export default SignUpPage;

