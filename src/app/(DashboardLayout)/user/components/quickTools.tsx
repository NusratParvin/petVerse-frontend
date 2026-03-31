import Link from "next/link";
import React from "react";

const QuickTools = () => {
  const quickTools = [
    {
      icon: "✈️",
      label: "Import Wizard",
      href: "/user/import-wizard",
      color: "steel-blue",
    },
    {
      icon: "🏥",
      label: "Find a Vet",
      href: "/user/vet-finder",
      color: "lime-burst",
    },
    {
      icon: "🛡️",
      label: "Insurance",
      href: "/user/insurance",
      color: "steel-blue",
    },
    {
      icon: "🔍",
      label: "Lost & Found",
      href: "/user/lost-found",
      color: "lime-burst",
    },
  ];

  return (
    <div className="px-4 py-2">
      <p className="text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/80 mb-2">
        Quick Access
      </p>

      <div className="grid grid-cols-2 gap-2 ">
        {quickTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`
                group flex flex-row gap-1 items-center justify-center p-2 rounded-lg
                transition-all duration-200 hover:scale-105 hover:-translate-y-0.5
                bg-lime-burst/30 dark:bg-lime-burst/10
                border border-steel-blue/30 dark:border-white/10
                hover:border-${tool.color} hover:shadow-lg
                dark:hover:border-lime-burst/50 dark:hover:shadow-lime-burst/10
              `}
          >
            <span className="text-base mb-1 group-hover:scale-110 transition-transform">
              {tool.icon}
            </span>
            <span className="text-xs font-semibold text-steel-blue dark:text-white/70 group-hover:text-steel-blue dark:group-hover:text-lime-burst">
              {tool.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickTools;
