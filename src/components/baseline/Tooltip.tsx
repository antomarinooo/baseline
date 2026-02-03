import { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="ml-[6px] text-[#878787] hover:text-black transition-colors cursor-help"
      >
        <Info className="w-[14px] h-[14px]" />
      </button>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[8px] px-[12px] py-[8px] bg-black text-white rounded-[6px] text-[12px] leading-[16px] w-[240px] z-10 pointer-events-none">
          <p className="whitespace-normal break-words">{text}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black"></div>
        </div>
      )}
    </div>
  );
}
