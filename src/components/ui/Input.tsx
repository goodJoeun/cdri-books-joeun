import { cva, type VariantProps } from 'class-variance-authority';
import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const inputVariants = cva('outline-none', {
  variants: {
    variant: {
      default:
        'text-base font-medium text-gray-800 placeholder:text-text-subTitle placeholder:text-base placeholder:font-medium',
      sm: 'text-sm text-gray-800 bg-transparent placeholder:text-gray-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

export default function Input({ variant, className, ...props }: InputProps) {
  return (
    <input className={cn(inputVariants({ variant }), className)} {...props} />
  );
}
