import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline'
}

export default function Button({ variant = 'primary', className = '', children, style, ...props }: ButtonProps) {
  const base = 'rounded text-sm font-medium transition-colors disabled:opacity-50'
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} style={{ width: '115px', height: '48px', borderRadius:'8px', ...style }} {...props}>
      {children}
    </button>
  )
}
