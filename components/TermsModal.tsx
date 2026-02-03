import React from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isClosing: boolean;
}

export function TermsModal({ isOpen, onClose, isClosing }: TermsModalProps) {
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
          Terms of Use
        </h1>

        <div className="flex flex-col gap-[20px] font-['Inter'] text-[14px] leading-[22px] text-[#333]">
          <p className="text-[#878787] text-[13px]">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Baseline, you accept and agree to be bound by the terms and conditions of this agreement. If you do not agree to these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              2. Description of Service
            </h2>
            <p>
              Baseline is a pricing calculation tool designed for freelancers to determine minimum acceptable project prices. The service provides structured inputs with deterministic logic to calculate baseline pricing recommendations.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              3. User Accounts
            </h2>
            <p className="mb-[10px]">
              When creating an account, you agree to:
            </p>
            <ul className="list-disc pl-[24px] space-y-[6px]">
              <li>Provide accurate and complete information.</li>
              <li>Maintain the security of your password and account.</li>
              <li>Create only one account per person.</li>
              <li>Not share your account credentials with others.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              4. Usage Limits and Fair Use
            </h2>
            <p className="mb-[10px]">
              We offer different service tiers with usage limits:
            </p>
            <ul className="list-disc pl-[24px] space-y-[6px]">
              <li><strong>Preview Mode:</strong> 5 calculations without an account.</li>
              <li><strong>Free Account:</strong> 5 calculations per account.</li>
              <li><strong>Full License:</strong> Unlimited calculations.</li>
            </ul>
            <p className="mt-[10px]">
              Creating multiple accounts to bypass usage limits is a violation of these terms and may result in account suspension.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              5. Prohibited Activities
            </h2>
            <p className="mb-[10px]">
              You agree not to:
            </p>
            <ul className="list-disc pl-[24px] space-y-[6px]">
              <li>Use the service for any illegal purpose.</li>
              <li>Attempt to bypass usage limits through technical means.</li>
              <li>Create multiple accounts to abuse the free tier.</li>
              <li>Reverse engineer or attempt to extract the source code.</li>
              <li>Use automated tools or scripts to access the service.</li>
              <li>Interfere with or disrupt the service or servers.</li>
              <li>Share or resell access to your license.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              6. License Keys
            </h2>
            <p>
              If you purchase a full license, your license key is personal and non-transferable. You may not share, sell, or distribute your license key to others.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              7. Disclaimer of Warranties
            </h2>
            <p>
              Baseline is provided "as is" without warranties of any kind. The pricing calculations are recommendations only and should not be considered professional financial advice. You are solely responsible for your pricing decisions.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              8. Limitation of Liability
            </h2>
            <p>
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. This includes any loss of profits, revenue, or data.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              9. Data Storage and Security
            </h2>
            <p>
              We use Supabase for secure authentication and data storage. Your credentials are stored securely with industry-standard encryption. We are not responsible for unauthorized access resulting from your failure to protect your account credentials.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              10. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violations of these terms, including but not limited to abuse of usage limits or creation of multiple accounts.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              11. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any significant changes via email or through the application.
            </p>
          </section>

          <section>
            <h2 className="font-medium text-[18px] leading-[26px] text-black mb-[10px]">
              12. Contact Information
            </h2>
            <p>
              For questions about these Terms of Use, please contact us at{' '}
              <a href="mailto:legal@baseline.app" className="text-black underline hover:no-underline">
                legal@baseline.app
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}