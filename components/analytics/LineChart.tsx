import React from "react";

type LineSeries = {
  key: string;
  label: string;
  color: string;
};

type LineChartProps = {
  data: Record<string, number | string>[];
  series: LineSeries[];
  height?: number;
};

const DEFAULT_HEIGHT = 180;

export default function LineChart({ data, series, height = DEFAULT_HEIGHT }: LineChartProps) {
  const width = 640;
  const padding = 28;
  const values = data.flatMap((item) =>
    series.map((entry) => Number(item[entry.key] ?? 0))
  );
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const getPoints = (key: string) =>
    data
      .map((item, index) => {
        const rawValue = Number(item[key] ?? 0);
        const x =
          padding +
          (index / Math.max(data.length - 1, 1)) * (width - padding * 2);
        const y =
          padding +
          (1 - (rawValue - min) / range) * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full text-muted-foreground"
      role="img"
      aria-label="Trend line chart"
    >
      <g stroke="currentColor" strokeOpacity="0.15" strokeWidth="1">
        {[0, 1, 2, 3].map((line) => {
          const y = padding + (line / 3) * (height - padding * 2);
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} />;
        })}
      </g>
      {series.map((entry) => (
        <polyline
          key={entry.key}
          points={getPoints(entry.key)}
          fill="none"
          stroke={entry.color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {series.map((entry) => {
        const lastPoint = getPoints(entry.key).split(" ").pop();
        if (!lastPoint) return null;
        const [cx, cy] = lastPoint.split(",").map(Number);
        return (
          <circle
            key={`${entry.key}-dot`}
            cx={cx}
            cy={cy}
            r="4.5"
            fill={entry.color}
            stroke="white"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}
