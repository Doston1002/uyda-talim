import { ReactNode } from 'react';
import { simInput, simLabel } from '../sim-ui';

interface SimFormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  hint?: string;
}

export function SimFormField({ label, required, children, className = '', hint }: SimFormFieldProps) {
  return (
    <div className={className}>
      <label className={simLabel}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
    </div>
  );
}

export { simInput as simBaseInputClass };
