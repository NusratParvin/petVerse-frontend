"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Tabs,
  Tab,
} from "@heroui/react";
import {
  useGetLostFoundPostsQuery,
  useMarkLostFoundResolvedMutation,
  useDeleteLostFoundPostMutation,
} from "@/src/redux/features/lostFound/lostFoundApi";
import { TLostFoundPost, LF_EMIRATES, LF_SPECIES } from "@/src/types";
import { useAppSelector } from "@/src/redux/hooks";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import CreateLostFoundModal from "./components/createLostFoundModal";

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐶",
  cat: "🐱",
  bird: "🦜",
  rabbit: "🐰",
  reptile: "🦎",
  other: "🐾",
};

export default function LostFoundPage() {
  const user = useAppSelector(useCurrentUser);
  const [type, setType] = useState<string>("all");
  const [emirate, setEmirate] = useState("");
  const [species, setSpecies] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useGetLostFoundPostsQuery({
    type: type === "all" ? undefined : type,
    emirate: emirate || undefined,
    species: species || undefined,
    search: search || undefined,
  });

  const [markResolved] = useMarkLostFoundResolvedMutation();
  const [deletePost] = useDeleteLostFoundPostMutation();

  const posts: TLostFoundPost[] = data?.data ?? [];

  async function handleResolve(id: string) {
    try {
      await markResolved(id).unwrap();
      toast.success("Marked as resolved!");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deletePost(id).unwrap();
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-gray-900 dark:text-white p-3 sm:p-4 transition-colors">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-base font-bold flex items-center gap-2">
              🔍 Lost & Found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              Help reunite UAE pets with their families
            </p>
          </div>
          <Button
            size="sm"
            onPress={() => setIsModalOpen(true)}
            className="bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black/90 font-semibold text-sm"
          >
            + Post Lost / Found
          </Button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            {
              label: "Active posts",
              value: posts.filter((p) => p.status === "active").length,
            },
            {
              label: "Lost pets",
              value: posts.filter((p) => p.type === "lost").length,
            },
            {
              label: "Found pets",
              value: posts.filter((p) => p.type === "found").length,
            },
          ].map((s) => (
            <Card
              key={s.label}
              className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-none"
            >
              <CardBody className="text-center p-2.5">
                <p className="text-steel-blue dark:text-lime-burst font-bold text-sm sm:text-base">
                  {s.value}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">
                  {s.label}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Tabs
              selectedKey={type}
              onSelectionChange={(k) => setType(k as string)}
              color="primary"
              radius="full"
              size="sm"
              classNames={{
                tabList: "bg-gray-100 dark:bg-white/5 p-0.5 rounded-full gap-0",
                tab: "px-4 py-1.5 h-auto text-xs",
                cursor: "rounded-full",
              }}
            >
              <Tab key="all" title="All" />
              <Tab key="lost" title="🔴 Lost" />
              <Tab key="found" title="🟢 Found" />
            </Tabs>

            <Input
              placeholder="Search breed, area, chip..."
              value={search}
              onValueChange={setSearch}
              size="sm"
              variant="flat"
              className="w-48"
              classNames={{
                inputWrapper: "h-8 bg-gray-100 dark:bg-white/5",
                input: "text-xs",
              }}
              startContent={<span className="text-gray-400 text-xs">🔍</span>}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              placeholder="All Emirates"
              selectedKeys={emirate ? [emirate] : []}
              onChange={(e) => setEmirate(e.target.value)}
              size="sm"
              variant="flat"
              className="w-40"
              classNames={{
                trigger: "h-8 min-h-8 bg-gray-100 dark:bg-white/5",
                value: "text-xs",
              }}
            >
              {LF_EMIRATES.map((e) => (
                <SelectItem key={e} className="text-xs">
                  {e}
                </SelectItem>
              ))}
            </Select>

            <Select
              placeholder="All Species"
              selectedKeys={species ? [species] : []}
              onChange={(e) => setSpecies(e.target.value)}
              size="sm"
              variant="flat"
              className="w-36"
              classNames={{
                trigger: "h-8 min-h-8 bg-gray-100 dark:bg-white/5",
                value: "text-xs",
              }}
            >
              {LF_SPECIES.map((s) => (
                <SelectItem key={s} className="text-xs capitalize">
                  {SPECIES_EMOJI[s]} {s}
                </SelectItem>
              ))}
            </Select>

            {(emirate || species) && (
              <Button
                size="sm"
                variant="light"
                className="text-xs h-8 text-gray-500"
                onPress={() => {
                  setEmirate("");
                  setSpecies("");
                }}
              >
                Clear ✕
              </Button>
            )}
          </div>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            <p className="text-4xl mb-3">🐾</p>
            <p>No posts match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {posts.map((post) => (
              <LostFoundCard
                key={post._id}
                post={post}
                currentUserId={user?._id}
                onResolve={handleResolve}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CreateLostFoundModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}

// ── Card Component ────────────────────────────────────────────────────────────
function LostFoundCard({
  post,
  currentUserId,
  onResolve,
  onDelete,
}: {
  post: TLostFoundPost;
  currentUserId?: string;
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const isOwner = currentUserId === post.postedBy?._id;
  const isLost = post.type === "lost";

  return (
    <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-steel-blue/50 dark:hover:border-steel-blue/50 transition-all shadow-sm overflow-hidden">
      {/* Photo or placeholder */}
      <div className="relative h-40 bg-gray-100 dark:bg-white/10 overflow-hidden">
        {post.photos?.[0] ? (
          <img
            src={post.photos[0]}
            alt={post.petName || "Pet"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {SPECIES_EMOJI[post.species]}
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <Chip
            size="sm"
            className={`text-[10px] font-bold px-2 h-5 ${
              isLost ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"
            }`}
          >
            {isLost ? "🔴 LOST" : "🟢 FOUND"}
          </Chip>
        </div>

        {/* Resolved overlay */}
        {post.status === "resolved" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Chip className="bg-pv-teal text-black font-bold text-xs">
              ✅ Reunited!
            </Chip>
          </div>
        )}

        {/* Reward badge */}
        {post.reward && post.reward > 0 && (
          <div className="absolute top-2 right-2">
            <Chip
              size="sm"
              className="bg-pv-yellow text-black text-[10px] font-bold px-2 h-5"
            >
              🏆 AED {post.reward}
            </Chip>
          </div>
        )}
      </div>

      <CardBody className="p-3">
        {/* Name + species */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              {post.petName || `${post.species} (unnamed)`}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs capitalize">
              {post.species}
              {post.breed ? ` · ${post.breed}` : ""} · {post.color}
            </p>
          </div>
          <p className="text-gray-400 text-[10px] flex-shrink-0">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>

        {/* Location */}
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-1">
          <span>📍</span>
          {post.area}, {post.emirate}
        </p>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {post.description}
        </p>

        {/* Microchip */}
        {post.microchipNumber && (
          <p className="text-[10px] text-steel-blue dark:text-lime-burst mb-2">
            🔖 Chip: {post.microchipNumber}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <a href={`tel:${post.posterPhone}`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black text-xs h-7 font-semibold"
            >
              📞 Contact
            </Button>
          </a>

          {isOwner && post.status === "active" && (
            <Button
              size="sm"
              variant="bordered"
              onPress={() => onResolve(post._id)}
              className="text-xs h-7 border-teal text-teal dark:border-lime-burst dark:text-lime-burst"
            >
              ✅ Resolved
            </Button>
          )}

          {isOwner && (
            <Button
              size="sm"
              variant="light"
              onPress={() => onDelete(post._id)}
              className="text-xs h-7 text-red-500 dark:text-red-400 min-w-0 px-2"
            >
              🗑
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
