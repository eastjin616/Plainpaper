import React from "react";
import { cn } from "@/lib/utils";

type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  segments: DonutSegment[];
  title?: string;
  className?: string;
};

export default function DonutChart({ segments, title, className }: DonutChartProps) {
  const total = Math.max(
    segments.reduce((sum, segment) => sum + segment.value, 0),
    1
  );
  let acc = 0;
  const gradientStops = segments.map((segment) => {
    const start = acc;
    const end = acc + (segment.value / total) * 100;
    acc = end;
    return `${segment.color} ${start}% ${end}%`;
  });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-5">
        <div
          className="relative h-32 w-32 rounded-full"
          style={{ background: `conic-gradient(${gradientStops.join(", ")})` }}
        >
          <div className="absolute inset-4 rounded-full bg-background shadow-inner" />
        </div>
        <div className="flex flex-col gap-2">
          {title && <p className="text-sm font-semibold text-foreground">{title}</p>}
          <div className="flex flex-col gap-2">
            {segments.map((segment) => (
              <div key={segment.label} className="flex items-center gap-3 text-sm">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-muted-foreground">{segment.label}</span>
                <span className="ml-auto font-medium text-foreground">
                  {Math.round((segment.value / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
