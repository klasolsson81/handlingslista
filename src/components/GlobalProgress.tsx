import type { Progress } from "../lib/calcProgress";
import { progressPercent } from "../lib/calcProgress";
import { ProgressBar } from "./ProgressBar";

type GlobalProgressProps = {
  progress: Progress;
};

export function GlobalProgress({ progress }: GlobalProgressProps) {
  const percent = progressPercent(progress);
  return (
    <div className="flex items-center gap-3">
      <ProgressBar percent={percent} height="sm" className="flex-1" />
      <span className="text-sm font-medium text-(--text-secondary) tabular-nums min-w-[3ch] text-right">
        {percent}%
      </span>
    </div>
  );
}
