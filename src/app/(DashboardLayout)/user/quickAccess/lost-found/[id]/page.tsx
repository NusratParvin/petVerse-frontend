"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { Chip, Button, Tooltip, Avatar } from "@heroui/react";
import {
  MapPin,
  Calendar,
  Cpu,
  Star,
  Phone,
  MessageCircle,
  Share2,
  Check,
  Trash2,
  X,
  ArrowLeft,
} from "lucide-react";

import {
  useGetLostFoundPostByIdQuery,
  useMarkLostFoundResolvedMutation,
  useDeleteLostFoundPostMutation,
} from "@/src/redux/features/lostFound/lostFoundApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { DetailSkeleton } from "../components/detailSkeleton";
import { DetailRow } from "./components/detailRow";
import { SPECIES_EMOJI } from "../page";
import CommentSection from "../../../components/comments/commentSection";

function formatReward(amount: number): string {
  if (amount >= 1000) {
    return `AED ${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`;
  }
  return `AED ${amount}`;
}

export default function LostFoundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAppSelector(useCurrentUser);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);

  const { data, isLoading } = useGetLostFoundPostByIdQuery(id);
  const [markResolved] = useMarkLostFoundResolvedMutation();
  const [deletePost] = useDeleteLostFoundPostMutation();

  if (isLoading) return <DetailSkeleton />;

  const post = data?.data;
  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <p className="text-6xl">🐾</p>
        <p className="text-zinc-500">Post not found.</p>
        <Link
          href="/user/quickAccess/lost-found"
          className="text-steel font-medium"
        >
          ← Back
        </Link>
      </div>
    );
  }

  const isOwner = user?._id === post.postedBy?._id;
  const isLost = post.type === "lost";
  const isActive = post.status !== "resolved";
  const isDone = post.status === "resolved";
  const hasPhotos = post.photos && post.photos.length > 0;
  const speciesEmoji = SPECIES_EMOJI[post.species?.toLowerCase()] ?? "🐾";
  const headline = post.petName || `${post.species} (unnamed)`;
  const mainPhoto = hasPhotos ? post.photos[activePhoto] : null;

  const handleResolve = async () => {
    try {
      await markResolved(post._id).unwrap();
      toast.success("Marked as reunited! 🎉");
    } catch (err) {
      toast.error(`Failed to update-${err}`);
    }
  };
  const handleDelete = async () => {
    try {
      await deletePost(post._id).unwrap();
      toast.success("Post deleted");
      router.push("/user/quickAccess/lost-found");
    } catch (err) {
      toast.error(`Failed to delete-${err}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${isLost ? "Lost" : "Found"} pet in ${post.emirate}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-transparent p-3 sm:p-4 mb-24">
      {/* Back link */}
      <div className="text-right mb-2">
        <Link
          href="/user/quickAccess/lost-found"
          className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs hover:text-steel-blue dark:hover:text-lime-burst transition-colors w-fit"
        >
          <ArrowLeft className="size-3" />
          Back to Lost &amp; Found
        </Link>
      </div>

      {/* Flyer */}
      <article className="group relative max-w-3xl w-full mx-auto bg-zinc-50 dark:bg-zinc-900/40 ring-1 ring-black/5 dark:ring-white/10 rounded-md shadow-2xl shadow-zinc-300/40 dark:shadow-md dark:hover:shadow-primary transition-transform duration-500 hover:rotate-0 -rotate-[0.5deg] origin-top">
        {/* Tape */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-24 h-8 bg-amber-200/60 dark:bg-amber-300/80 rotate-[-3deg] shadow-md ring-1 ring-black/5 rounded-sm" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="size-4 rounded-full bg-zinc-400 dark:bg-zinc-600 shadow-inner ring-4 ring-transparent" />
        </div>

        {/* Poster header band */}
        <header className="px-6 pt-10 pb-6 text-center border-b-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="font-serif italic text-sm text-zinc-500 tracking-wide">
            {isLost ? "Have you seen this pet?" : "Looking for the owner of"}
          </p>
          <h1 className="mt-2 font-serif text-xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
            <span className={isLost ? "text-steel-blue" : "text-lime-500"}>
              {isLost ? "LOST" : "FOUND"}
            </span>
          </h1>
          <p className="mt-3 text-xl font-semibold text-zinc-800 dark:text-zinc-200">
            {speciesEmoji} {headline}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {post.breed ? `${post.breed} · ` : ""}
            {post.color}
            {post.gender ? ` · ${post.gender}` : ""}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3">
          {/* Photo */}
          <div className="md:col-span-3 space-y-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-zinc-200 dark:bg-zinc-800 ring-1 ring-black/5">
              {mainPhoto ? (
                <Image
                  src={mainPhoto}
                  alt={headline}
                  fill
                  className="object-cover cursor-zoom-in"
                  onClick={() => setLightboxIndex(activePhoto)}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={activePhoto === 0}
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-7xl">
                  {speciesEmoji}
                </div>
              )}

              {/* Status Chip */}
              <div className="absolute top-4 left-4">
                <Chip
                  size="md"
                  variant="shadow"
                  classNames={{
                    base: `backdrop-blur-sm px-3 ${
                      isLost
                        ? isActive
                          ? "bg-red-500/90 text-white border-red-400"
                          : "bg-emerald-500/90 text-white border-emerald-400"
                        : isActive
                          ? "bg-amber-500/90 text-white border-amber-400"
                          : "bg-emerald-500/90 text-white border-emerald-400"
                    }`,
                    content: "font-bold text-[11px] tracking-wide",
                  }}
                  startContent={
                    isActive ? (
                      <div className="relative flex size-2">
                        <span className="absolute inline-flex size-full rounded-full bg-white animate-ping opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-white" />
                      </div>
                    ) : (
                      <Check className="size-3" />
                    )
                  }
                >
                  {isLost
                    ? isActive
                      ? "MISSING"
                      : "HOME SAFE"
                    : isActive
                      ? "FOUND"
                      : "REUNITED"}
                </Chip>
              </div>

              {/* Reward stamp */}
              {isLost && post.reward && post.reward > 0 && isActive && (
                <div className="absolute top-6 right-3 animate-stamp z-10">
                  <div className="bg-lime-burst text-zinc-950 px-4 py-2 rotate-12 shadow-md ring-2 ring-white/20 rounded-sm">
                    <p className="font-serif italic text-[11px] leading-none">
                      Reward
                    </p>
                    <p className="font-sans font-bold text-lg leading-tight">
                      {formatReward(post.reward)}
                    </p>
                  </div>
                </div>
              )}

              {/* Reunited overlay */}
              {isDone && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Chip
                    size="lg"
                    className="bg-white text-zinc-900 px-8 py-6 text-2xl font-bold rotate-[-8deg] shadow-xl border-none"
                  >
                    REUNITED
                  </Chip>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {hasPhotos && post.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {post.photos.map((photo: string, i: number) => (
                  <Button
                    key={i}
                    isIconOnly
                    onPress={() => setActivePhoto(i)}
                    className={`relative size-16 shrink-0 rounded-none overflow-hidden p-0 bg-zinc-100 dark:bg-zinc-800 min-w-0 transition-all duration-200 ${
                      i === activePhoto
                        ? "dark:ring-1 ring-2 ring-zinc-900 dark:ring-lime-burst scale-95"
                        : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <Image
                      src={photo}
                      alt={`${headline} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-4 flex flex-col h-full">
            <div className="bg-zinc-100/60 dark:bg-zinc-800/60 border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-4 rounded-md space-y-3">
              <DetailRow
                icon={<MapPin className="size-4" />}
                label={isLost ? "Last seen" : "Found at"}
                value={`${post.area ? post.area + ", " : ""}${post.emirate}`}
              />
              <DetailRow
                icon={<Calendar className="size-4" />}
                label={isLost ? "Date lost" : "Date found"}
                value={format(new Date(post.dateLostFound), "dd MMM yyyy")}
              />
              {post.microchipNumber && (
                <DetailRow
                  icon={<Cpu className="size-4" />}
                  label="Microchip"
                  value={post.microchipNumber}
                />
              )}
              {post.reward && post.reward > 0 && (
                <DetailRow
                  icon={<Star className="size-4" />}
                  label="Reward"
                  value={formatReward(post.reward)}
                />
              )}
            </div>

            {post.description && (
              <div className="space-y-1.5 flex-1">
                <h3 className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                  The story
                </h3>
                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                  <p className="font-serif italic text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    &ldquo;{post.description}&rdquo;
                  </p>
                </div>
              </div>
            )}

            {/* mt-auto pushes this to the bottom */}
            <div className="flex items-center gap-3 pt-3 pb-6 mt-auto border-t border-dashed border-zinc-200 dark:border-zinc-700">
              <Avatar
                size="sm"
                name={(post.posterName || post.postedBy?.name || "A")
                  .charAt(0)
                  .toUpperCase()}
                className="bg-steel-blue/10 dark:bg-steel-blue/20 text-steel-blue dark:text-lime-burst"
              />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
                  Posted by
                </span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {post.posterName || post.postedBy?.name || "Anonymous"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <footer className="px-6 pb-6 pt-2 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              as="a"
              href={`tel:${post.posterPhone}`}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-steel-blue text-white text-sm font-semibold rounded-md transition-all hover:brightness-110 active:scale-[0.98] shadow-md"
              startContent={<Phone className="size-4" />}
            >
              Call {post.posterPhone}
            </Button>
            <Button
              as="a"
              href={`https://wa.me/${(post.posterPhone || "").replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-lime-burst text-steel-blue text-sm font-semibold rounded-md transition-all hover:brightness-110 active:scale-[0.98] shadow-md"
              startContent={<MessageCircle className="size-4" />}
            >
              WhatsApp
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-950/5 dark:border-white/5">
            <Tooltip content="Share this flyer">
              <Button
                onPress={handleShare}
                variant="light"
                size="sm"
                className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                startContent={<Share2 className="size-3.5" />}
              >
                Share flyer
              </Button>
            </Tooltip>

            {isOwner && (
              <div className="flex items-center gap-2">
                {!isDone && (
                  <Tooltip content="Mark as reunited">
                    <Button
                      onPress={handleResolve}
                      size="sm"
                      className="bg-lime-500/60 text-black/80 hover:text-black hover:bg-lime-500/80 transition-colors rounded-md"
                      startContent={<Check className="size-3.5" />}
                    >
                      Mark reunited
                    </Button>
                  </Tooltip>
                )}
                <Tooltip content="Delete post">
                  <Button
                    onPress={handleDelete}
                    size="sm"
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors rounded-full"
                    startContent={<Trash2 className="size-3.5" />}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        </footer>
      </article>

      {/* <p className="max-w-3xl mx-auto mt-16 text-center text-xs italic text-zinc-400">
        Please share this flyer — every share brings a pet closer to home 🐾
      </p> */}

      <div className="max-w-full mx-auto mt-8">
        <CommentSection
          targetType="LostFound"
          targetId={post._id}
          postOwnerId={post.postedBy?._id}
        />
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && hasPhotos && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <Image
              src={post.photos[lightboxIndex]}
              alt={`${headline} ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <Button
              isIconOnly
              onPress={(e) => {
                // e.stopPropagation();
                setLightboxIndex(null);
              }}
              className="absolute -top-10 right-0 bg-transparent text-white hover:text-zinc-300"
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
