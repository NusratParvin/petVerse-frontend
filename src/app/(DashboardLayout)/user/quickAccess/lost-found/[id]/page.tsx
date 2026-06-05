"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Chip, Avatar, Tooltip } from "@heroui/react";
import {
  MapPin,
  Calendar,
  Cpu,
  Award,
  Phone,
  CheckCircle,
  Trash2,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useGetLostFoundPostByIdQuery,
  useMarkLostFoundResolvedMutation,
  useDeleteLostFoundPostMutation,
} from "@/src/redux/features/lostFound/lostFoundApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { ImageCarousel } from "../components/imageCarousel";
import { DetailSkeleton } from "../components/detailSkeleton";
import { ImageLightbox } from "../components/imagelightbox";

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  rabbit: "🐇",
  reptile: "🦎",
  fish: "🐠",
  other: "🐾",
};
const SPECIES_GRADIENT: Record<string, string> = {
  dog: "from-amber-100 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/10",
  cat: "from-violet-100 to-pink-50 dark:from-violet-900/30 dark:to-pink-900/10",
  bird: "from-sky-100 to-cyan-50 dark:from-sky-900/30 dark:to-cyan-900/10",
  rabbit: "from-pink-100 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/10",
  reptile:
    "from-teal-100 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/10",
  fish: "from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/10",
  other: "from-gray-100 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/10",
};

export default function LostFoundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAppSelector(useCurrentUser);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data, isLoading } = useGetLostFoundPostByIdQuery(id);
  const [markResolved] = useMarkLostFoundResolvedMutation();
  const [deletePost] = useDeleteLostFoundPostMutation();

  if (isLoading) return <DetailSkeleton />;

  const post = data?.data;
  if (!post)
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-4xl mb-3">🐾</p>
        <p>Post not found.</p>
        <Link
          href="/user/quickAccess/lost-found"
          className="text-steel-blue text-sm mt-3 inline-block"
        >
          ← Back
        </Link>
      </div>
    );

  const isOwner = user?._id === post.postedBy?._id;
  const isLost = post.type === "lost";
  const isDone = post.status === "resolved";
  const hasPhotos = post.photos && post.photos.length > 0;
  const gradient = SPECIES_GRADIENT[post.species] ?? SPECIES_GRADIENT.other;

  async function handleResolve() {
    try {
      await markResolved(post._id).unwrap();
      toast.success("Marked as reunited! 🎉");
    } catch {
      toast.error("Failed to update");
    }
  }
  async function handleDelete() {
    try {
      await deletePost(post._id).unwrap();
      toast.success("Post deleted");
      router.push("/user/quickAccess/lost-found");
    } catch {
      toast.error("Failed to delete");
    }
  }
  function handleShare() {
    if (navigator.share)
      navigator.share({
        title: `${isLost ? "Lost" : "Found"} pet in ${post.emirate}`,
        url: window.location.href,
      });
    else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-20">
      <Link
        href="/user/quickAccess/lost-found"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-steel-blue dark:hover:text-lime-burst mb-4 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Lost & Found
      </Link>

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden mb-4">
        {hasPhotos ? (
          <ImageCarousel
            images={post.photos!}
            alt={post.petName ?? post.species}
            className="h-72 sm:h-80"
            onImageClick={(i) => setLightboxIndex(i)}
          />
        ) : (
          <div
            className={`h-72 w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span className="text-9xl select-none">
              {SPECIES_EMOJI[post.species] ?? "🐾"}
            </span>
          </div>
        )}
        <div
          className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
          ${isLost ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full bg-white inline-block ${!isDone ? "animate-pulse" : ""}`}
          />
          {isLost ? "Lost Pet" : "Found Pet"}
        </div>
        {isDone && (
          <div className="absolute top-3 right-3 z-20 bg-white/95 text-green-700 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle size={12} /> Reunited
          </div>
        )}
        <button
          onClick={handleShare}
          className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
        >
          <Share2 size={14} />
        </button>
      </div>

      {/* Name */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize mb-0.5">
          {post.petName || `${post.species} (unnamed)`}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
          {SPECIES_EMOJI[post.species]} {post.species}
          {post.breed ? ` · ${post.breed}` : ""} · {post.color}
        </p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          {
            icon: <MapPin size={14} />,
            label: "Location",
            value: `${post.area}, ${post.emirate}`,
          },
          {
            icon: <Calendar size={14} />,
            label: isLost ? "Date lost" : "Date found",
            value: format(new Date(post.dateLostFound), "dd MMM yyyy"),
          },
          ...(post.microchipNumber
            ? [
                {
                  icon: <Cpu size={14} />,
                  label: "Microchip",
                  value: post.microchipNumber,
                },
              ]
            : []),
          ...(post.reward
            ? [
                {
                  icon: <Award size={14} />,
                  label: "Reward",
                  value: `AED ${post.reward}`,
                },
              ]
            : []),
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-start gap-2.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-3"
          >
            <span className="text-steel-blue dark:text-lime-burst mt-0.5 flex-shrink-0">
              {item.icon}
            </span>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                {item.label}
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize truncate">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
          Description
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {post.description}
        </p>
      </div>

      {/* Posted by */}
      <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-3 mb-4">
        <Avatar
          src={post.postedBy?.profilePhoto}
          name={post.posterName || post.postedBy?.name || "User"}
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            Posted by
          </p>
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
            {post.posterName || post.postedBy?.name || "Anonymous"}
          </p>
        </div>
        {post.microchipNumber && (
          <Chip
            size="sm"
            className="text-[10px] bg-steel-blue/10 text-steel-blue dark:text-sky-300 flex-shrink-0"
          >
            Microchipped
          </Chip>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a href={`tel:${post.posterPhone}`} className="flex-1">
          <Button className="w-full bg-steel-blue dark:bg-lime-burst/70 text-white dark:text-black font-bold gap-2 h-11">
            <Phone size={16} /> Call {post.posterPhone}
          </Button>
        </a>
        {isOwner && !isDone && (
          <Tooltip content="Mark as reunited" size="sm" color="success">
            <Button
              variant="flat"
              onPress={handleResolve}
              className="bg-green-50 dark:bg-green-900/20 text-green-600 font-semibold gap-1.5 h-11 px-4"
            >
              <CheckCircle size={16} /> Reunited
            </Button>
          </Tooltip>
        )}
        {isOwner && (
          <Tooltip content="Delete this post" size="sm" color="danger">
            <Button
              variant="flat"
              onPress={handleDelete}
              className="bg-red-50 dark:bg-red-900/20 text-red-500 h-11 min-w-0 px-4"
            >
              <Trash2 size={16} />
            </Button>
          </Tooltip>
        )}
      </div>

      {lightboxIndex !== null && hasPhotos && (
        <ImageLightbox
          images={post.photos!}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
