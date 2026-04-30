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
    heroTitle: 'Hire verified Pakistani graduate talent.',
    heroSubtitle:
      'UniHire connects global clients with trusted Pakistani students and graduates whose education, identity, and gigs are reviewed before they go live.',
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
