// components/VetStats.tsx
"use client";
import { Skeleton } from "@heroui/react";
import { StatCard } from "../../components/dashboard/statCard";
import {
  Building2,
  Star,
  Clock,
  Award,
  Users,
  Phone,
  MapPin,
  TrendingUp,
  Shield,
} from "lucide-react";

interface VetStatsProps {
  stats: any;
  isLoading: boolean;
}

export const VetStats = ({ stats, isLoading }: VetStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Total Clinics"
        value={stats?.total ?? 0}
        icon={Building2}
        color="bg-steel-blue"
        sub={`${stats?.emergency ?? 0} with 24/7 emergency`}
      />
      <StatCard
        label="Avg Rating"
        value={stats?.avgRating?.toFixed(1) ?? "0"}
        icon={Star}
        color="bg-amber-500"
        sub={`${stats?.totalReviews ?? 0} total reviews`}
      />
      <StatCard
        label="Verified Clinics"
        value={stats?.verified ?? 0}
        icon={Shield}
        color="bg-emerald-500"
        sub={`${stats?.claimed ?? 0} claimed by owners`}
      />
      <StatCard
        label="Top Speciality"
        value={stats?.topSpeciality ?? "—"}
        icon={Award}
        color="bg-purple-500"
        sub={`${stats?.topSpecialityCount ?? 0} clinics`}
      />
    </div>
  );
};
