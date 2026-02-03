import { Github, Instagram } from 'lucide-react';
import { Button } from '../ui/button';
import { useLanguage } from '../LanguageProvider';
import svgPaths from '../../imports/svg-zztqszajp3';
import { useEffect } from 'react';

interface FooterProps {
  onPrivacyClick?: () => void;
  onTermsClick?: () => void;
}

export function Footer({ onPrivacyClick, onTermsClick }: FooterProps) {
  const { t } = useLanguage();

  // Load Contra widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://contra.com/static/embed/sdk.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove script when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleGitHubClick = () => {
    window.open('https://github.com/antomarinooo/baseline', '_blank');
  };

  const handleContraClick = () => {
    window.open('https://contra.com/antomarino/work', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/fusefolio', '_blank');
  };

  return (
    <footer className="mt-12 lg:mt-16 pb-8 lg:pb-12">
      <div className="max-w-[909px] mx-auto px-[20px]">
        <div className="flex flex-col gap-8">
          {/* Main Footer Content */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start border-b border-border pb-8">
            {/* About Section */}
            <div className="flex-1 max-w-lg">
              <h3 className="font-medium text-base mb-3">{t.footer.about}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t.footer.description}
              </p>
              
              {/* Feature bullets */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-muted-foreground">{t.footer.privacyFocused}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-muted-foreground">{t.footer.noDataCollection}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-muted-foreground">{t.footer.clientSideProcessing}</span>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col gap-4">
              <h3 className="font-medium text-base">{t.footer.contact}</h3>
              <div className="flex flex-col gap-[8px]">
                {/* GitHub Button */}
                <button
                  onClick={handleGitHubClick}
                  className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full sm:w-[180px] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center pl-[11px] pr-px py-px relative size-full">
                    <div className="relative shrink-0 size-[16px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <path d={svgPaths.p2cd3d080} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.p28ae6680} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      </svg>
                    </div>
                    <p className="font-['Inter'] font-normal leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">View on GitHub</p>
                  </div>
                </button>
                
                {/* Contra Button */}
                
                
                {/* Instagram Button */}
                <button
                  onClick={handleInstagramClick}
                  className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full sm:w-[180px] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[11px] py-px relative size-full">
                    <div className="relative shrink-0 size-[16px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <g clipPath="url(#clip0_25_6052)">
                          <path d={svgPaths.p22916300} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          <path d={svgPaths.p22f6cc00} stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          <path d="M11.6667 4.33333H11.6733" stroke="#0A0A0A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        </g>
                        <defs>
                          <clipPath id="clip0_25_6052">
                            <rect fill="white" height="16" width="16" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <p className="font-['Inter'] font-normal leading-[20px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] text-center">Instagram profile</p>
                  </div>
                </button>

                {/* Contra Hire Me Widget */}
                <div className="w-full sm:w-[180px]">
                  <div className="contra-hire-me-button" data-analyticsuserid="0a6bd983-7334-4e0f-a94b-27721b37461d" data-theme="light" data-username="antomarino"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {t.footer.copyright}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <span className="text-xs text-muted-foreground">{t.footer.madeWith}</span>
                <div className="flex gap-4 items-center flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.36-.034-.47 0-.92.01-1.36.034.44-.572.895-1.096 1.36-1.564zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.36.034.47 0 .92-.01 1.36-.034-.44.572-.895 1.095-1.36 1.56-.455-.42-.32-.846-.36-1.56z"/>
                    </svg>
                    <span className="text-xs text-muted-foreground">React</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/>
                    </svg>
                    <span className="text-xs text-muted-foreground">Tailwind CSS</span>
                  </div>
                  {/* Shadcn credit block added as requested */}
                  
                  {/* Privacy & Terms Links */}
                  <span className="text-xs text-muted-foreground">•</span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onPrivacyClick?.();
                    }}
                    className="text-xs text-muted-foreground hover:text-black transition-colors underline cursor-pointer bg-transparent border-0 p-0 font-['Inter']"
                  >
                    Privacy
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      onTermsClick?.();
                    }}
                    className="text-xs text-muted-foreground hover:text-black transition-colors underline cursor-pointer bg-transparent border-0 p-0 font-['Inter']"
                  >
                    Terms
                  </button>
                </div>
              </div>
              
              {/* Version Number */}
              <span className="text-xs text-muted-foreground">v0.9.0 (beta)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}