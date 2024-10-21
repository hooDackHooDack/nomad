import React, { useState } from 'react';
import {
  UseFormRegister,
  FieldError,
  RegisterOptions,
  FieldValues,
  Path,
} from 'react-hook-form';
import OpenEye from '/public/icons/input/visibility_on.svg';
import CloseEye from '/public/icons/input/visibility_off.svg';

type InputType = 'text' | 'email' | 'password' | 'textarea';

type InputProps<TFormValues extends FieldValues> = {
  label: string;
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  error?: FieldError;
  type: InputType;
  placeholder?: string;
  validationRule?: RegisterOptions<TFormValues, Path<TFormValues>>;
};

function FormInput<TFormValues extends FieldValues>({
  label,
  name,
  register,
  type,
  error,
  placeholder,
  validationRule,
}: InputProps<TFormValues>) {
  const [showPassword, setShowPassword] = useState(false);

  const inputClassName = `border w-full px-4 ${
    error
      ? 'border-red focus:border-red focus:outline-none focus:ring-1 focus:ring-red'
      : 'border-gray-500 focus:border-green-dark focus:outline-none focus:ring-1 focus:ring-green-dark'
  }`;

  const renderInput = () => {
    const commonProps = {
      ...register(name, validationRule),
      placeholder,
      className: `${inputClassName} ${type === 'textarea' ? 'h-32 py-2' : 'h-14'}`,
      id: name,
    };

    if (type === 'textarea') {
      return <textarea {...commonProps} />;
    } else {
      return (
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          {...commonProps}
        />
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex-col">
      <div className="flex flex-col gap-2 relative">
        <label htmlFor={name} className="text-lg font-regular text-black">
          {label}
        </label>
        {renderInput()}
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-[60px] transform -translate-y-1/2 cursor-pointer border-none"
          >
            {showPassword ? <OpenEye /> : <CloseEye />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-red text-sm">{error.message}</p>}
    </div>
  );
}

export default FormInput;
