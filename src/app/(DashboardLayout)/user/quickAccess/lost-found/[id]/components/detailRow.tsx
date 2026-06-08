export const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-lg bg-steel/10 text-steel grid place-items-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
          {label}
        </p>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 break-words">
          {value}
        </p>
      </div>
    </div>
  );
};
