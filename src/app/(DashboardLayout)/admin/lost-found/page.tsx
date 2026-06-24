"use client";
import { useState, useMemo } from "react";
import { Button, Skeleton, useDisclosure } from "@heroui/react";
import {
  CheckCircle,
  PawPrint,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  useGetAllLostFoundPostsForAdminQuery,
  useGetLostFoundStatsQuery,
} from "@/src/redux/features/lostFound/lostFoundApi";
import { StatCard } from "./components/statCard";
import LostFoundCharts from "./components/charts";
import LostFoundFilters from "./components/filters";
import LostFoundTable from "./components/table";

const ManageLostFoundPage = () => {
  const [filters, setFilters] = useState({
    search: "",
    typeFilter: "",
    statusFilter: "",
    emirateFilter: "",
    speciesFilter: "",
  });

  const updateFilters = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const queryParams = useMemo(() => {
    const p: Record<string, string> = {};
    const { search, typeFilter, statusFilter, emirateFilter, speciesFilter } =
      filters;

    if (typeFilter) p.type = typeFilter;
    if (statusFilter) p.status = statusFilter;
    if (emirateFilter) p.emirate = emirateFilter;
    if (speciesFilter) p.species = speciesFilter;
    if (search) p.search = search;
    return p;
  }, [filters]);

  const { data, isLoading, refetch } =
    useGetAllLostFoundPostsForAdminQuery(queryParams);
  const { data: statsData, isLoading: statsLoading } =
    useGetLostFoundStatsQuery(undefined);

  const posts = data?.data ?? [];
  const stats = statsData?.data;

  const clearFilters = () => {
    setFilters({
      typeFilter: "",
      statusFilter: "",
      emirateFilter: "",
      speciesFilter: "",
      search: "",
    });
  };

  const hasFilters = Object.values(filters).some((val) => val !== "");

  // chart data
  const pieData = stats
    ? [
        { name: "Active", value: stats.active },
        { name: "Resolved", value: stats.resolved },
      ]
    : [];

  const typeData = stats
    ? [
        { name: "Lost", value: stats.lost },
        { name: "Found", value: stats.found },
      ]
    : [];

  return (
    <div className="min-h-screen bg-transparent p-3 pt-2 pb-36 space-y-2 rounded-none">
      {/* ── header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <PawPrint className="size-4 text-steel-blue dark:text-lime-burst" />
            Lost & Found Management
          </h1>
          <p className="text-[10px] text-zinc-500 mt-0.5 ps-6">
            Monitor, moderate and manage all lost & found posts
          </p>
        </div>
        <Button
          size="sm"
          variant="flat"
          onPress={() => refetch()}
          startContent={<RefreshCw className="size-3.5" />}
          className="text-xs text-zinc-600 dark:text-zinc-400 self-start sm:self-auto"
        >
          Refresh
        </Button>
      </div>

      {/* ── stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statsLoading ? (
          Array(4).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-md" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Posts"
              value={stats?.total ?? 0}
              icon={PawPrint}
              color="bg-steel-blue"
            />
            <StatCard
              label="Active"
              value={stats?.active ?? 0}
              sub="needs attention"
              icon={AlertCircle}
              color="bg-amber-500"
            />
            <StatCard
              label="Resolved"
              value={stats?.resolved ?? 0}
              sub="reunited"
              icon={CheckCircle}
              color="bg-emerald-500"
            />
            <StatCard
              label="Resolution Rate"
              value={`${stats?.resolutionRate ?? 0}%`}
              icon={TrendingUp}
              color="bg-lime-600"
            />
          </>
        )}
      </div>

      {/* // LostFoundCharts */}
      <LostFoundCharts pieData={pieData} typeData={typeData} stats={stats} />

      {/* ── filters ── */}

      <LostFoundFilters
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
        hasFilters={hasFilters}
      />

      {/* ── table ── */}
      <LostFoundTable
        posts={posts}
        isLoading={isLoading}
        clearFilters={clearFilters}
        hasFilters={hasFilters}
      />
    </div>
  );
};

export default ManageLostFoundPage;
