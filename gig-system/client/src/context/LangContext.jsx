import { createContext, useContext, useMemo, useState } from 'react';

const LangContext = createContext({
  lang: 'en',
  setLang: () => {},
  speak: () => {},
  t: (key) => key,
});

const translations = {
  en: {
    account: 'Account',
    login: 'Login',
    signup: 'Sign up',
    continueWithGoogle: 'Continue with Google',
    campusVerification: 'Student verification',
    verify: 'Verify',
    resendOtp: 'Resend OTP',
    heroTitle: 'Hire trusted Pakistani talent in Pakistan.',
    heroSubtitle:
      'UniHire is a Pakistan-only marketplace where local buyers hire verified students from FSc level and above.',
    createGigTitle: 'Create a trusted student gig',
    profileTitle: 'Build a trusted Pakistani student profile',
    navMarketplace: 'Marketplace',
    navSaved: 'Saved',
    navCreate: 'Create Gig',
    navDashboard: 'Dashboard',
    navOrders: 'Orders',
    navMessages: 'Messages',
    navProfile: 'Profile',
    navWallet: 'Wallet',
    navSettings: 'Settings',
    navApply: 'Apply',
    searchPlaceholder: 'Search Pakistani services',
    voiceLabel: 'Voice',
  },
  ur: {
    account: 'Account',
    login: 'Login',
    signup: 'Sign up',
    continueWithGoogle: 'Google se continue',
    campusVerification: 'Student verification',
    verify: 'Verify',
    resendOtp: 'OTP dobara bhejain',
    heroTitle: 'Pakistan ke trusted talent ko hire karein.',
    heroSubtitle:
      'UniHire sirf Pakistani users ke liye hai. Yahan local buyers FSc aur us se upar verified students ko hire kar sakte hain.',
    createGigTitle: 'Trusted student gig banayein',
    profileTitle: 'Apna trusted Pakistani student profile banayein',
    navMarketplace: 'Marketplace',
    navSaved: 'Saved',
    navCreate: 'Create Gig',
    navDashboard: 'Dashboard',
    navOrders: 'Orders',
    navMessages: 'Messages',
    navProfile: 'Profile',
    navWallet: 'Wallet',
    navSettings: 'Settings',
    navApply: 'Apply',
    searchPlaceholder: 'Pakistani services search karein',
    voiceLabel: 'Voice',
  },
  ps: {
    account: 'Account',
    login: 'Login',
    signup: 'Sign up',
    continueWithGoogle: 'Google sara continue',
    campusVerification: 'Student verification',
    verify: 'Verify',
    resendOtp: 'OTP bya waligai',
    heroTitle: 'Da Pakistan trusted talent hire kai.',
    heroSubtitle:
      'UniHire yaw Pakistan-only marketplace dai. Local buyers da FSc aw hagha na porta verified students hire kawali shi.',
    createGigTitle: 'Trusted student gig jor kai',
    profileTitle: 'Khpal trusted Pakistani student profile jor kai',
    navMarketplace: 'Marketplace',
    navSaved: 'Saved',
    navCreate: 'Create Gig',
    navDashboard: 'Dashboard',
    navOrders: 'Orders',
    navMessages: 'Messages',
    navProfile: 'Profile',
    navWallet: 'Wallet',
    navSettings: 'Settings',
    navApply: 'Apply',
    searchPlaceholder: 'Pakistani services search kai',
    voiceLabel: 'Voice',
  },
};

const voiceText = {
  en: 'UniHire is for Pakistani buyers and Pakistani student sellers from FSc level and above.',
  ur: 'UniHire sirf Pakistani buyers aur Pakistani student sellers ke liye hai. FSc aur us se upar students apply kar sakte hain.',
  ps: 'UniHire sirf da Pakistani buyers aw Pakistani student sellers lapara dai. FSc aw hagha na porta students apply kawali shi.',
};

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('unihire.lang') || 'en');

  const setLang = (nextLang) => {
    setLangState(nextLang);
    localStorage.setItem('unihire.lang', nextLang);
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text || voiceText[lang]);
    utterance.lang = lang === 'en' ? 'en-PK' : 'ur-PK';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const t = useMemo(() => (key) => translations[lang]?.[key] || translations.en[key] || key, [lang]);

  return <LangContext.Provider value={{ lang, setLang, speak, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
