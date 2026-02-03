import { createContext, useContext, ReactNode } from 'react';

interface Translations {
  footer: {
    about: string;
    description: string;
    privacyFocused: string;
    noDataCollection: string;
    clientSideProcessing: string;
    contact: string;
    github: string;
    instagram: string;
    copyright: string;
    madeWith: string;
  };
}

const translations: Translations = {
  footer: {
    about: 'About this project',
    description: 'Baseline is a decision boundary system for freelancers that defines the minimum acceptable price for a project, establishing the non-negotiable core of your pricing.',
    privacyFocused: 'Privacy-focused',
    noDataCollection: 'No data collection',
    clientSideProcessing: 'Client-side processing',
    contact: 'Contact',
    github: 'View on GitHub',
    instagram: 'Follow on Instagram',
    copyright: '© 2025 Baseline. Open source project.',
    madeWith: 'Made with'
  }
};

const LanguageContext = createContext<{ t: Translations }>({ t: translations });

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <LanguageContext.Provider value={{ t: translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
