import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useChat } from '../../context/ChatContext';
import { ArchitecturalCanvas } from './ArchitecturalCanvas';
import { BrandIntroSequence } from './BrandIntroSequence';
import { SignInPanel } from './SignInPanel';
import { SignUpAccountTypeSelector } from './SignUpAccountTypeSelector';
import { PersonalSignUpFlow } from './PersonalSignUpFlow';
import { BusinessSignUpFlow } from './BusinessSignUpFlow';
import { OnboardingJourney } from './OnboardingJourney';

export const AuthAndOnboardingFlow: React.FC = () => {
  const {
    currentUser,
    signIn,
    signUp,
    finishOnboarding,
    setCurrentUserById,
    onboardingStatus,
    users,
  } = useChat();

  // Active Flow Stages:
  // 'intro': Minimal animated brand logo intro
  // 'signin': Sign In Experience (60% white, 30% black, 10% grey, no headers, no borders)
  // 'signup_type': Account Type Selector (Personal vs Business)
  // 'signup_personal': Personal Registration
  // 'signup_business': Enterprise Registration
  // 'onboarding': 5-Screen Onboarding Journey
  const [stage, setStage] = useState<
    'intro' | 'signin' | 'signup_type' | 'signup_personal' | 'signup_business' | 'onboarding'
  >(() => {
    if (onboardingStatus === 'ONBOARDING_IN_PROGRESS') return 'onboarding';
    return 'intro';
  });

  const [reducedMotion] = useState(false);

  // Temporary profile state for passing into onboarding
  const [tempProfile, setTempProfile] = useState<{
    name: string;
    handle: string;
    avatar: string;
    isBusiness?: boolean;
    bio?: string;
  }>({
    name: currentUser?.name || 'Kwame Mensah',
    handle: currentUser?.handle || '@kwamemensah:wat.chat',
    avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: currentUser?.bio || 'Product Architect & Explorer',
    isBusiness: currentUser?.isBusinessAccount || false,
  });

  const watLogo = '/assets/image/ChatGPT Image Sep 4, 2026, 04_52_47 PM (1)-1.png';

  // Handle successful Sign In
  const handleSignInSuccess = async (identifier: string, isBusiness: boolean = false) => {
    const matched = users.find(
      (u) =>
        u.email?.toLowerCase() === identifier.toLowerCase() ||
        u.handle?.toLowerCase() === identifier.toLowerCase() ||
        u.phone?.includes(identifier)
    );

    if (matched) {
      setCurrentUserById(matched.id);
      setTempProfile({
        name: matched.name,
        handle: matched.handle,
        avatar: matched.avatar,
        isBusiness: matched.isBusinessAccount,
        bio: matched.bio,
      });
    } else {
      const defaultUser = isBusiness ? users[1] || users[0] : users[0];
      if (defaultUser) {
        setCurrentUserById(defaultUser.id);
        setTempProfile({
          name: defaultUser.name,
          handle: defaultUser.handle,
          avatar: defaultUser.avatar,
          isBusiness,
          bio: defaultUser.bio,
        });
      }
    }

    setStage('onboarding');
  };

  // Handle Personal Sign Up Completion
  const handlePersonalSignUpComplete = async (personalData: {
    name: string;
    email: string;
    phone: string;
    username: string;
    avatar: string;
    bio: string;
  }) => {
    setTempProfile({
      name: personalData.name,
      handle: personalData.username,
      avatar: personalData.avatar,
      isBusiness: false,
      bio: personalData.bio,
    });

    try {
      await signUp({
        name: personalData.name,
        dob: '1995-06-15',
        phone: personalData.phone,
        email: personalData.email,
        bio: personalData.bio,
        avatar: personalData.avatar,
        accountTier: 'Pro',
        isBusinessAccount: false,
      });
    } catch {
      signIn(personalData.email);
    }

    setStage('onboarding');
  };

  // Handle Business Sign Up Completion
  const handleBusinessSignUpComplete = async (businessData: {
    businessName: string;
    category: string;
    country: string;
    email: string;
    phone: string;
    website: string;
    industry: string;
    description: string;
    username: string;
    location: string;
  }) => {
    setTempProfile({
      name: businessData.businessName,
      handle: businessData.username,
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      isBusiness: true,
      bio: `${businessData.category} • ${businessData.location}`,
    });

    try {
      await signUp({
        name: businessData.businessName,
        dob: '2020-01-01',
        phone: businessData.phone,
        email: businessData.email,
        bio: businessData.description,
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        accountTier: 'Enterprise',
        isBusinessAccount: true,
        businessProfile: {
          businessName: businessData.businessName,
          category: businessData.category,
          industry: businessData.industry,
          website: businessData.website,
          location: businessData.location,
          isVerified: true,
        },
      });
    } catch {
      signIn(businessData.email);
    }

    setStage('onboarding');
  };

  // Handle final completion of the Onboarding Journey
  const handleOnboardingComplete = (updatedProfile?: { avatar?: string; name?: string; bio?: string }) => {
    const finalAvatar = updatedProfile?.avatar || tempProfile.avatar;
    const finalName = updatedProfile?.name || tempProfile.name;
    const finalBio = updatedProfile?.bio || tempProfile.bio;

    finishOnboarding({
      name: finalName,
      avatar: finalAvatar,
      isBusinessAccount: tempProfile.isBusiness,
      bio: finalBio,
      onboardingStatus: 'ONBOARDING_COMPLETED',
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAFAFA] text-neutral-900 flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* 1. Neutral Minimal Canvas - 60% White, 10% Grey */}
      <ArchitecturalCanvas />

      {/* 2. Main Stage Area - Header Removed from SignIn and SignUp panels */}
      <main className="relative z-20 flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <AnimatePresence mode="wait">
          {/* Stage 1: Brand Intro Sequence - Only animated logo */}
          {stage === 'intro' && (
            <BrandIntroSequence
              key="intro-seq"
              logoSrc={watLogo}
              reducedMotion={reducedMotion}
              onComplete={() => setStage('signin')}
            />
          )}

          {/* Stage 2: Sign In Experience - No Header, No Borders, Smaller Text */}
          {stage === 'signin' && (
            <SignInPanel
              key="signin-panel"
              logoSrc={watLogo}
              onSignInSuccess={handleSignInSuccess}
              onNavigateToSignUp={() => setStage('signup_type')}
            />
          )}

          {/* Stage 3: Sign Up Account Type Selector */}
          {stage === 'signup_type' && (
            <SignUpAccountTypeSelector
              key="signup-type"
              logoSrc={watLogo}
              onSelectType={(type) => {
                if (type === 'personal') setStage('signup_personal');
                else setStage('signup_business');
              }}
              onNavigateToSignIn={() => setStage('signin')}
            />
          )}

          {/* Stage 4: Personal Sign Up Flow */}
          {stage === 'signup_personal' && (
            <PersonalSignUpFlow
              key="signup-personal"
              logoSrc={watLogo}
              onComplete={handlePersonalSignUpComplete}
              onBackToAccountType={() => setStage('signup_type')}
            />
          )}

          {/* Stage 5: Business Sign Up Flow */}
          {stage === 'signup_business' && (
            <BusinessSignUpFlow
              key="signup-business"
              logoSrc={watLogo}
              onComplete={handleBusinessSignUpComplete}
              onBackToAccountType={() => setStage('signup_type')}
            />
          )}

          {/* Stage 6: 5-Screen Onboarding Journey */}
          {stage === 'onboarding' && (
            <OnboardingJourney
              key="onboarding-journey"
              logoSrc={watLogo}
              currentUser={tempProfile}
              onUpdateAvatar={(newAvatar) => {
                setTempProfile((prev) => ({ ...prev, avatar: newAvatar }));
              }}
              onComplete={handleOnboardingComplete}
            />
          )}
        </AnimatePresence>
      </main>

      {/* 3. Minimal Subtle Footer - No Border Lines */}
      {stage !== 'intro' && (
        <footer className="relative z-20 py-3 text-center text-[11px] text-neutral-400">
          WAT Instant Messenger &amp; Business
        </footer>
      )}
    </div>
  );
};
