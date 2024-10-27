import {
  UseFormRegister,
  FieldError,
  RegisterOptions,
  FieldValues,
  Path,
} from 'react-hook-form';

interface RadioOption {
  value: string;
  label: string;
}

type RadioGroupInputProps<TFormValues extends FieldValues> = {
  label: string;
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  error?: FieldError;
  options: RadioOption[];
  validationRule?: RegisterOptions<TFormValues, Path<TFormValues>>;
};

function RadioGroupInput<TFormValues extends FieldValues>({
  label,
  name,
  register,
  error,
  options,
  validationRule,
}: RadioGroupInputProps<TFormValues>) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-lg font-regular text-black">{label}</label>
      <div className="flex gap-2 flex-wrap">
        {options.map((option) => (
          <label key={option.value} className="relative">
            <input
              type="radio"
              value={option.value}
              {...register(name, validationRule)}
              className="peer hidden"
            />
            <div
              className="peer-checked:bg-green-dark peer-checked:text-white 
              peer-checked:border-green-light cursor-pointer px-4 py-2 rounded-full
              border border-gray-300 transition-all duration-200 hover:border-green-dark"
            >
              {option.label}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-red text-sm">{error.message}</p>}
    </div>
  );
}

export default RadioGroupInput;
