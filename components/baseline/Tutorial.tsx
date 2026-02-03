import { useState } from 'react';

const steps = [
  {
    number: 1,
    title: 'Define project context',
    description: 'Start by selecting your project type, size, timeline pressure, and revisions model. These inputs establish the baseline scope.'
  },
  {
    number: 2,
    title: 'Set freelancer context',
    description: 'Specify your experience level and current capacity. This adjusts the baseline to reflect your professional standing and availability.'
  },
  {
    number: 3,
    title: 'Calculate baseline',
    description: 'Click "Get Results" to see your minimum defensible price. The breakdown shows how each factor contributes to the final number.'
  },
  {
    number: 4,
    title: 'Use advanced options (optional)',
    description: 'Fine-tune the base price and multipliers to match your specific market, location, or pricing strategy.'
  },
  {
    number: 5,
    title: 'Interpret and apply',
    description: 'Use this baseline as your floor—never go below it. Add your profit margin and value-based pricing on top of this number.'
  }
];

export function Tutorial({ isExpanded }: { isExpanded: boolean }) {
  if (!isExpanded) return null;

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.1)] border-solid rounded-[14px] p-[24px] flex flex-col gap-[20px]">
      <h2 className="font-['Inter'] font-medium text-[24px] leading-[24px] text-black">
        How to use Baseline
      </h2>
      
      <div className="flex flex-col gap-[16px]">
        {steps.map((step) => (
          <div key={step.number} className="flex gap-[12px] items-start">
            <div className="w-[24px] h-[24px] rounded-full bg-[#ececec] flex items-center justify-center shrink-0">
              <span className="font-['Inter'] font-medium text-[13px] text-black">
                {step.number}
              </span>
            </div>
            <div className="flex flex-col gap-[4px] flex-1">
              <h3 className="font-['Inter'] font-medium text-[14px] leading-[20px] text-black">
                {step.title}
              </h3>
              <p className="font-['Inter'] font-normal text-[13px] leading-[20px] text-[#878787]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
