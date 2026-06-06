// "use client";
// import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { Button, Chip, Avatar, Tooltip } from "@heroui/react";
// import {
//   MapPin,
//   Calendar,
//   Cpu,
//   Award,
//   Phone,
//   CheckCircle,
//   Trash2,
//   ArrowLeft,
//   Share2,
// } from "lucide-react";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import {
//   useGetLostFoundPostByIdQuery,
//   useMarkLostFoundResolvedMutation,
//   useDeleteLostFoundPostMutation,
// } from "@/src/redux/features/lostFound/lostFoundApi";
// import { useAppSelector } from "@/src/redux/hooks";
// import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
// import { ImageCarousel } from "../components/imageCarousel";
// import { DetailSkeleton } from "../components/detailSkeleton";
// import { ImageLightbox } from "../components/imagelightbox";

// const SPECIES_EMOJI: Record<string, string> = {
//   dog: "🐕",
//   cat: "🐈",
//   bird: "🦜",
//   rabbit: "🐇",
//   reptile: "🦎",
//   fish: "🐠",
//   other: "🐾",
// };
// const SPECIES_GRADIENT: Record<string, string> = {
//   dog: "from-amber-100 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/10",
//   cat: "from-violet-100 to-pink-50 dark:from-violet-900/30 dark:to-pink-900/10",
//   bird: "from-sky-100 to-cyan-50 dark:from-sky-900/30 dark:to-cyan-900/10",
//   rabbit: "from-pink-100 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/10",
//   reptile:
//     "from-teal-100 to-emerald-50 dark:from-teal-900/30 dark:to-emerald-900/10",
//   fish: "from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/10",
//   other: "from-gray-100 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/10",
// };

// export default function LostFoundDetailPage() {
//   const { id } = useParams<{ id: string }>();
//   const router = useRouter();
//   const user = useAppSelector(useCurrentUser);
//   const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

//   const { data, isLoading } = useGetLostFoundPostByIdQuery(id);
//   const [markResolved] = useMarkLostFoundResolvedMutation();
//   const [deletePost] = useDeleteLostFoundPostMutation();

//   if (isLoading) return <DetailSkeleton />;

//   const post = data?.data;
//   if (!post)
//     return (
//       <div className="text-center py-20 text-gray-400">
//         <p className="text-4xl mb-3">🐾</p>
//         <p>Post not found.</p>
//         <Link
//           href="/user/quickAccess/lost-found"
//           className="text-steel-blue text-sm mt-3 inline-block"
//         >
//           ← Back
//         </Link>
//       </div>
//     );

//   const isOwner = user?._id === post.postedBy?._id;
//   const isLost = post.type === "lost";
//   const isDone = post.status === "resolved";
//   const hasPhotos = post.photos && post.photos.length > 0;
//   const gradient = SPECIES_GRADIENT[post.species] ?? SPECIES_GRADIENT.other;

//   async function handleResolve() {
//     try {
//       await markResolved(post._id).unwrap();
//       toast.success("Marked as reunited! 🎉");
//     } catch {
//       toast.error("Failed to update");
//     }
//   }
//   async function handleDelete() {
//     try {
//       await deletePost(post._id).unwrap();
//       toast.success("Post deleted");
//       router.push("/user/quickAccess/lost-found");
//     } catch {
//       toast.error("Failed to delete");
//     }
//   }
//   function handleShare() {
//     if (navigator.share)
//       navigator.share({
//         title: `${isLost ? "Lost" : "Found"} pet in ${post.emirate}`,
//         url: window.location.href,
//       });
//     else {
//       navigator.clipboard.writeText(window.location.href);
//       toast.success("Link copied!");
//     }
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-4 pb-20">
//       <Link
//         href="/user/quickAccess/lost-found"
//         className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-steel-blue dark:hover:text-lime-burst mb-4 transition-colors"
//       >
//         <ArrowLeft size={15} /> Back to Lost & Found
//       </Link>

