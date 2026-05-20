'use client';

import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/lib/axiosinstance';

interface OtpModalProps {
  email: string;
  isSouthIndia: boolean;
  onVerified: (userData: any) => void;
  onClose: () => void;
}

export default function OtpModal({
  email,
  isSouthIndia,
  onVerified,
  onClose,
}: OtpModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'sending' | 'verifying' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState<'email' | 'mobile'>('email');
  const [devOtp, setDevOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    sendOtp();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  async function sendOtp() {
    setStatus('sending');
    setMessage('');
    try {
      const res = await axiosInstance.post('/user/send-otp', { email, isSouthIndia });
      setChannel(res.data.channel);
      setMessage(res.data.message);
      if (res.data.devOtp) setDevOtp(res.data.devOtp);
      setResendCooldown(30);
      setStatus('idle');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to send OTP.');
      setStatus('error');
    }
  }

  function handleInput(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join('');
    if (code.length < 6) {
      setMessage('Please enter the full 6-digit OTP.');
      return;
    }
    setStatus('verifying');
    setMessage('');
    try {
      const res = await axiosInstance.post('/user/verify-otp', { email, otp: code });
      onVerified(res.data.result);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Invalid OTP. Please try again.');
      setStatus('error');
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }

  const channelLabel = channel === 'email'
    ? `email (${email})`
    : 'registered mobile number';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-2xl">
            {channel === 'email' ? '📧' : '📱'}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Verify your identity
        </h2>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          {status === 'sending'
            ? 'Sending OTP…'
            : `OTP sent to your ${channelLabel}`}
        </p>

        {devOtp && (
          <div className="mb-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 px-4 py-2 text-center text-sm text-yellow-800 dark:text-yellow-300">
            <span className="font-semibold">Dev mode OTP:</span> {devOtp}
          </div>
        )}

        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-11 h-14 text-center text-xl font-bold border-2 rounded-xl
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800
                         text-gray-900 dark:text-white
                         focus:outline-none focus:border-red-500 dark:focus:border-red-400
                         transition-colors"
            />
          ))}
        </div>

        {message && (
          <p className={`text-sm text-center mb-4 ${status === 'error' ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
            {message}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={status === 'verifying' || status === 'sending'}
          className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50
                     text-white font-semibold transition-colors"
        >
          {status === 'verifying' ? 'Verifying…' : 'Verify OTP'}
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Didn't receive it?{' '}
          {resendCooldown > 0 ? (
            <span className="text-gray-400">Resend in {resendCooldown}s</span>
          ) : (
            <button
              onClick={sendOtp}
              className="text-red-600 hover:underline font-medium"
            >
              Resend OTP
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
