import { speciesEmoji, TPet } from "@/src/types";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function PetList({ pets }: { pets: TPet[] }) {
  const pathname = usePathname();

  return (
    <>
      {pets?.length === 0 ? (
        <div className="rounded-xl overflow-hidden border-steel-blue/30 dark:border-lime-burst/25 bg-steel-blue/10 dark:bg-lime-burst/5 p-4 text-center">
          <div className="text-3xl mb-1">🐾</div>
          <p className="text-[11px] font-medium text-gray-700 dark:text-white/70">
            No pets yet
          </p>
          <p className="text-[9px] text-steel-blue/60 dark:text-white/40 mt-0.5">
            Add your first pet to get started
          </p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border-steel-blue/30 dark:border-lime-burst/25 bg-steel-blue/10 dark:bg-lime-burst/5">
          <div className="divide-y divide-steel-blue/25 dark:divide-lime-burst/15 px-2.5">
            {pets.map((pet: TPet) => {
              const isActive = pathname === `/user/my-pets/${pet._id}`;
              return (
                <Link
                  key={pet._id}
                  href={`/user/my-pets/${pet._id}`}
                  className={`
                flex items-center gap-2.5 px-0 py-2 transition-all duration-200 group
                ${
                  isActive
                    ? "bg-steel-blue/20 dark:bg-lime-burst/20"
                    : "hover:bg-steel-blue/10 dark:hover:bg-lime-burst/10"
                }
              `}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-lg bg-steel-blue/25 dark:bg-lime-burst/15 overflow-hidden">
                    {pet.profilePhoto ? (
                      <Image
                        src={pet.profilePhoto}
                        alt={pet.name}
                        width={28}
                        height={28}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-base">
                        {speciesEmoji[pet.species] || "🐾"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold leading-tight truncate text-gray-800 dark:text-white">
                      {pet.name}
                    </p>
                    <p className="text-[9px] mt-0.5 truncate text-steel-blue dark:text-lime-burst/80">
                      {pet.breed || pet.species}
                    </p>
                  </div>
                  <ChevronRight
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-steel-blue dark:text-lime-burst"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