//       {/* Hero */}
//       <div className="relative rounded-2xl overflow-hidden mb-4">
//         {hasPhotos ? (
//           <ImageCarousel
//             images={post.photos!}
//             alt={post.petName ?? post.species}
//             className="h-72 sm:h-80"
//             onImageClick={(i) => setLightboxIndex(i)}
//           />
//         ) : (
//           <div
//             className={`h-72 w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
//           >
//             <span className="text-9xl select-none">
//               {SPECIES_EMOJI[post.species] ?? "🐾"}
//             </span>
//           </div>
//         )}
//         <div
//           className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
//           ${isLost ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}
//         >
//           <span
//             className={`w-1.5 h-1.5 rounded-full bg-white inline-block ${!isDone ? "animate-pulse" : ""}`}
//           />
//           {isLost ? "Lost Pet" : "Found Pet"}
//         </div>
//         {isDone && (
//           <div className="absolute top-3 right-3 z-20 bg-white/95 text-green-700 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
//             <CheckCircle size={12} /> Reunited
//           </div>
//         )}
//         <button
//           onClick={handleShare}
//           className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
//         >
//           <Share2 size={14} />
//         </button>
//       </div>

//       {/* Name */}
//       <div className="mb-4">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize mb-0.5">
//           {post.petName || `${post.species} (unnamed)`}
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
//           {SPECIES_EMOJI[post.species]} {post.species}
//           {post.breed ? ` · ${post.breed}` : ""} · {post.color}
//         </p>
//       </div>

//       {/* Info grid */}
//       <div className="grid grid-cols-2 gap-2 mb-4">
//         {[
//           {
//             icon: <MapPin size={14} />,
//             label: "Location",
//             value: `${post.area}, ${post.emirate}`,
//           },
//           {
//             icon: <Calendar size={14} />,
//             label: isLost ? "Date lost" : "Date found",
//             value: format(new Date(post.dateLostFound), "dd MMM yyyy"),
//           },
//           ...(post.microchipNumber
//             ? [
//                 {
//                   icon: <Cpu size={14} />,
//                   label: "Microchip",
//                   value: post.microchipNumber,
//                 },
//               ]
//             : []),
//           ...(post.reward
//             ? [
//                 {
//                   icon: <Award size={14} />,
//                   label: "Reward",
//                   value: `AED ${post.reward}`,
//                 },
//               ]
//             : []),
//         ].map((item) => (
//           <div
//             key={item.label}
//             className="flex items-start gap-2.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-3"
//           >
//             <span className="text-steel-blue dark:text-lime-burst mt-0.5 flex-shrink-0">
//               {item.icon}
//             </span>
//             <div className="min-w-0">
//               <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
//                 {item.label}
//               </p>
//               <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize truncate">
//                 {item.value}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Description */}
//       <div className="mb-4">
//         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
//           Description
//         </p>
//         <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
//           {post.description}
//         </p>
//       </div>

//       {/* Posted by */}
//       <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-3 mb-4">
//         <Avatar
//           src={post.postedBy?.profilePhoto}
//           name={post.posterName || post.postedBy?.name || "User"}
//           className="flex-shrink-0"
//         />
//         <div className="flex-1 min-w-0">
//           <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
//             Posted by
//           </p>
//           <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
//             {post.posterName || post.postedBy?.name || "Anonymous"}
//           </p>
//         </div>
//         {post.microchipNumber && (
//           <Chip
//             size="sm"
//             className="text-[10px] bg-steel-blue/10 text-steel-blue dark:text-sky-300 flex-shrink-0"
//           >
//             Microchipped
//           </Chip>
//         )}
//       </div>

