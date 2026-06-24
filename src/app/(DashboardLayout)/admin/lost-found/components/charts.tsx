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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 px-3 py-2 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const LostFoundCharts = ({
  pieData,
  typeData,
  stats,
}: LostFoundChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* status pie */}
      <Card
        className="bg-white dark:bg-zinc-900/60 shadow-sm border border-zinc-100 dark:border-zinc-800/60 rounded-md 
      dark:shadow-primary"
      >
        <CardHeader className="pb-0 px-4 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Status Split
          </p>
        </CardHeader>
        <CardBody className="pt-0 px-2">
          <ResponsiveContainer
            width="100%"
            height={160}
            className="text-[10px]"
          >
            <PieChart>
              <Pie
                data={pieData}
                innerRadius="70%"
                outerRadius="100%"
                cornerRadius="30%"
                // fill="#8884d8"
                fill="#ffffff"
                paddingAngle={3}
                dataKey="value"
                // isAnimationActive={isAnimationActive}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {pieData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={COLORS[i]}
                    stroke={COLORS[i]}
                    strokeWidth={2}
                  />
                ))}
              </Pie>{" "}
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* lost vs found bar */}
      <Card
        className="bg-white dark:bg-zinc-900/60 shadow-sm border border-zinc-100 dark:border-zinc-800/60 rounded-md 
      dark:shadow-primary"
      >
        <CardHeader className="pb-0 px-4 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Lost vs Found
          </p>
        </CardHeader>
        <CardBody className="pt-0 px-2">
          <ResponsiveContainer width="100%" height={160}>
            {/* <BarChart
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
            </BarChart> */}

            <BarChart
              data={typeData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <ReTooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />

              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {typeData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card
        className="bg-white dark:bg-zinc-900/60 shadow-sm border border-zinc-100 dark:border-zinc-800/60 rounded-md 
      dark:shadow-primary"
      >
        <CardHeader className="pb-0 px-4 pt-4">
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            By Species
          </p>
        </CardHeader>
        <CardBody className="pt-2 px-5 space-y-2 overflow-y-auto max-h-44">
          {stats?.speciesBreakdown?.map((s: any, i: number) => {
            const percentage = (s.count / (stats?.total || 1)) * 100;

            return (
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
                  <div className="w-32 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-steel-blue dark:bg-lime-burst"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {/* <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 min-w-[24px]">
                    {s.count}
                  </span> */}
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 min-w-[36px]">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>
    </div>
  );
};

export default LostFoundCharts;
