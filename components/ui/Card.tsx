import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "flat" | "elevated" | "playful";
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "playful",
  className = "",
  ...props
}) => {
  const baseStyles = "rounded-3xl border-2 border-slate-200 bg-white p-6 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-950";
  
  const variants = {
    flat: "border-slate-200 dark:border-zinc-800",
    elevated: "shadow-lg shadow-slate-100 dark:shadow-none border-slate-200 dark:border-zinc-800",
    // Premium Duolingo-style 3D shadow
    playful: "shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none dark:shadow-[4px_4px_0px_0px_rgba(250,250,250,0.1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(250,250,250,0.1)]",
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