//       {/* Actions */}
//       <div className="flex gap-2">
//         <a href={`tel:${post.posterPhone}`} className="flex-1">
//           <Button className="w-full bg-steel-blue dark:bg-lime-burst/70 text-white dark:text-black font-bold gap-2 h-11">
//             <Phone size={16} /> Call {post.posterPhone}
//           </Button>
//         </a>
//         {isOwner && !isDone && (
//           <Tooltip content="Mark as reunited" size="sm" color="success">
//             <Button
//               variant="flat"
//               onPress={handleResolve}
//               className="bg-green-50 dark:bg-green-900/20 text-green-600 font-semibold gap-1.5 h-11 px-4"
//             >
//               <CheckCircle size={16} /> Reunited
//             </Button>
//           </Tooltip>
//         )}
//         {isOwner && (
//           <Tooltip content="Delete this post" size="sm" color="danger">
//             <Button
//               variant="flat"
//               onPress={handleDelete}
//               className="bg-red-50 dark:bg-red-900/20 text-red-500 h-11 min-w-0 px-4"
//             >
//               <Trash2 size={16} />
//             </Button>
//           </Tooltip>
//         )}
//       </div>

//       {lightboxIndex !== null && hasPhotos && (
//         <ImageLightbox
//           images={post.photos!}
//           initialIndex={lightboxIndex}
//           onClose={() => setLightboxIndex(null)}
//         />
//       )}
//     </div>
//   );
// }

