import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CookieConsentProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

export function CookieConsent({ onPrivacyClick, onTermsClick }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('baseline_cookie_consent');
    if (!hasConsented) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('baseline_cookie_consent', 'true');
    closeBanner();
  };

  const handleDecline = () => {
    localStorage.setItem('baseline_cookie_consent', 'declined');
    closeBanner();
  };

  const closeBanner = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowBanner(false);
      setIsClosing(false);
    }, 200);
  };

  if (!showBanner) return null;

  return (
    <div 
      className={`fixed bottom-[20px] left-[20px] right-[20px] md:left-auto md:right-[20px] md:max-w-[420px] bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-[20px] z-50 ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}
    >
      <button
        onClick={closeBanner}
        className="absolute top-[16px] right-[16px] text-[#878787] hover:text-black transition-colors cursor-pointer"
        aria-label="Close"
      >
        <X className="w-[16px] h-[16px]" />
      </button>

      <div className="flex flex-col gap-[16px] pr-[24px]">
        <div className="flex flex-col gap-[8px]">
          <h3 className="font-['Inter'] font-medium text-[16px] leading-[24px] text-black">
            Cookie Notice
          </h3>
          <p className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
            We use cookies and device fingerprinting to prevent abuse and ensure fair usage of our free tier. 
            This helps us track usage limits across accounts. By continuing, you agree to our{' '}
            <button 
              onClick={(e) => {
                e.preventDefault();
                onPrivacyClick();
              }}
              className="text-black underline hover:no-underline cursor-pointer bg-transparent border-0 p-0 font-['Inter'] font-normal text-[13px]"
            >
              Privacy Policy
            </button>
            {' '}and{' '}
            <button 
              onClick={(e) => {
                e.preventDefault();
                onTermsClick();
              }}
              className="text-black underline hover:no-underline cursor-pointer bg-transparent border-0 p-0 font-['Inter'] font-normal text-[13px]"
            >
              Terms of Use
            </button>.
          </p>
        </div>

        <div className="flex gap-[12px]">
          <button
            onClick={handleDecline}
            className="flex-1 bg-white text-black border border-[rgba(0,0,0,0.1)] rounded-[8px] py-[8px] px-[16px] font-['Inter'] font-normal text-[13px] leading-[20px] hover:bg-[#f9f9f9] transition-colors cursor-pointer"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 bg-black text-white rounded-[8px] py-[8px] px-[16px] font-['Inter'] font-medium text-[13px] leading-[20px] hover:bg-[#333] transition-colors cursor-pointer"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}