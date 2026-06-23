import { Card, CardBody } from "@heroui/react";

export const StatCard = ({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: any;
}) => (
  <Card className="bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-zinc-800">
    <CardBody className="p-4 flex flex-row items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          {value}
        </p>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
        {sub && <p className="text-[10px] text-zinc-400">{sub}</p>}
      </div>
    </CardBody>
  </Card>
);
