import React from 'react';
import { X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isClosing: boolean;
}

export function PrivacyModal({ isOpen, onClose, isClosing }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 flex items-center justify-center px-[20px] z-50 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} 
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-[14px] p-[40px] max-w-[900px] w-full max-h-[85vh] overflow-y-auto ${isClosing ? 'animate-slide-down' : 'animate-slide-up'} relative`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[20px] right-[20px] text-[#878787] hover:text-black transition-colors cursor-pointer bg-white rounded-full p-[8px] z-10"
          aria-label="Close"
        >
          <X className="w-[20px] h-[20px]" />
        </button>

        <h1 className="font-['Inter'] font-semibold text-[28px] leading-[36px] text-black mb-[24px] pr-[40px]">
          Privacy Policy
        </h1>

        <div className="flex flex-col gap-[20px] font-['Inter'] text-[14px] leading-[22px] text-[#333]">
          <p className="text-[#878787] text-[13px]">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              1. Information We Collect
            </h2>
            <p className="mb-[10px]">
              We collect minimal information necessary to provide our service:
            </p>
            <ul className="list-disc pl-[24px] space-y-[6px]">
              <li><strong>Account Information:</strong> Email address and name for authentication purposes.</li>
              <li><strong>Session Data:</strong> We use cookies and local storage to maintain your active session.</li>
              <li><strong>License Keys:</strong> If you provide a license key, it's stored to verify your access level.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-[24px] space-y-[6px]">
              <li>To provide and maintain our pricing calculation service.</li>
              <li>To authenticate your account and maintain your session.</li>
              <li>To enforce fair usage limits for our free tier.</li>
              <li>To improve our service based on basic usage patterns.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              3. What We Don't Collect
            </h2>
            <p className="mb-[10px]">
              Your privacy is important to us. We explicitly do not collect:
            </p>
            <ul className="list-disc pl-[24px] space-y-[6px]">
              <li>Personal usage data or browsing activity.</li>
              <li>Information about your projects or calculations.</li>
              <li>Any personally identifiable information beyond what's necessary for authentication.</li>
              <li>Third-party tracking or analytics data.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              4. Data Storage and Security
            </h2>
            <p>
              Your data is stored securely using Supabase, a trusted cloud database platform. We implement industry-standard security measures including encrypted password storage and secure HTTPS connections for all data transmission.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              5. Data Sharing
            </h2>
            <p>
              We do not share, sell, or disclose your personal information to third parties under any circumstances. Your data is used exclusively for providing our service to you.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              6. Your Rights
            </h2>
            <p className="mb-[10px]">
              You have the right to:
            </p>
            <ul className="list-disc pl-[24px] space-y-[6px]">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              7. Data Retention
            </h2>
            <p>
              We retain your account information for as long as your account is active. If you request account deletion, we will remove your personal information within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              8. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@baseline.app" className="text-black underline hover:no-underline">
                privacy@baseline.app
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}