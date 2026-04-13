import React from "react";

interface LegendProps {
  title?: string;
  labels: { text: string; color: string }[];
}

export default function Legend({ title, labels }: LegendProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full mb-4">
      {title && <h4 className="mb-2 text-sm font-bold text-gray-800 uppercase tracking-wider">{title}</h4>}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {labels.map((label) => (
          <div key={label.text} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: label.color }} />
            <span className="text-sm font-medium text-gray-700">{label.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
