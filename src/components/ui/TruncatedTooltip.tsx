'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/cn';

export default function TruncatedTooltip({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  const showTooltip = () => {
    const el = ref.current;
    if (el && el.scrollWidth > el.clientWidth) {
      const rect = el.getBoundingClientRect();
      setTooltip({ x: rect.left, y: rect.bottom + 4 });
    }
  };

  return (
    <>
      <span
        ref={ref}
        className={cn('truncate min-w-0 cursor-default', className)}
        onMouseEnter={showTooltip}
        onMouseLeave={() => setTooltip(null)}
      >
        {text}
      </span>
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-gray-800 text-white text-xs rounded shadow-lg px-2 py-1 whitespace-nowrap"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          {text}
        </div>
      )}
    </>
  );
}
