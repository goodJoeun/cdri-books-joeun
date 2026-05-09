import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const textVariants = cva('', {
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      subTitle: 'text-text-subTitle',
      accent: 'text-palette-primary',
      muted: 'text-gray-600',
      error: 'text-red-500',
    },
  },
});

type TextElement = 'span' | 'p' | 'label' | 'div';

interface TextProps
  extends
    Omit<HTMLAttributes<HTMLElement>, 'children' | 'color'>,
    VariantProps<typeof textVariants> {
  as?: TextElement;
  text: ReactNode;
}

export default function Text({
  as: Tag = 'span',
  size,
  weight,
  color,
  text,
  className,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(textVariants({ size, weight, color }), className)}
      {...props}
    >
      {text}
    </Tag>
  );
}
