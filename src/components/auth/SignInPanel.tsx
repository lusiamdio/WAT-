import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface SignInPanelProps {
  onSignInSuccess: (identifier: string, isBusiness?: boolean) => void;
  onNavigateToSignUp: () => void;
  logoSrc?: string;
  defaultIdentifier?: string;
}

export const SignInPanel: React.FC<SignInPanelProps> = ({
  onSignInSuccess,
  onNavigateToSignUp,
  logoSrc = '/assets/image/ChatGPT Image Sep 4, 2026, 04_52_47 PM (1)-1.png',
  defaultIdentifier = '',
}) => {
  const [identifier, setIdentifier] = useState(defaultIdentifier);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your phone number or email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    soundEngine.playMessageSent();

    setTimeout(() => {
      setIsLoading(false);
      soundEngine.playChime();
      const isBusinessAccount =
        identifier.toLowerCase().includes('business') ||
        identifier.toLowerCase().includes('enterprise');
      onSignInSuccess(identifier, isBusinessAccount);
    }, 900);
  };


  return (
    <div className="relative w-full max-w-md mx-auto z-20">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.99 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl text-neutral-900 overflow-hidden"
      >
        {/* Transparent Logo - Centered, No borders, No header */}
        <div className="flex justify-center mb-5">
          <img
            src={logoSrc}
            alt="WAT"
            className="w-9 h-9 object-contain bg-transparent select-none pointer-events-none"
            onError={(e) => {
              e.currentTarget.src = '/wat-logo.png';
            }}
          />
        </div>

        {/* Notice Message Banner */}
        {noticeMessage && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-neutral-100 text-neutral-800 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 shrink-0 text-neutral-700" />
            <span className="text-[10px]">{noticeMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-neutral-100 text-neutral-900 flex items-center gap-2">
            <AlertCircle className="w-3 h-3 shrink-0 text-neutral-700" />
            <span className="text-[10px]">{errorMessage}</span>
          </div>
        )}

        {/* Sign In Form - Smaller Text & No Border Lines */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Field 1: Phone / Email */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-semibold text-neutral-400 mb-1">
              Phone or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter phone or email"
              required
              className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
            />
          </div>

          {/* Field 2: Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-[10px] text-neutral-400 hover:text-black transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-3 py-2 pr-9 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Primary CTA - 30% Black, Smaller Text, No Border */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 py-2 px-3.5 rounded-xl bg-black text-white font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px]">Signing in...</span>
              </div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Bottom Switch to Sign Up */}
        <div className="mt-3.5 text-center">
          <p className="text-[11px] text-neutral-400">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="text-black font-semibold hover:underline ml-0.5 transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onSuccessNotice={(msg) => setNoticeMessage(msg)}
      />
    </div>
  );
};
