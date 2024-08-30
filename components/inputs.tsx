import { InputHTMLAttributes } from "react";

interface IInputProps {
  errors?: string[];
  name: string;
}

export default function Input({
  errors,
  name,
  ...rest
}: IInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <input
        className="p-3 bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
        {...rest}
        name={name}
      />
      {errors?.map((error, index) => (
        <span key={`${error}_${index}`} className="text-red-500 font-medium">
          {error}
        </span>
      ))}
    </div>
  );
}
