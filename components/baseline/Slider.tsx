import { useRef, useState, useEffect } from 'react';

interface SliderProps {
  steps: string[];
  value: number;
  onChange: (value: number) => void;
}

export function Slider({ steps, value, onChange }: SliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValueFromPosition(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValueFromPosition(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      updateValueFromPosition(e.touches[0].clientX);
    }
  };

  const updateValueFromPosition = (clientX: number) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round(percentage * (steps.length - 1));
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  // Add event listeners for drag
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="flex flex-col gap-[12px] w-full">
      {/* Current Value Label */}
      <div className="flex justify-between items-center">
        <span className="font-['Inter'] font-medium text-[14px] leading-[20px] text-black">
          {steps[value]}
        </span>
      </div>
      
      {/* Slider */}
      <div 
        ref={sliderRef}
        className="flex gap-[8px] items-center w-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex-1 h-[40px] flex flex-col gap-[12px] items-center pointer-events-none group"
            role="radio"
            aria-checked={index === value}
            aria-label={step}
          >
            <div
              className={`h-[8px] rounded-[4px] w-full transition-all duration-200 ${
                index <= value ? 'bg-[#6b6b6b]' : 'bg-[#ededed]'
              } group-hover:opacity-80`}
            />
            <span
              className={`font-['Inter'] font-normal leading-[20px] text-[13px] transition-colors ${
                index === value ? 'text-black font-medium' : 'text-[#878787]'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}