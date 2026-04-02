import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rect",
  width,
  height,
}) => {
  const baseStyles = "relative overflow-hidden bg-white/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";
  
  const variantStyles = {
    rect: "rounded-md",
    circle: "rounded-full",
    text: "rounded h-4 w-full",
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={style}
    />
  );
};

export const SkeletonGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  return <div className={`flex flex-col gap-4 ${className}`}>{children}</div>;
};

export const CardSkeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`glass-panel p-6 rounded-2xl flex flex-col gap-4 ${className}`}>
      <div className="flex items-start justify-between">
        <Skeleton variant="circle" width={40} height={40} />
        <Skeleton width={100} height={20} />
      </div>
      <SkeletonGroup>
        <Skeleton width="80%" height={24} />
        <Skeleton width="100%" height={16} />
        <Skeleton width="90%" height={16} />
      </SkeletonGroup>
      <div className="mt-4 flex gap-2">
        <Skeleton width={60} height={32} />
        <Skeleton width={60} height={32} />
      </div>
    </div>
  );
};
