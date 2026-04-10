import Link from "next/link";
import React from "react";
import { navItems } from "./menuConstants";
import { usePathname } from "next/navigation";

const MenuSection = () => {
  const pathname = usePathname();

  return (
    <div className="px-3 py-2">
      <p className=" mb-3 text-[10px] font-black uppercase tracking-wider text-steel-blue dark:text-lime-burst/90">
        NAVIGATE
      </p>

      <div className="space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                    flex items-center gap-2 px-2.5 py-1.5 rounded-none transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-steel-blue/100 text-white dark:bg-lime-burst/20 border-l-2 border-steel-blue dark:border-lime-burst"
                        : "hover:bg-steel-blue/15 dark:hover:bg-lime-burst/10"
                    }
                  `}
            >
              <div
                className={`
                      p-1 rounded-md transition-all duration-200
                      ${isActive ? "scale-110" : "group-hover:scale-110"}
                      ${
                        isActive
                          ? "bg-steel-blue/20 dark:bg-lime-burst/20 text-lime-burst dark:text-lime-burst"
                          : "text-steel-blue dark:text-white/60"
                      }
                    `}
              >
                <Icon size={14} />
              </div>
              <span
                className={`
                      text-[11px] font-semibold transition-colors duration-200
                      ${
                        isActive
                          ? "text-white dark:text-lime-burst"
                          : "text-gray-700 dark:text-white/80"
                      }
                    `}
              >
                {item.label}
              </span>
              {item.badge && (
                <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-pv-coral to-[#FF6B8A] text-white  shadow-sm">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuSection;
