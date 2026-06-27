"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Stethoscope, Siren } from "lucide-react";
import { Spinner } from "@heroui/react";
import { formatEmirate } from "./utils";
import { useGetVetStatsQuery } from "@/src/redux/features/vets/vetsApi";

const getCoverageBadge = (count: number, total: number) => {
  const ratio = count / total;
  if (ratio >= 0.6)
    return {
      label: "Well covered",
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      barColor: "#10b981",
    };
  if (ratio >= 0.35)
    return {
      label: "Moderate",
      text: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-400/10",
      barColor: "#facc15",
    };
  if (ratio >= 0.15)
    return {
      label: "Limited",
      text: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-400/10",
      barColor: "#fb923c",
    };
  return {
    label: "Gap",
    text: "text-red-500 dark:text-red-400",
    bg: "bg-red-400/10",
    barColor: "#f87171",
  };
};

export default function VetsStats() {
  const { data, isLoading } = useGetVetStatsQuery(undefined);
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Spinner size="sm" />
      </div>
    );
  }

  if (!stats) return null;

  const emergencyPct = stats.totalClinics
    ? Math.round((stats.emergencyCount / stats.totalClinics) * 100)
    : 0;

  const emirateData = [...stats.byEmirate].sort((a, b) => b.count - a.count);
  const maxSpecialityCount = Math.max(
    ...stats.bySpeciality.map((s: any) => s.count),
  );

  const statsPill = [
    {
      icon: (
        <Stethoscope className="size-3.5 text-steel-blue dark:text-lime-burst" />
      ),
      label: `${stats.totalClinics} clinics`,
    },
    {
      icon: <Siren className="size-3.5 text-red-500" />,
      label: `${emergencyPct}% emergency coverage`,
    },
    {
      icon: <span className="text-xs text-yellow-500">★</span>,
      label: `${stats.averageRating} avg rating`,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Stat pills */}
      <div className="flex items-center gap-3">
        {statsPill.map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 px-6 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 shadow-sm  dark:shadow-primary"
          >
            {icon}
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Emirate bar chart */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60 rounded-md p-4 shadow-sm dark:shadow-primary">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            Clinics by Emirate
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5 mb-3">
            Coverage distribution across UAE
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={emirateData}
              layout="vertical"
              margin={{ left: 8, right: 24, top: 0, bottom: 0 }}
            >
              <XAxis
                type="number"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="emirate"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatEmirate}
                width={80}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-3 py-2 text-[11px] shadow-md">
                      <p className="font-semibold text-zinc-700 dark:text-zinc-200">
                        {formatEmirate(d.emirate)}
                      </p>
                      <p className="text-zinc-500">{d.count} clinics</p>
                      <p className="text-red-500">
                        {d.emergencyCount} emergency
                      </p>
                      <p className="text-yellow-500">★ {d.averageRating}</p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={18}>
                {emirateData.map((entry, index) => (
                  <Cell
                    key={entry.emirate}
                    fill={
                      index === 0
                        ? "#3b82f6"
                        : index === emirateData.length - 1
                          ? "#f87171"
                          : "#60a5fa"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {emirateData.length > 0 && (
            <p className="text-[10px] text-zinc-400 mt-2 border-t border-zinc-100 dark:border-zinc-800 pt-2">
              <span className="text-red-400 font-medium">
                {formatEmirate(emirateData[emirateData.length - 1].emirate)}
              </span>{" "}
              has the least coverage —{" "}
              {emirateData[emirateData.length - 1].count} clinic
              {emirateData[emirateData.length - 1].count !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Speciality ranked list */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60 rounded-md p-4 shadow-sm  dark:shadow-primary">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            Speciality Coverage
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5 mb-3">
            Which specialities are underserved
          </p>
          <div className="space-y-1 max-h-[210px] overflow-y-auto custom-scrollbar pr-1">
            {stats.bySpeciality.map((s: any, i: number) => {
              const badge = getCoverageBadge(s.count, stats.totalClinics);
              const barWidth = Math.max((s.count / maxSpecialityCount) * 80, 3);
              return (
                <div
                  key={s.speciality}
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md bg-zinc-50 dark:bg-zinc-800/60"
                >
                  <span className="text-[10px] text-zinc-400 w-4 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[11px] capitalize text-zinc-600 dark:text-zinc-300 flex-1 truncate">
                    {s.speciality.replace(/-/g, " ")}
                  </span>
                  <div className="w-20 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full flex-shrink-0">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${barWidth}px`,
                        backgroundColor: badge.barColor,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 w-4 text-right flex-shrink-0">
                    {s.count}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 font-medium ${badge.bg} ${badge.text}`}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
