import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-stone-600 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full border border-stone-300 rounded-lg py-2 px-3 text-sm outline-none focus:border-emerald-500 ${className}`}
        {...props}
      />
    </div>
  );
}
