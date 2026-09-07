import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, UserCheck, Building2 } from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';

interface SignUpAccountTypeSelectorProps {
  onSelectType: (type: 'personal' | 'business') => void;
  onNavigateToSignIn: () => void;
  logoSrc?: string;
}

export const SignUpAccountTypeSelector: React.FC<SignUpAccountTypeSelectorProps> = ({
  onSelectType,
  onNavigateToSignIn,
  logoSrc = '/assets/image/ChatGPT Image Sep 4, 2026, 04_52_47 PM (1)-1.png',
}) => {
  return (
    <div className="relative w-full max-w-lg mx-auto z-20">
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

        {/* The Two Cards: Personal and Business - No Border Lines, 60/30/10 colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          {/* Card 1: PERSONAL */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playChime();
              onSelectType('personal');
            }}
            className="group text-left p-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200/70 transition-all flex flex-col justify-between active:scale-[0.99] cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                  Personal
                </span>
              </div>

              <h3 className="text-xs font-semibold text-black">
                Connect with people
              </h3>

              <p className="mt-1 text-[10px] text-neutral-500 leading-relaxed">
                Direct messaging, group chats, calls and personal communication.
              </p>
            </div>

            <div className="mt-3.5 flex items-center justify-between text-[11px] font-medium text-black">
              <span>Select Personal</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: BUSINESS */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playChime();
              onSelectType('business');
            }}
            className="group text-left p-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200/70 transition-all flex flex-col justify-between active:scale-[0.99] cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800">
                  Business
                </span>
              </div>

              <h3 className="text-xs font-semibold text-black">
                Build your business
              </h3>

              <p className="mt-1 text-[10px] text-neutral-500 leading-relaxed">
                Enterprise messaging, teams, customers, commerce and directory.
              </p>
            </div>

            <div className="mt-3.5 flex items-center justify-between text-[11px] font-medium text-black">
              <span>Select Business</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Bottom Link to Sign In */}
        <div className="text-center pt-1">
          <p className="text-[11px] text-neutral-400">
            Already registered on WAT?{' '}
            <button
              type="button"
              onClick={onNavigateToSignIn}
              className="text-black font-semibold hover:underline ml-0.5 transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