"use client";
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useGetLostFoundPostByIdQuery,
  useMarkLostFoundResolvedMutation,
  useDeleteLostFoundPostMutation,
} from "@/src/redux/features/lostFound/lostFoundApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { DetailSkeleton } from "../components/detailSkeleton";

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  rabbit: "🐇",
  reptile: "🦎",
  fish: "🐠",
  other: "🐾",
};

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
    if (navigator.share) {
      navigator.share({
        title: `${isLost ? "Lost" : "Found"} pet in ${post.emirate}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 px-4 sm:py-12">
      {/* Back link */}
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          href="/user/quickAccess/lost-found"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-steel transition-colors"
        >
          <ArrowIcon className="size-4" />
          Back to Lost &amp; Found
        </Link>
      </div>

      {/* Flyer */}
      <article className="group relative max-w-3xl w-full mx-auto bg-zinc-50 dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 rounded-[24px] shadow-2xl shadow-zinc-300/40 dark:shadow-none transition-transform duration-500 hover:rotate-0 -rotate-[0.5deg] origin-top">
        {/* Tape */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-lime/60 rotate-[-3deg] shadow-md ring-1 ring-black/5 rounded-sm" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <div className="size-4 rounded-full bg-zinc-400 dark:bg-zinc-600 shadow-inner ring-4 ring-zinc-50 dark:ring-zinc-950" />
        </div>

        {/* Poster header band */}
        <header className="px-6 pt-10 pb-6 text-center border-b-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="font-serif italic text-sm text-zinc-500 tracking-wide">
            {isLost ? "Have you seen this pet?" : "Looking for the owner of"}
          </p>
          <h1 className="mt-2 font-serif text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
            <span className={isLost ? "text-steel" : "text-lime"}>
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-6">
          {/* Photo */}
          <div className="md:col-span-3 space-y-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 ring-1 ring-black/5">
              {mainPhoto ? (
                <img
                  src={mainPhoto}
                  alt={headline}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setLightboxIndex(activePhoto)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-7xl">
                  {speciesEmoji}
                </div>
              )}

              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                    isLost
                      ? isActive
                        ? "bg-steel text-white animate-pulse-soft"
                        : "bg-zinc-500 text-white"
                      : "bg-lime text-zinc-950"
                  }`}
                >
                  {isActive && (
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full rounded-full bg-white animate-ping-slow opacity-75" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                    </span>
                  )}
                  {isLost
                    ? isActive
                      ? "STILL MISSING"
                      : "REUNITED"
                    : isActive
                      ? "FOUND"
                      : "REUNITED"}
                </span>
              </div>

              {/* Reward stamp */}
              {isLost && post.reward && post.reward > 0 && isActive && (
                <div className="absolute top-6 right-3 animate-stamp z-10">
                  <div className="bg-lime text-zinc-950 px-4 py-2 rotate-12 shadow-md ring-2 ring-white/20 rounded-sm">
                    <p className="font-serif italic text-[11px] leading-none">
                      Reward
                    </p>
                    <p className="font-sans font-bold text-lg leading-tight">
                      {formatReward(post.reward)}
                    </p>
                  </div>
                </div>
              )}

              {isDone && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="bg-white text-zinc-900 px-8 py-4 rounded-full font-serif italic text-2xl font-bold rotate-[-8deg] shadow-xl">
                    REUNITED
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {hasPhotos && post.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {post.photos.map((photo: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`size-16 shrink-0 rounded-lg overflow-hidden ring-2 transition-all ${
                      i === activePhoto
                        ? "ring-steel"
                        : "ring-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`${headline} ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-zinc-100/60 dark:bg-zinc-800/60 border-2 border-dashed border-zinc-200 dark:border-zinc-700 p-4 rounded-xl space-y-3">
              <DetailRow
                icon={<PinIcon className="size-4" />}
                label={isLost ? "Last seen" : "Found at"}
                value={`${post.area ? post.area + ", " : ""}${post.emirate}`}
              />
              <DetailRow
                icon={<CalIcon className="size-4" />}
                label={isLost ? "Date lost" : "Date found"}
                value={format(new Date(post.dateLostFound), "dd MMM yyyy")}
              />
              {post.microchipNumber && (
                <DetailRow
                  icon={<ChipIcon className="size-4" />}
                  label="Microchip"
                  value={post.microchipNumber}
                />
              )}
              {post.reward && post.reward > 0 && (
                <DetailRow
                  icon={<StarIcon className="size-4" />}
                  label="Reward"
                  value={formatReward(post.reward)}
                />
              )}
            </div>

            {post.description && (
              <div className="space-y-1.5">
                <h3 className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                  The story
                </h3>
                <p className="font-serif italic text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  &ldquo;{post.description}&rdquo;
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-700">
              <div className="size-10 rounded-full bg-steel/15 dark:bg-steel/25 grid place-items-center text-sm font-bold text-steel shrink-0">
                {(post.posterName || post.postedBy?.name || "A")
                  .charAt(0)
                  .toUpperCase()}
              </div>
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
            <a
              href={`tel:${post.posterPhone}`}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-steel text-white text-sm font-semibold rounded-full transition-all hover:brightness-110 active:scale-[0.98] shadow-md shadow-steel/30"
            >
              <PhoneIcon className="size-4" />
              Call {post.posterPhone}
            </a>
            <a
              href={`https://wa.me/${(post.posterPhone || "").replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 bg-lime text-zinc-950 text-sm font-semibold rounded-full transition-all hover:brightness-110 active:scale-[0.98] shadow-md shadow-lime/30"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-950/5 dark:border-white/5">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
            >
              <ShareIcon className="size-3.5" />
              Share flyer
            </button>

            {isOwner && (
              <div className="flex items-center gap-2">
                {!isDone && (
                  <button
                    onClick={handleResolve}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-lime/20 text-lime hover:bg-lime/30 transition-colors"
                  >
                    <CheckIcon className="size-3.5" />
                    Mark reunited
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                >
                  <TrashIcon className="size-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </footer>
      </article>

      <p className="max-w-3xl mx-auto mt-6 text-center text-xs italic text-zinc-400">
        Please share this flyer — every share brings a pet closer to home 🐾
      </p>

      {/* Lightbox */}
      {lightboxIndex !== null && hasPhotos && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={post.photos[lightboxIndex]}
              alt={`${headline} ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
              className="absolute -top-10 right-0 text-white text-sm font-medium hover:text-zinc-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-8 rounded-lg bg-steel/10 text-steel grid place-items-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
          {label}
        </p>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

/* Icons */
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
      />
    </svg>
  );
}
function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}
function CalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}
function ChipIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 7.5l.415-2.078a2.25 2.25 0 014.412 0l.415 2.078M12 4.5v.75m3 14.25l.415 2.078a2.25 2.25 0 01-4.412 0L10.5 19.5M21 12h-.75m-15 0H4.5m16.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1L12 2z" />
    </svg>
  );
}
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.04 12.04 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
      />
    </svg>
  );
}
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  );
}
function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  );
}
