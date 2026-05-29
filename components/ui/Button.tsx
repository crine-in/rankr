import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl border-2 transition-all duration-150 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-2xl",
    lg: "px-8 py-4 text-lg rounded-3xl",
  };

  const variants = {
    // Primary Vibrant Indigo with thick 3D bottom border
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-700 active:border-b-0 hover:translate-y-[-2px] active:translate-y-[4px] shadow-[0_4px_0_0_#4338ca] hover:shadow-[0_6px_0_0_#4338ca] active:shadow-none focus:ring-indigo-500",
    // Secondary Warm Amber
    secondary: "bg-amber-500 hover:bg-amber-400 text-white border-amber-600 active:border-b-0 hover:translate-y-[-2px] active:translate-y-[4px] shadow-[0_4px_0_0_#d97706] hover:shadow-[0_6px_0_0_#d97706] active:shadow-none focus:ring-amber-500",
    // Success Emerald Green
    success: "bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-600 active:border-b-0 hover:translate-y-[-2px] active:translate-y-[4px] shadow-[0_4px_0_0_#059669] hover:shadow-[0_6px_0_0_#059669] active:shadow-none focus:ring-emerald-500",
    // Outline style
    outline: "bg-white hover:bg-slate-50 text-slate-800 border-slate-200 active:border-b-0 hover:translate-y-[-2px] active:translate-y-[4px] shadow-[0_4px_0_0_#e2e8f0] hover:shadow-[0_6px_0_0_#e2e8f0] active:shadow-none dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800 dark:shadow-[0_4px_0_0_#27272a] dark:hover:shadow-[0_6px_0_0_#27272a]",
    // Flat ghost style
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 border-transparent hover:text-slate-900 focus:ring-slate-500 active:translate-y-[1px] dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200",
  };

  const widthStyle = fullWidth ? "w-full flex" : "";

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
