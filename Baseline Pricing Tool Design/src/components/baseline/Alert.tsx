import svgPathsWarning from '../../imports/svg-3j0m41bjuy';
import svgPathsSuccess from '../../imports/svg-a2co0yczdw';
import svgPathsError from '../../imports/svg-u82jyfdxsh';
import svgPathsInfo from '../../imports/svg-ueru4kct6p';

interface AlertProps {
  type: 'warning' | 'success' | 'error' | 'info';
  children: React.ReactNode;
  onClose?: () => void;
}

export function Alert({ type, children, onClose }: AlertProps) {
  if (type === 'warning') {
    return (
      <div className="bg-[#fff8e1] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[8px]">
        <div aria-hidden="true" className="absolute border border-[#ffe082] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="relative shrink-0 size-[16px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <g clipPath="url(#clip0_25_6071)">
              <path clipRule="evenodd" d={svgPathsWarning.p2647eb00} fill="#F57C00" fillRule="evenodd" />
            </g>
            <defs>
              <clipPath id="clip0_25_6071">
                <rect fill="white" height="16" width="16" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <p className="font-['Inter'] font-normal leading-[20px] not-italic relative text-[#f57c00] text-[12px] flex-1 whitespace-pre-wrap">
          {children}
        </p>
      </div>
    );
  }

  if (type === 'success') {
    return (
      <div className="bg-[#edffeb] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[8px]">
        <div aria-hidden="true" className="absolute border border-[#d3f2c7] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="relative shrink-0 size-[16px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <g clipPath="url(#clip0_25_6074)">
              <path clipRule="evenodd" d={svgPathsSuccess.p2647eb00} fill="#4A901B" fillRule="evenodd" />
            </g>
            <defs>
              <clipPath id="clip0_25_6074">
                <rect fill="white" height="16" width="16" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <p className="font-['Inter'] font-normal leading-[20px] not-italic relative text-[#4a901b] text-[12px] flex-1 whitespace-pre-wrap">
          {children}
        </p>
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="bg-[#fef0f0] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[8px]">
        <div aria-hidden="true" className="absolute border border-[#ffcece] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="relative shrink-0 size-[16px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <path clipRule="evenodd" d={svgPathsError.p3db0ef00} fill="#730A0A" fillRule="evenodd" />
          </svg>
        </div>
        <div className="font-['Inter'] font-normal leading-[20px] not-italic relative text-[#730a0a] text-[12px] flex-1 whitespace-pre-wrap">
          {children}
        </div>
      </div>
    );
  }

  if (type === 'info') {
    return (
      <div className="bg-[#f4f0fe] content-stretch flex gap-[8px] items-start p-[12px] relative rounded-[8px]">
        <div aria-hidden="true" className="absolute border border-[#dcceff] border-solid inset-0 pointer-events-none rounded-[8px]" />
        <div className="relative shrink-0 size-[16px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
            <g clipPath="url(#clip0_25_6080)">
              <path d={svgPathsInfo.p39ee6532} stroke="#5D38B7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              <path d="M8 5.33333V8" stroke="#5D38B7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              <path d="M8 10.6667H8.00667" stroke="#5D38B7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
            </g>
            <defs>
              <clipPath id="clip0_25_6080">
                <rect fill="white" height="16" width="16" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="flex-1 font-['Inter'] font-normal leading-[20px] not-italic relative text-[#5d38b7] text-[12px] whitespace-pre-wrap">
          {children}
        </div>
      </div>
    );
  }

  return null;
}