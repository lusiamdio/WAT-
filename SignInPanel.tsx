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
  const [identifier, setIdentifier] = useState(defaultIdentifier || 'alex@wat.chat');
  const [password, setPassword] = useState('watSecure2026!');
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

  const handleSocialSignIn = (provider: 'Google' | 'Apple' | 'Microsoft') => {
    setIsLoading(true);
    soundEngine.playChime();
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess(`user_${provider.toLowerCase()}@wat.chat`, false);
    }, 800);
  };

  const handleQuickDemoFill = (type: 'personal' | 'business') => {
    if (type === 'personal') {
      setIdentifier('kwame.mensah@wat.chat');
      setPassword('matrixPass99!');
    } else {
      setIdentifier('zuri.ventures@business.wat.chat');
      setPassword('enterpriseVault#1');
    }
    soundEngine.playChime();
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
        {/* Transparent Logo - No borders */}
        <div className="flex items-center gap-3 mb-5">
          <img
            src={logoSrc}
            alt="WAT"
            className="w-8 h-8 object-contain bg-transparent select-none pointer-events-none"
            onError={(e) => {
              e.currentTarget.src = '/wat-logo.png';
            }}
          />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
              Sign In
            </h2>
            <p className="text-[11px] text-neutral-500">
              Continue to your WAT account
            </p>
          </div>
        </div>

        {/* Notice Message Banner */}
        {noticeMessage && (
          <div className="mb-4 p-3 rounded-xl bg-neutral-100 text-xs text-neutral-800 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-neutral-700" />
            <span className="text-[11px]">{noticeMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-neutral-100 text-xs text-neutral-900 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-neutral-700" />
            <span className="text-[11px]">{errorMessage}</span>
          </div>
        )}

        {/* Sign In Form - Smaller Text & No Border Lines */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Field 1: Phone / Email */}
          <div>
            <label className="block text-xs font-medium text-neutral-600 mb-1">
              Phone or Email
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter phone or email"
              required
              className="w-full px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
            />
          </div>

          {/* Field 2: Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-neutral-600">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-[11px] text-neutral-500 hover:text-black transition-colors"
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
                className="w-full px-3.5 py-2.5 pr-10 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
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
            className="w-full py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Signing in...</span>
              </div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Subtle Spacer instead of border lines */}
        <div className="my-4 text-center">
          <span className="text-[11px] text-neutral-400">
            or continue with
          </span>
        </div>

        {/* Secondary Social Options - 10% Grey Fill, No Border Lines */}
        <div className="grid grid-cols-3 gap-2">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialSignIn('Google')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl text-xs font-medium text-neutral-800 transition-all active:scale-[0.98]"
            title="Continue with Google"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.6 3.6 1.8 7.3l3.7 2.9C6.4 7.3 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.5 14.8c-.3-.8-.4-1.8-.4-2.8s.2-1.9.4-2.8L1.8 6.3C.7 8.6 0 10.2 0 12s.7 3.4 1.8 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.6-2.3-6.5-5.2L1.8 16C3.6 19.7 7.4 23 12 23z"
              />
            </svg>
            <span className="text-[11px]">Google</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => handleSocialSignIn('Apple')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl text-xs font-medium text-neutral-800 transition-all active:scale-[0.98]"
            title="Continue with Apple"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.58-7.7-11.66-13.98-5.99-9.12-10.74-19.8-14.25-32.04-3.51-12.24-5.26-23.75-5.26-34.53 0-14.89 3.73-27.18 11.2-36.87 7.47-9.68 16.9-14.59 28.29-14.71 4.58 0 9.7 1.15 15.35 3.44 5.66 2.3 9.4 3.51 11.22 3.63 1.45 0 5.4-1.34 11.85-4.01 6.45-2.67 11.89-3.9 16.32-3.7 12.19.64 22.18 5.25 29.96 13.82-10.66 6.42-15.86 15.3-15.6 26.65.25 8.91 3.75 16.33 10.51 22.25 6.76 5.92 14.68 9.38 23.77 10.37-2.31 7.15-5.06 14.15-8.24 21zm-28.79-114.7c0 5.86-2.22 11.45-6.66 16.78-4.45 5.32-10.02 8.78-16.72 10.37-.25-1.5-.38-2.88-.38-4.14 0-5.75 2.33-11.41 6.99-16.98 4.66-5.57 10.31-8.99 16.96-10.25.13 1.41.19 2.81.19 4.22z" />
            </svg>
            <span className="text-[11px]">Apple</span>
          </button>

          {/* Microsoft */}
          <button
            type="button"
            onClick={() => handleSocialSignIn('Microsoft')}
            className="flex items-center justify-center gap-1.5 py-2 px-2 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl text-xs font-medium text-neutral-800 transition-all active:scale-[0.98]"
            title="Continue with Microsoft"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span className="text-[11px]">Microsoft</span>
          </button>
        </div>

        {/* Quick Demo Credentials Strip */}
        <div className="mt-4 pt-3 flex items-center justify-between text-xs">
          <span className="text-[11px] text-neutral-400">Quick demo:</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('personal')}
              className="px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[11px] text-neutral-700 transition-colors"
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('business')}
              className="px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[11px] text-neutral-700 transition-colors"
            >
              Business
            </button>
          </div>
        </div>

        {/* Bottom Switch to Sign Up */}
        <div className="mt-4 text-center">
          <p className="text-xs text-neutral-500">
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
