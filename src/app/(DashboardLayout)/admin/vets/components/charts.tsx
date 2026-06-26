// components/VetCharts.tsx
"use client";
import { Card, CardHeader, CardBody } from "@heroui/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Line,
  Area,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#84cc16",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

interface VetChartsProps {
  stats: any;
}

const SPECIALITY_EMOJI: Record<string, string> = {
  dogs: "🐕",
  cats: "🐈",
  birds: "🦜",
  fish: "🐠",
  rabbits: "🐇",
  reptiles: "🦎",
  exotic: "🦋",
  "small-animals": "🐹",
  emergency: "🚨",
  surgery: "🔬",
  dental: "🦷",
  dermatology: "🧴",
  ophthalmology: "👁️",
  nutrition: "🥗",
};

export const VetCharts = ({ stats }: VetChartsProps) => {
  // Top specialities distribution
  const specialityData =
    stats?.specialityBreakdown?.slice(0, 8).map((item: any) => ({
      name: item._id,
      value: item.count,
      emoji: SPECIALITY_EMOJI[item._id] || "🏥",
    })) ?? [];

  // Rating distribution (buckets)
  const ratingData = stats?.ratingDistribution ?? [
    { range: "4.5-5.0", count: 0 },
    { range: "4.0-4.4", count: 0 },
    { range: "3.5-3.9", count: 0 },
    { range: "3.0-3.4", count: 0 },
    { range: "<3.0", count: 0 },
  ];

  // Emirate distribution
  const emirateData =
    stats?.emirateBreakdown?.map((item: any) => ({
      name: item._id,
      value: item.count,
    })) ?? [];

  // Emergency vs Regular
  const emergencyData = stats
    ? [
        { name: "24/7 Emergency", value: stats.emergency },
        { name: "Regular Hours", value: stats.total - stats.emergency },
      ]
    : [];

  // Price range distribution (if available)
  const priceRangeData = stats?.priceRangeBreakdown ?? [];

  // If no data, show placeholder
  if (!stats || specialityData.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800"
          >
            <CardBody className="p-6 flex items-center justify-center h-[180px]">
              <p className="text-sm text-zinc-400">No data available</p>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Top Specialities - Horizontal Bar */}
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 md:col-span-2">
        <CardHeader className="pb-0 px-5 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Top Specialities
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Most common services offered
          </p>
        </CardHeader>
        <CardBody className="pt-2 px-5 pb-4">
          <div className="space-y-3">
            {specialityData.slice(0, 6).map((item: any, i: number) => {
              const total = specialityData.reduce(
                (acc: number, d: any) => acc + d.value,
                0,
              );
              const percentage =
                total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
              const color = COLORS[i % COLORS.length];

              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                        {item.name.replace("-", " ")}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {item.value} clinics
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(Number(percentage), 100)}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Emergency Availability */}
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <CardHeader className="pb-0 px-5 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Emergency Availability
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            24/7 vs regular hours
          </p>
        </CardHeader>
        <CardBody className="pt-0 px-2">
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={emergencyData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={55}
                dataKey="value"
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                label={{
                  fontSize: 9,
                  fontWeight: 600,
                  fill: "#6b7280",
                }}
              >
                {emergencyData.map((_, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={i === 0 ? "#ef4444" : "#84cc16"}
                    stroke={i === 0 ? "#ef4444" : "#84cc16"}
                    strokeWidth={1.5}
                  />
                ))}
              </Pie>
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-1">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-red-500" />
              <span className="text-[9px] text-zinc-600 dark:text-zinc-400">
                24/7 ({emergencyData[0]?.value || 0})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-green-500" />
              <span className="text-[9px] text-zinc-600 dark:text-zinc-400">
                Regular ({emergencyData[1]?.value || 0})
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Rating Distribution */}
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <CardHeader className="pb-0 px-5 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Rating Distribution
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Avg: {stats?.avgRating?.toFixed(1) ?? 0} ⭐
          </p>
        </CardHeader>
        <CardBody className="pt-2 px-5 pb-4 space-y-2">
          {ratingData.map((item: any, i: number) => {
            const total = ratingData.reduce(
              (acc: number, d: any) => acc + d.count,
              0,
            );
            const percentage =
              total > 0 ? ((item.count / total) * 100).toFixed(0) : 0;
            const color =
              i === 0
                ? "#84cc16"
                : i === 1
                  ? "#22d3ee"
                  : i === 2
                    ? "#f59e0b"
                    : i === 3
                      ? "#fb923c"
                      : "#ef4444";

            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400 w-14">
                  {item.range}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Number(percentage), 100)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span className="text-[10px] text-zinc-400 w-8 text-right">
                  {item.count}
                </span>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {/* Emirate Distribution */}
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800 md:col-span-2">
        <CardHeader className="pb-0 px-5 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Clinics by Emirate
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Geographic distribution
          </p>
        </CardHeader>
        <CardBody className="pt-0 px-2">
          <ResponsiveContainer width="100%" height={140}>
            <BarChart
              data={emirateData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 8 }} />
              <YAxis tick={{ fontSize: 8 }} />
              <ReTooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {emirateData.map((_, i) => (
                  <Cell
                    key={`cell-${i}`}
                    fill={COLORS[i % COLORS.length]}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* If price range data is available */}
      {priceRangeData.length > 0 && (
        <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
          <CardHeader className="pb-0 px-5 pt-4">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Price Range
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Consultation fees
            </p>
          </CardHeader>
          <CardBody className="pt-0 px-2">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={priceRangeData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 8 }} />
                <YAxis tick={{ fontSize: 8 }} />
                <ReTooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      )}
    </div>
  );
};
