import Link from "next/link";
import React from "react";

const QuickAccess = () => {
  const quickAccess = [
    {
      icon: "✈️",
      label: "Import Wizard",
      href: "/user/quickAccess/import-wizard",
      color: "steel-blue",
    },
    {
      icon: "🏥",
      label: "Find a Vet",
      href: "/user/quickAccess/vet-finder",
      color: "lime-burst",
    },
    {
      icon: "🛡️",
      label: "Insurance",
      href: "/user/quickAccess/insurance",
      color: "steel-blue",
    },
    {
      icon: "🔍",
      label: "Lost & Found",
      href: "/user/quickAccess/lost-found",
      color: "lime-burst",
    },
  ];

  return (
    <div className="px-2 py-2">
      <p className="text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/80 mb-2">
        Quick Access
      </p>

      <div className="grid grid-cols-2 gap-2 ">
        {quickAccess.map((access) => (
          <Link
            key={access.href}
            href={access.href}
            className={`
                group flex flex-row gap-1 items-center justify-center p-2 rounded-lg
                transition-all duration-200 hover:scale-105 hover:-translate-y-0.5
                bg-lime-burst/30 dark:bg-lime-burst/10
                border border-steel-blue/30 dark:border-white/10
                hover:border-${access.color} hover:shadow-lg
                dark:hover:border-lime-burst/50 dark:hover:shadow-lime-burst/10
              `}
          >
            <span className="text-base mb-1 group-hover:scale-110 transition-transform">
              {access.icon}
            </span>
            <span className="text-xs font-semibold text-steel-blue dark:text-white/70 group-hover:text-steel-blue dark:group-hover:text-lime-burst">
              {access.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
