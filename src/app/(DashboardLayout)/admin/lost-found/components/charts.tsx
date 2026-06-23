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
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#84cc16",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];
const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  fish: "🐠",
  rabbit: "🐇",
  reptile: "🦎",
  other: "🐾",
  exotic: "🦋",
};

type PieDataProps = {
  name: string;
  value: number;
};

type TypeDataProps = {
  name: string;
  value: number;
};

type SpeciesBreakdownProps = {
  _id: string;
  count: number;
};

type StatsProps = {
  total: number;
  active: number;
  resolved: number;
  lost: number;
  found: number;
  resolutionRate: number;
  speciesBreakdown: SpeciesBreakdownProps[];
};

type LostFoundChartsProps = {
  pieData: PieDataProps[];
  typeData: TypeDataProps[];
  stats: StatsProps | null;
};

const LostFoundCharts = ({
  pieData,
  typeData,
  stats,
}: LostFoundChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* status pie */}
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <CardHeader className="pb-0 px-5 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Status Split
          </p>
        </CardHeader>
        <CardBody className="pt-0 px-2">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* lost vs found bar */}
      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <CardHeader className="pb-0 px-5 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Lost vs Found
          </p>
        </CardHeader>
        <CardBody className="pt-0 px-2">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={typeData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <ReTooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {typeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
        <CardHeader className="pb-0 px-5 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            By Species
          </p>
        </CardHeader>
        <CardBody className="pt-2 px-5 space-y-2 overflow-y-auto max-h-44">
          {stats?.speciesBreakdown?.map((s: any, i: number) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {SPECIES_EMOJI[s._id?.toLowerCase()] ?? "🐾"}
                </span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 capitalize">
                  {s._id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-steel-blue dark:bg-lime-burst"
                    style={{
                      width: `${Math.min((s.count / (stats?.total || 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 w-4">
                  {s.count}
                </span>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default LostFoundCharts;
