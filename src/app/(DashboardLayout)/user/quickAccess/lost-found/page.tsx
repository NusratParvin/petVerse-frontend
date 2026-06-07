"use client";
import { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Tooltip,
} from "@heroui/react";
import {
  useGetLostFoundPostsQuery,
  useMarkLostFoundResolvedMutation,
  useDeleteLostFoundPostMutation,
} from "@/src/redux/features/lostFound/lostFoundApi";
import { TLostFoundPost, LF_EMIRATES, LF_SPECIES } from "@/src/types";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { toast } from "sonner";
import Link from "next/link";
import { Search, Plus, Trash2, X, PawPrint } from "lucide-react";
import { PostCardSkeletonGrid } from "./components/postcardSkeleton";
import { PostCard } from "./components/postCard";

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  rabbit: "🐇",
  reptile: "🦎",
  fish: "🐠",
  other: "🐾",
};

export default function LostFoundPage() {
  const user = useAppSelector(useCurrentUser);
  const [type, setType] = useState("all");
  const [emirate, setEmirate] = useState("");
  const [species, setSpecies] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetLostFoundPostsQuery(
    {
      type: type === "all" ? undefined : type,
      emirate: emirate || undefined,
      species: species || undefined,
      search: search || undefined,
    },
    { refetchOnMountOrArgChange: true },
  );

  const [markResolved] = useMarkLostFoundResolvedMutation();
  const [deletePost] = useDeleteLostFoundPostMutation();
  // const posts: TLostFoundPost[] = [];
  const posts: TLostFoundPost[] = data?.data ?? [];

  const handleResolve = async (id: string) => {
    try {
      await markResolved(id).unwrap();
      toast.success("Marked as reunited! 🎉");
    } catch (err) {
      toast.error(`Failed to update- ${err}`);
    }
  };
  const handleDelete = async (id: string) => {
    try {
      await deletePost(id).unwrap();
      toast.success("Post deleted");
    } catch (err) {
      toast.error(`Failed to delete- ${err}`);
    }
  };

  const active = posts.filter((p) => p.status === "active").length;
  const lost = posts.filter((p) => p.type === "lost").length;
  const found = posts.filter((p) => p.type === "found").length;

  const stats = [
    {
      label: "Active",
      value: active,
      icon: "📋",
      accent:
        "bg-steel-blue/10 dark:bg-steel-blue/20 text-steel-blue dark:text-steel-blue/90",
      rotate: "-rotate-2",
    },
    {
      label: "Lost",
      value: lost,
      icon: "💔",
      accent: "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400",
      rotate: "rotate-1",
    },
    {
      label: "Found",
      value: found,
      icon: "🐾",
      accent: "bg-lime-50 dark:bg-lime-950/30 text-lime-600 dark:text-lime-400",
      rotate: "-rotate-1",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-gray-900 dark:text-white p-3 sm:p-4  ">
      {/* Texture background */}
      <div
        className="pointer-events-none fixed inset-0 dark:opacity-[0.09]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #000 2px, transparent 0),
            radial-gradient(circle at 1px 1px, #fff 2px, transparent 0)
          `,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
          opacity: 0.03,
        }}
      />

      {/* Header with search and post button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              Lost &amp; Found <span className="text-base">🔍</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Help reunite UAE pets · {active} active reports
            </p>
          </div>
        </div>

        <Link
          href="/user/quickAccess/lost-found/post"
          className="self-start sm:self-auto"
        >
          <Button
            size="sm"
            className="bg-steel-blue dark:bg-lime-burst/80 text-white dark:text-black font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            startContent={<Plus className="w-3.5 h-3.5" />}
          >
            Post report
          </Button>
        </Link>
      </div>

      {/* STATS  */}
      <section className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6  mx-auto mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`relative bg-white/80 dark:bg-zinc-900/30 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/10 rounded-md p-3 sm:p-4  text-center shadow-md dark:shadow-sm dark:shadow-primary hover:rotate-0 transition-transform duration-500 ${s.rotate}`}
          >
            {/* pin */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 size-2 sm:size-3 rounded-full bg-zinc-300 dark:bg-zinc-600 shadow-inner ring-2 sm:ring-4 ring-white dark:ring-zinc-950/40" />
            <div className="flex flex-row items-center justify-center gap-2">
              <div
                className={`inline-flex items-center justify-center size-6 rounded-full text-xs   mb-1  ${s.accent}`}
              >
                {s.icon}
              </div>
              <p className="font-serif text-base font-bold text-steel-blue dark:text-lime-burst leading-none">
                {s.value}
              </p>
              <p className="mt-1 text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-steel-blue dark:text-lime-burst font-medium">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* FILTERS   */}

      <section className="relative bg-zinc-100/80 dark:bg-zinc-900/30 backdrop-blur-sm border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md py-4 px-2 mb-8">
        <div className="absolute -top-2 sm:-top-3 left-4 sm:left-8 px-2 sm:px-3 py-0.5 bg-amber-200 dark:bg-amber-400/60 rotate-[-2deg] text-[8px] sm:text-[10px] font-serif italic text-zinc-700 dark:text-zinc-200 shadow-sm rounded-sm">
          filter the board
        </div>

        {/* Clear all X button  */}
        {(emirate || species || search) && (
          <Tooltip
            content="Clear all filters"
            showArrow={true}
            className="text-tiny"
          >
            <div
              className="absolute -top-2 sm:-top-3 right-4 sm:right-8 px-2 sm:px-3 py-0.5 bg-red-100 dark:bg-red-900/90 rotate-[2deg] text-[8px] sm:text-[10px] font-serif italic text-red-600 dark:text-white shadow-sm rounded-sm cursor-pointer hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
              onClick={() => {
                setEmirate("");
                setSpecies("");
                setSearch("");
              }}
            >
              <X className="inline h-3 w-3 mr-1" />
              Clear all
            </div>
          </Tooltip>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          <Tabs
            selectedKey={type}
            onSelectionChange={(k) => setType(k as string)}
            radius="sm"
            size="sm"
            classNames={{
              tabList:
                "bg-white dark:bg-zinc-800 p-1 rounded-sm gap-0 ring-1 ring-zinc-200 dark:ring-zinc-700",
              tab: "px-3 sm:px-4 py-1 h-auto text-[10px] sm:text-xs font-medium rounded-md",
              cursor: "rounded-sm bg-zinc-900 dark:bg-zinc-100",
              tabContent:
                "group-data-[selected=true]:text-white dark:group-data-[selected=true]:text-zinc-900",
            }}
          >
            <Tab key="all" title="All" />
            <Tab key="lost" title="Lost" />
            <Tab key="found" title="Found" />
          </Tabs>

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, breed, area…"
            size="sm"
            variant="flat"
            startContent={<Search className="size-3 sm:size-4 text-zinc-400" />}
            classNames={{
              inputWrapper:
                "bg-white dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700 h-8 !rounded-sm",
              input: "text-[11px] sm:text-xs outline-none",
            }}
            className="flex-1 min-w-0"
          />

          <div className="flex gap-2 flex-wrap">
            <Select
              placeholder="Emirate"
              selectedKeys={emirate ? [emirate] : []}
              onChange={(e) => setEmirate(e.target.value)}
              size="sm"
              variant="flat"
              className="w-36"
              classNames={{
                trigger:
                  "mb-0.2 h-8 bg-white dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700 !rounded-sm ",
                value: "text-[11px] sm:text-xs",
              }}
            >
              {LF_EMIRATES.map((e) => (
                <SelectItem key={e} className="text-[8px]">
                  {e}
                </SelectItem>
              ))}
            </Select>

            <Select
              aria-label="Select species"
              placeholder="Species"
              selectedKeys={species ? [species] : []}
              onChange={(e) => setSpecies(e.target.value)}
              size="sm"
              variant="flat"
              className="w-32"
              classNames={{
                trigger:
                  "mb-0.2 h-8 bg-white dark:bg-zinc-800 ring-1 ring-zinc-200 dark:ring-zinc-700 !rounded-sm",
                value: "text-[11px] sm:text-xs",
              }}
            >
              {LF_SPECIES.map((s) => (
                <SelectItem key={s} textValue={s} className="text-xs">
                  {SPECIES_EMOJI[s] ?? "🐾"} {s}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </section>

      {/* BOARD / GRID */}
      {isLoading ? (
        <PostCardSkeletonGrid />
      ) : posts.length === 0 ? (
        <div className="relative max-w-md mx-auto text-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm ring-1 ring-black/5 dark:ring-white/10 rounded-md p-8 sm:p-10   mb-44 mt-12 -rotate-1 shadow-xl">
          <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2  w-16 h-7 bg-amber-200/60 dark:bg-amber-300/70 rotate-[-3deg] shadow-sm rounded-md" />
          <PawPrint className="w-12 h-12 sm:w-14 sm:h-14 text-steel-blue/40 dark:text-lime-burst/70 mx-auto mb-2 sm:mb-3" />
          <p className="font-serif text-lg sm:text-xl text-zinc-900 dark:text-zinc-100 mt-6">
            The board is quiet…
          </p>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 pb-12">
            No reports match your filters.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={user?._id}
              onResolve={handleResolve}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}
    </div>
  );
}
