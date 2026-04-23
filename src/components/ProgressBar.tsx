type ProgressBarProps = {
  percent: number;
  className?: string;
  height?: "xs" | "sm";
};

export function ProgressBar({
  percent,
  className,
  height = "xs",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const heightClass = height === "sm" ? "h-[3px]" : "h-[2px]";
  return (
    <div
      className={`w-full rounded-full bg-(--accent-track) overflow-hidden ${heightClass} ${className ?? ""}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-(--accent) transition-[width] duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
