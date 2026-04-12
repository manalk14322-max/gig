import { createContext, useContext, useMemo } from 'react';

const LangContext = createContext({
  lang: 'en',
  toggleLang: () => {},
  t: (key) => key,
});

const translations = {
  en: {
    account: 'Account',
    login: 'Login',
    signup: 'Sign up',
    continueWithGoogle: 'Continue with Google',
    campusVerification: 'Campus verification',
    verify: 'Verify',
    resendOtp: 'Resend OTP',
    heroTitle: 'Find verified student talent.',
    heroSubtitle:
      'Discover university-verified sellers, compare packages, and launch faster with premium local support and smart matching.',
    createGigTitle: 'Create a campus gig buyers trust',
    profileTitle: 'Build a trusted student seller profile',
  },
};

export function LangProvider({ children }) {
  const lang = 'en';
  const toggleLang = () => {};
  const t = useMemo(() => (key) => translations.en[key] || key, []);

  return <LangContext.Provider value={{ lang, toggleLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
