interface SegmentedControlOption {
  value: string;
  label: string;
  helper?: string;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="flex flex-wrap gap-[8px]">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onChange(option.value);
            }
          }}
          className={`
            px-[14px] py-[10px] rounded-[8px] border border-solid transition-all duration-200
            ${value === option.value 
              ? 'bg-[#f5f5f5] text-black border-[#ececec] hover:bg-[#ececec]' 
              : 'bg-white border-[rgba(0,0,0,0.1)] text-black hover:bg-[#f9f9f9] hover:border-[rgba(0,0,0,0.2)]'}
            focus:outline-none focus:ring-2 focus:ring-[#ececec] focus:ring-offset-2
          `}
          role="radio"
          aria-checked={value === option.value}
          tabIndex={0}
        >
          <div className="flex flex-col items-start gap-[2px]">
            <span className={`font-['Inter'] text-[14px] leading-[20px] whitespace-nowrap ${
              value === option.value ? 'font-medium' : 'font-normal'
            }`}>
              {option.label}
            </span>
            {option.helper && (
              <span className={`font-['Inter'] font-normal text-[12px] leading-[16px] whitespace-nowrap ${
                value === option.value ? 'text-[#737373]' : 'text-[#878787]'
              }`}>
                {option.helper}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}