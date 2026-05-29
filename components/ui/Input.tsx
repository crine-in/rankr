import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-base font-bold text-slate-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-5 py-3 text-base font-bold bg-white text-slate-800 border-2 border-slate-200 rounded-2xl outline-none transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-950/30 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-100 dark:border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm font-bold text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-base font-bold text-slate-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          id={id}
          className={`w-full px-5 py-3 text-base font-bold bg-white text-slate-800 border-2 border-slate-200 rounded-2xl outline-none appearance-none cursor-pointer transition-all focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800 dark:focus:border-indigo-500 dark:focus:ring-indigo-950/30 ${
            error ? "border-red-500 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="font-bold">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 dark:text-zinc-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm font-bold text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
