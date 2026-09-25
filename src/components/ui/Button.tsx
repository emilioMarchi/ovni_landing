import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-celeste-muted/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const variants = {
    primary:
      "bg-celeste-muted text-gris-oscuro hover:bg-opacity-90 font-semibold shadow-lg shadow-celeste-muted/10",
    secondary:
      "bg-amarillo-muted text-gris-oscuro hover:bg-opacity-90 font-semibold shadow-lg shadow-amarillo-muted/10",
    outline:
      "border border-gris-border text-texto-main hover:bg-gris-surface hover:border-celeste-muted/50",
    ghost: "text-texto-sub hover:text-texto-main hover:bg-gris-surface/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
