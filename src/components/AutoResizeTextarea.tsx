import React, { useEffect, useLayoutEffect, useRef } from 'react';

export interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

export const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  value,
  minRows = 2,
  className = '',
  onChange,
  rows,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to correctly read the natural scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate minimum height based on minRows or rows prop (fallback ~22px per row)
    const effectiveMinRows = rows ? Number(rows) : minRows;
    const baseMinHeight = effectiveMinRows * 24;
    
    const computedHeight = Math.max(textarea.scrollHeight, baseMinHeight);
    textarea.style.height = `${computedHeight + 2}px`;
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [value]);

  // Adjust on initial load and window resize
  useEffect(() => {
    const timer = setTimeout(() => {
      adjustHeight();
    }, 50);

    const handleResize = () => {
      adjustHeight();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => {
        onChange?.(e);
        adjustHeight();
      }}
      rows={rows || minRows}
      className={`overflow-hidden resize-none leading-relaxed transition-[height] duration-75 ${className}`}
      {...props}
    />
  );
};
