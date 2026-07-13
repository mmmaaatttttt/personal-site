import type { FC } from "react";

interface StatusPanelProps {
  cost: number;
  payout: number | null;
}

const StatusPanel: FC<StatusPanelProps> = ({ cost, payout }) => {
  return (
    <div className="flex justify-center gap-3">
      <div className="min-w-24 rounded-md border border-yellow-600/50 bg-neutral-900 px-4 py-2 text-center">
        <div className="text-xs uppercase tracking-wide text-neutral-400">
          Cost
        </div>
        <div className="font-mono text-2xl font-bold text-white">{cost}</div>
      </div>
      <div className="min-w-24 rounded-md border border-yellow-600/50 bg-neutral-900 px-4 py-2 text-center">
        <div className="text-xs uppercase tracking-wide text-neutral-400">
          Payout
        </div>
        <div className="font-mono text-2xl font-bold text-yellow-400">
          {payout ?? "–"}
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
