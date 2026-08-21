import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-emerald-900 text-white hover:bg-emerald-800',
    secondary: 'border border-stone-300 text-stone-700 hover:bg-stone-50',
  };
  return (
    <button
      className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
