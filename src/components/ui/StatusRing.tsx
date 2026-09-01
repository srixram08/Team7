import React from "react";

export type SessionStatus = "stable" | "at-risk" | "recovering";

interface StatusRingProps {
  status: SessionStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const StatusRing: React.FC<StatusRingProps> = ({
  status,
  size = "md",
  showLabel = false,
}) => {
  const sizeMap = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  const statusConfig = {
    stable: {
      bg: "bg-[#00FF7F]",
      ping: "bg-[#00FF7F]",
      shadow: "shadow-[0_0_8px_#00FF7F]",
      label: "STABLE",
      textColor: "text-[#00FF7F]",
    },
    "at-risk": {
      bg: "bg-[#FFB020]",
      ping: "bg-[#FFB020]",
      shadow: "shadow-[0_0_8px_#FFB020]",
      label: "AT RISK",
      textColor: "text-[#FFB020]",
    },
    recovering: {
      bg: "bg-[#FF4D4D]",
      ping: "bg-[#FF4D4D]",
      shadow: "shadow-[0_0_10px_#FF4D4D]",
      label: "RECOVERING",
      textColor: "text-[#FF4D4D]",
    },
  };

  const current = statusConfig[status];

  return (
    <div className="inline-flex items-center gap-2 shrink-0">
      <span className={`relative flex shrink-0 ${sizeMap[size]}`}>
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${current.ping} opacity-75`}
        />
        <span
          className={`relative inline-flex rounded-full h-full w-full ${current.bg} ${current.shadow}`}
        />
      </span>
      {showLabel && (
        <span className={`font-mono text-xs font-bold tracking-wider ${current.textColor}`}>
          {current.label}
        </span>
      )}
    </div>
  );
};
