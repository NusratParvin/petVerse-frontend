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
  <Card className="bg-white dark:bg-zinc-900/60 shadow-sm border border-zinc-100 dark:border-zinc-800 rounded-md dark:shadow-primary">
    <CardBody className="p-3 flex flex-row items-center gap-4">
      <div className={`p-1.5 rounded-md ${color}`}>
        <Icon className="size-5 text-white" />
      </div>
      <div>
        <p className="text-base font-bold text-zinc-800 dark:text-zinc-100">
          {value}
        </p>
        <div className="flex items-center gap-1.5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-semibold">
            {label}
          </p>
          {sub && (
            <>
              <span className="text-[10px] text-zinc-300 dark:text-zinc-600">
                ·
              </span>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-400 font-medium">
                {sub}
              </p>
            </>
          )}
        </div>
      </div>
    </CardBody>
  </Card>
);
