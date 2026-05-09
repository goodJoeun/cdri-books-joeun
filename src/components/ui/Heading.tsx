import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const headingVariants = cva('text-text-primary', {
  variants: {
    level: {
      h1: 'text-xl font-bold',
      h2: 'text-lg font-bold',
      h3: 'text-base font-bold',
      h4: 'text-base font-semibold',
      h5: 'text-sm font-semibold',
      h6: 'text-xs font-semibold',
    },
  },
  defaultVariants: {
    level: 'h1',
  },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps
  extends
    Omit<HTMLAttributes<HTMLHeadingElement>, 'children'>,
    VariantProps<typeof headingVariants> {
  level?: HeadingLevel;
  text: ReactNode;
}

export default function Heading({
  level = 'h1',
  text,
  className,
  ...props
}: HeadingProps) {
  const Tag = level;
  return (
    <Tag className={cn(headingVariants({ level }), className)} {...props}>
      {text}
    </Tag>
  );
}
