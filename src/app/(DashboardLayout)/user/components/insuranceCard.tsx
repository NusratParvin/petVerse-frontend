import { Shield } from "lucide-react";
import Link from "next/link";
import React from "react";

const InsuranceCard = () => {
  return (
    <div className="mx-4">
      <div className="relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.01] group">
        {/* Light mode: vibrant gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-steel-blue via-steel-blue/90 to-steel-blue/70 dark:opacity-0" />

        {/* Dark mode: glass + subtle gradient */}
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-br from-steel-blue/20 via-transparent to-lime-burst/10 backdrop-blur-sm border border-white/10" />

        {/* Content */}
        <div className="relative z-10 p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Shield size={14} className="text-white dark:text-lime-burst" />
                <p className="text-[11px] font-black uppercase tracking-wider text-white dark:text-lime-burst">
                  PET INSURANCE
                </p>
              </div>
              <p className="text-sm font-bold text-white dark:text-white">
                Is Max protected? 🐾
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-lime-burst/20 flex items-center justify-center">
              <span className="text-sm">🛡️</span>
            </div>
          </div>

          <p className="text-[10px] mb-3 leading-relaxed text-white/80 dark:text-white/60">
            Only 10% of UAE pets are covered. An emergency vet bill can reach
            AED 15,000.
          </p>

          <div className="flex gap-2">
            <Link
              href="/user/insurance"
              className="flex-1 text-center text-[11px] font-bold py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] bg-lime-burst text-gray-900 shadow-lg hover:shadow-xl"
            >
              Compare Plans →
            </Link>
            <Link
              href="/user/insurance/calculator"
              className="px-3 py-2 rounded-lg text-[10px] font-semibold bg-white/20 dark:bg-white/10 text-white dark:text-white/80 hover:bg-white/30 dark:hover:bg-white/20"
            >
              Calculate
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-lime-burst/10 to-transparent rounded-full blur-xl" />
      </div>
    </div>
  );
};

export default InsuranceCard;
