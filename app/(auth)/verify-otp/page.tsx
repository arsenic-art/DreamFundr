'use client';
import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import Link from 'next/link';
import { ShieldCheck, RotateCw, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const OTPPage = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;  

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = otp.join('');
    console.log('Verifying OTP:', verificationCode);
    if (verificationCode.length === 6) {
        router.push('/login');
    } else {
        alert("Please enter a valid 6-digit OTP.");
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Verify Your Account</h1>
        <p className="text-gray-400 mt-2">
          Enter the 6-digit code sent to your email.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2 md:gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el: any) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          ))}
        </div>
        
        <button type="submit" className="w-full group bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-4 rounded-full hover:shadow-lg hover:shadow-purple-500/25 transition-all">
          Verify Account
          <ShieldCheck className="inline-block ml-2 w-5 h-5 transition-transform" />
        </button>
      </form>
      
      <div className="text-center text-gray-400 mt-6 text-sm">
        Didn't receive the code?{' '}
        <button className="font-medium text-cyan-400 hover:underline">
          Resend Code <RotateCw className="inline w-3 h-3 ml-1" />
        </button>
      </div>
      <div>
        <p className="text-center text-gray-400 mt-6 text-sm">
          <ArrowLeft className="inline w-4 h-4 mr-1" />
          <Link href="/signup" className="font-medium text-cyan-400 hover:underline">
             Back 
          </Link>
        </p>
      </div>
    </>
  );
};

export default OTPPage;