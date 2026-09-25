import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "celeste" | "amarillo" | "neutral";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "celeste",
  className = "",
}) => {
  const variants = {
    celeste: "bg-celeste-muted/10 text-celeste-muted border-celeste-muted/30",
    amarillo: "bg-amarillo-muted/10 text-amarillo-muted border-amarillo-muted/30",
    neutral: "bg-gris-surface text-texto-sub border-gris-border",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
