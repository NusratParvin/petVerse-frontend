"use client";

import { useState } from "react";
import Link from "next/link";
import { Tooltip, Avatar, Chip, Button } from "@heroui/react";
import {
  MapPin,
  Trash2,
  Calendar,
  Sparkles,
  Tag,
  Handshake,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { speciesEmoji, TLostFoundPost } from "@/src/types";
import { ImageCarousel } from "./imageCarousel";
import { ImageLightbox } from "./imagelightbox";
import WhatsAppIcon from "@/src/components/whatsAppIcon";

/** Subtle paper-grain background   */
const PAPER_TEXTURE: React.CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
  opacity: 0.04,
  pointerEvents: "none",
};

// /** Frosted "tape" strip  */
// const TAPE_STYLE: React.CSSProperties = {
//   background: "rgba(244,244,245,0.55)",
//   backdropFilter: "blur(2px)",
//   boxShadow: "inset 0 0 10px rgba(0,0,0,0.06)",
// };

interface PostCardProps {
  post: TLostFoundPost;
  currentUserId?: string;
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PostCard({
  post,
  currentUserId,
  onResolve,
  onDelete,
}: PostCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const isOwner = currentUserId === post.postedBy?._id;
  const isLost = post.type === "lost";
  const isDone = post.status === "resolved";
  const hasPhotos = !!post.photos?.length;
  // console.log(post?.photos);
  const accent = isLost ? "#4682B4" : "#8DB82A";
  const accentSoft = isLost ? "rgba(70,130,180,0.10)" : "rgba(141,184,42,0.12)";
  // const accentRing = isLost ? "rgba(70,130,180,0.25)" : "rgba(141,184,42,0.30)";

  // Slight, deterministic flyer tilt — feels hand-pinned without chaos.
  const tilt = isLost ? "-rotate-[1.2deg]" : "rotate-[1deg]";

  return (
    <>
      <div
        className={`relative flex flex-col group ${isDone ? "opacity-90" : ""}`}
      >
        {/* Tape strip */}
        {/* <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-16 h-7 rotate-2 z-20 rounded-[2px]"
          style={TAPE_STYLE}
        /> */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-16 h-7 bg-amber-200/60 dark:bg-amber-300/80 rotate-2 z-20 shadow-sm" />

        <div
          className={`relative bg-neutral-50 dark:bg-zinc-900/40 p-0 mb-5 ring-1 ring-black/5 dark:ring-white/10 ${tilt} group-hover:rotate-0 transition-transform duration-300 ease-out shadow-md shadow-black/25 dark:shadow-sm dark:hover:shadow-primary`}
        >
          {/* Paper grain */}
          <div className="absolute inset-0" style={PAPER_TEXTURE} />

          {/* Header row: status badge + posted-time */}
          <div className="relative mt-4 p-2 flex items-center justify-between">
            <span
              className="px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded"
              style={{ background: accentSoft, color: accent }}
            >
              {isLost ? "Missing" : "Found"} · {post.species}
            </span>

            <span className="flex items-center gap-1 text-[9px] text-zinc-600 dark:text-zinc-500 font-medium">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          {/* Photo / emoji placeholder */}
          <div className="relative mb-0 ">
            {hasPhotos ? (
              <div className="rounded-none overflow-hidden ring-1 ring-black/5 ">
                <ImageCarousel
                  images={post.photos}
                  alt={post.petName ?? post.species}
                  className="h-44 sm:h-48"
                  // className="aspect-square"
                  onImageClick={(i) => setLightboxIndex(i)}
                />
              </div>
            ) : (
              <div
                className="w-full h-44 sm:h-48 flex flex-col items-center justify-center rounded-none outline outline-1 -outline-offset-1 outline-black/5"
                style={{ background: accentSoft }}
              >
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500 ease-out">
                  {speciesEmoji[post.species] ?? "🐾"}
                </span>
                {/* <div className="mt-3 px-3 py-1 bg-white dark:bg-zinc-800 ring-1 ring-black/5 dark:ring-white/10 rounded-full">
                  <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-tight italic">
                    Photo coming soon
                  </span>
                </div> */}
              </div>
            )}

            {/* Reward stamp */}
            {!!post.reward && post.reward > 0 && (
              <div
                className="absolute -bottom-3 -right-1.5 px-3 py-1.5 rotate-6 text-white text-[10px] font-semibold ring-2 ring-white shadow-md "
                style={{
                  background: accent,
                  fontFamily: "'Kalam', 'Caveat', cursive",
                  // fontFamily: "'Bebas Neue', 'DM Sans', system-ui, sans-serif ",
                }}
              >
                Reward: AED {post.reward}
              </div>
            )}

            {/* "Reunited" stamp overlay */}
            {isDone && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div
                  className="border-[6px] px-5 py-1.5 rounded-md text-base uppercase -rotate-12 font-bold"
                  style={{
                    borderColor: "rgba(141,184,42,0.45)",
                    color: "rgba(141,184,42,0.7)",
                    // fontFamily: "'Kalam', 'Caveat', cursive",
                    fontFamily:
                      "'Bebas Neue', 'DM Sans', system-ui, sans-serif ",
                  }}
                >
                  Reunited
                </div>
              </div>
            )}
          </div>

          <div className="p-4">
            {/* Click- detail page */}
            <Link
              href={`/user/quickAccess/lost-found/${post._id}`}
              className="relative block focus:outline-none "
            >
              <h2
                className="text-base text-zinc-800 dark:text-zinc-100  leading-none text-balance"
                style={{
                  fontFamily: "'Bebas Neue', 'DM Sans', system-ui, sans-serif ",
                  // fontWeight: 700,
                }}
              >
                {post.petName ? (
                  <>
                    <span className="text-steel-blue dark:text-lime-burst font-semibold tracking-wide ">
                      {post.petName.charAt(0).toUpperCase() +
                        post.petName.slice(1).toLowerCase()}
                    </span>
                    {` ${isLost ? "is missing!" : "was found!"}`}
                  </>
                ) : isLost ? (
                  <>
                    {"A "}
                    <span className="text-steel-blue dark:text-lime-burst">
                      {post.species}
                    </span>
                    {" is missing"}
                  </>
                ) : (
                  <>
                    {"Found a "}
                    <span className="text-steel-blue dark:text-lime-burst">
                      {post.species}
                    </span>
                  </>
                )}
              </h2>

              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mb-0.5 capitalize">
                {post.breed ? `${post.breed} · ` : ""}
                {post.color}
              </p>

              {/* <p className="text-[10px] text-zinc-600 dark:text-zinc-300 mb-1 line-clamp-2 leading-relaxed text-pretty">
                {post.description}
              </p> */}
            </Link>

            {/* Meta chips: location + microchip */}
            <div className="relative flex flex-wrap justify-between gap-2 mb-2">
              <div className="flex items-center gap-1 text-[10px]">
                <MapPin className="w-2 h2" />
                {post.area}, {post.emirate}
              </div>

              {post.microchipNumber && (
                // <Chip
                //   size="sm"
                //   variant="shadow"
                //   className="text-[10px]"
                //   style={{
                //     background: accentSoft,
                //     color: accent,
                //     borderColor: accentRing,
                //   }}
                // >
                //   🔖 Microchipped
                // </Chip>
                <Tooltip
                  content={`Microchip: ${post.microchipNumber}`}
                  showArrow={true}
                  className="text-tiny"
                >
                  <Chip
                    size="sm"
                    color="warning"
                    variant="shadow"
                    className="text-[10px]  bg-opacity-70 "
                  >
                    <Tag className="w-3 h-3 cursor-help text-white  " />
                  </Chip>
                </Tooltip>
              )}
            </div>

            {/* Poster + Actions */}
            <div className="relative pt-2 border-t border-dashed border-zinc-300/70 dark:border-zinc-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <Tooltip
                  showArrow={true}
                  className="text-tiny"
                  content={
                    post.posterName || post.postedBy?.name || "Anonymous"
                  }
                  placement="top"
                >
                  <Avatar
                    size="sm"
                    name={post.posterName || post.postedBy?.name || "?"}
                    className="flex-shrink-0 w-5 h-5 font-bold bg-steel-blue/10 dark:bg-transparent text-steel-blue dark:text-lime-burst ring-2 ring-steel-blue/50 dark:ring-lime-burst dark:ring-offset-0 shadow-md dark:shadow-lime-burst shadow-steel-blue cursor-pointer"
                  />
                </Tooltip>
                <span className="text-[9px] font-bold text-steel-blue dark:text-lime-burst truncate">
                  {post.posterName || post.postedBy?.name || "Anonymous"}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Tooltip
                  content={`Contact-${post.posterPhone} ` || "Contact"}
                  showArrow
                  className="text-tiny"
                >
                  <a
                    href={`https://wa.me/${post.posterPhone?.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-white text-xs font-semibold py-1.5 px-3 rounded-md hover:opacity-90 active:scale-[0.98] transition-all"
                    style={{
                      background: accent,
                      boxShadow: `0 0 0 3px ${accentSoft}`,
                    }}
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    {isLost ? "Owner" : "Finder"}
                  </a>
                </Tooltip>

                {isOwner && !isDone && (
                  <Tooltip
                    content="Mark as reunited"
                    showArrow={true}
                    className="text-tiny"
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      onPress={() => onResolve(post._id)}
                      className="w-7 h-7 bg-lime-50 dark:bg-lime-900/20 text-[#8DB82A] hover:bg-lime-100 dark:hover:bg-lime-900/40 transition-colors ring-1 ring-lime-200 dark:ring-lime-800"
                    >
                      <Handshake className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}

                {isOwner && (
                  <Tooltip
                    content="Delete post"
                    showArrow={true}
                    className="text-tiny"
                  >
                    <Button
                      isIconOnly
                      size="sm"
                      onPress={() => onDelete(post._id)}
                      className="w-7 h-7 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors ring-1 ring-red-200 dark:ring-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* "Active" pulse for fresh found posts */}
            {!isDone && !isLost && (
              <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-semibold text-[#8DB82A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8DB82A] animate-pulse" />
                <Sparkles className="w-3 h-3" />
              </div>
            )}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && hasPhotos && (
        <ImageLightbox
          images={post.photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
