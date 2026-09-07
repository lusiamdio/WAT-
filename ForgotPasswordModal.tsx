import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ArrowRight, CheckCircle2, KeyRound, ShieldCheck, Lock } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNotice?: (msg: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccessNotice,
}) => {
  const [step, setStep] = useState<'request' | 'verify' | 'new_password' | 'done'>('request');
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or registered phone number.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    soundEngine.playChime();
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 700);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setErrorMessage('Please provide the full 6-digit recovery code.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    soundEngine.playMessageSent();
    setTimeout(() => {
      setIsLoading(false);
      setStep('new_password');
    }, 600);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    soundEngine.playChime();
    setTimeout(() => {
      setIsLoading(false);
      setStep('done');
      if (onSuccessNotice) {
        onSuccessNotice('Password successfully updated. You may now sign in.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-neutral-900 overflow-hidden"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-black rounded-xl hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'request' && (
          <form onSubmit={handleSendReset} className="space-y-3.5">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-black">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black tracking-tight">Reset Password</h3>
                <p className="text-[11px] text-neutral-500">Enter your phone or email to recover access</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-neutral-100 text-xs text-neutral-800">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                Email or Phone Number
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="alex@wat.chat or phone"
                className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Recovery Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-3.5">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-black">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black tracking-tight">Enter Code</h3>
                <p className="text-[11px] text-neutral-500">Sent to {identifier || 'your account'}</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-neutral-100 text-xs text-neutral-800">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-between gap-1.5">
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  id={`forgot-otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    const copy = [...otpCode];
                    copy[i] = val;
                    setOtpCode(copy);
                    if (val && i < 5) {
                      const next = document.getElementById(`forgot-otp-${i + 1}`);
                      if (next) (next as HTMLInputElement).focus();
                    }
                  }}
                  className="w-9 h-11 text-center text-base font-bold bg-neutral-100 rounded-xl text-black focus:outline-none focus:bg-neutral-200/90"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500">
              <button
                type="button"
                onClick={() => setOtpCode(['8', '3', '9', '2', '0', '1'])}
                className="text-[11px] text-neutral-700 hover:text-black font-medium hover:underline"
              >
                Auto-fill (839201)
              </button>
              <button
                type="button"
                onClick={() => setStep('request')}
                className="text-[11px] hover:text-black"
              >
                Change Address
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Verify Code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 'new_password' && (
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-black">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black tracking-tight">New Password</h3>
                <p className="text-[11px] text-neutral-500">Choose a secure password</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-neutral-100 text-xs text-neutral-800">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3 py-2 bg-neutral-100 hover:bg-neutral-200/60 rounded-xl text-xs text-black placeholder:text-neutral-400 focus:outline-none focus:bg-neutral-200/80 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Save Password</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center py-2 space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-black">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-black">Password Updated</h3>
            <p className="text-xs text-neutral-500">
              Your password has been successfully reset. Please sign in now.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
            >
              Proceed to Sign In
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
