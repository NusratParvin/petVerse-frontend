"use client";

import { useGetCommentStatsQuery } from "@/src/redux/features/comments/commentsApi";
import { Spinner } from "@heroui/react";
import { MessageCircle, Eye, ThumbsUp, Trash2 } from "lucide-react";

export default function CommentsStats() {
  const { data, isLoading } = useGetCommentStatsQuery(undefined);
  const stats = data?.data;

  const statPills = [
    {
      icon: (
        <MessageCircle className="size-3.5 text-steel-blue dark:text-lime-burst" />
      ),
      label: `${stats.total} total comments`,
    },
    {
      icon: <Eye className="size-3.5 text-blue-500" />,
      label: `${stats.articleComments} on articles`,
    },
    {
      icon: <MessageCircle className="size-3.5 text-amber-500" />,
      label: `${stats.lostFoundComments} on lost & found`,
    },
    {
      icon: <ThumbsUp className="size-3.5 text-emerald-500" />,
      label: `${stats.sightings} sightings`,
    },
    {
      icon: <Trash2 className="size-3.5 text-red-400" />,
      label: `${stats.deleted} deleted`,
    },
  ];

  if (isLoading)
    return (
      <div className="flex justify-center h-32 items-center">
        <Spinner size="sm" />
      </div>
    );
  if (!stats) return null;

  const sightingConversionPct = stats.sightings
    ? Math.round((stats.helpfulLeads / stats.sightings) * 100)
    : 0;

  return (
    <div className="space-y-4">
      {/* Stat pills */}
      <div className="flex flex-wrap gap-2">
        {statPills.map((s: { icon: React.ReactNode; label: string }) => (
          <div
            key={s.label}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 shadow-sm"
          >
            {s.icon}
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Two col — engagement breakdown + sighting funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Engagement breakdown */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60 rounded-md p-4 shadow-sm dark:shadow-primary">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            Engagement Breakdown
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5 mb-4">
            Where is the community most active
          </p>
          <div className="space-y-3">
            {[
              {
                label: "Article comments",
                count: stats.articleComments,
                color: "bg-steel-blue dark:bg-lime-burst",
                total: stats.total,
              },
              {
                label: "Lost & Found comments",
                count: stats.lostFoundComments,
                color: "bg-amber-400",
                total: stats.total,
              },
              {
                label: "Sightings",
                count: stats.sightings,
                color: "bg-blue-400",
                total: stats.total,
              },
            ].map((e) => {
              const { label, count, color, total } = e;
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-zinc-600 dark:text-zinc-300">
                      {label}
                    </span>
                    <span className="text-zinc-400">
                      {count} · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                    <div
                      className={`h-1.5 rounded-full ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sighting funnel */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60 rounded-md p-4 shadow-sm dark:shadow-primary">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">
            Sighting Funnel
          </p>
          <p className="text-[10px] text-zinc-400 mt-0.5 mb-4">
            How sightings convert to helpful leads
          </p>
          <div className="space-y-3">
            {/* Funnel steps */}
            {[
              {
                label: "Total sightings reported",
                value: stats.sightings,
                width: "100%",
                color: "bg-blue-400",
              },
              {
                label: "Marked as helpful leads",
                value: stats.helpfulLeads,
                width: `${sightingConversionPct}%`,
                color: "bg-emerald-500",
              },
            ].map((f) => (
              <div key={f.label}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-600 dark:text-zinc-300">
                    {f.label}
                  </span>
                  <span className="text-zinc-400">{f.value}</span>
                </div>
                <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                  <div
                    className={`h-2 rounded-full ${f.color}`}
                    style={{ width: f.width }}
                  />
                </div>
              </div>
            ))}
            {/* Conversion rate  */}
            <div className="mt-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">Conversion rate</span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  sightingConversionPct >= 40
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    : sightingConversionPct >= 20
                      ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400"
                      : "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
                }`}
              >
                {sightingConversionPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Recent activity feed */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60 rounded-md p-4 shadow-sm dark:shadow-primary">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 mb-3">
            Recent Activity
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {stats.recentActivity?.slice(0, 6).map((c: any) => (
              <div
                key={c._id}
                className="flex items-start gap-2.5 p-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/60"
              >
                <img
                  src={
                    c.commenter.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(c.commenter.name)}&size=28&background=0D8F81&color=fff`
                  }
                  className="size-6 rounded-full flex-shrink-0 mt-0.5"
                  alt={c.commenter.name}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-200 truncate">
                      {c.commenter.name}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        c.targetType === "Article"
                          ? "bg-steel-blue/10 text-steel-blue dark:bg-lime-burst/10 dark:text-lime-burst"
                          : "bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {c.targetType === "Article" ? "Article" : "Lost & Found"}
                    </span>
                    {c.isSighting && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                        sighting
                      </span>
                    )}
                    {c.isHelpfulLead && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                        helpful
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
