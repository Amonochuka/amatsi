import { InputHTMLAttributes, SelectHTMLAttributes } from 'react';

interface BaseProps {
  label?: string;
  hint?: string;
}

interface TextInputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  type?: string;
  options?: undefined;
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends BaseProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'type'> {
  type: 'select';
  options: SelectOption[];
}

type InputProps = TextInputProps | SelectInputProps;

export function Input(props: InputProps) {
  const { label, hint, className = '', ...rest } = props;
  const id = (rest as { id?: string }).id;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-stone-600 mb-1.5">
          {label}
        </label>
      )}
      {props.type === 'select' ? (
        <select
          id={id}
          className={`w-full border border-stone-300 rounded-lg py-2 px-3 text-sm bg-white outline-none focus:border-emerald-600 ${className}`}
          {...(rest as SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {props.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          className={`w-full border border-stone-300 rounded-lg py-2 px-3 text-sm outline-none focus:border-emerald-600 ${className}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {hint && <p className="text-xs text-stone-400 mt-1">{hint}</p>}
    </div>
  );
}
