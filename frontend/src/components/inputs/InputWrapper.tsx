import { FieldError } from 'react-hook-form';
import clsx from 'clsx';
import { ReactNode } from 'react';

type TInputWrapper = {
  children: ReactNode;
  inputName: string;
  label: string;
  error: FieldError | undefined;
};
export const InputWrapper = ({ children, inputName, label, error }: TInputWrapper) => {
  return (
    <div className={clsx('flex flex-col gap-1', !error && 'pb-5')}>
      <label htmlFor={inputName} className="text-body2 text-gray-800">
        {label}
      </label>
      {children}
      {error && <p className="text-body2 text-error">{error.message}</p>}
    </div>
  );
};
