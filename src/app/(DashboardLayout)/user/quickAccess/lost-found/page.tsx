// "use client";
// import { useState } from "react";
// import {
//   Card,
//   CardBody,
//   Button,
//   Chip,
//   Input,
//   Select,
//   SelectItem,
//   Tabs,
//   Tab,
// } from "@heroui/react";
// import {
//   useGetLostFoundPostsQuery,
//   useMarkLostFoundResolvedMutation,
//   useDeleteLostFoundPostMutation,
// } from "@/src/redux/features/lostFound/lostFoundApi";
// import { TLostFoundPost, LF_EMIRATES, LF_SPECIES } from "@/src/types";
// import { useAppSelector } from "@/src/redux/hooks";
// import { formatDistanceToNow } from "date-fns";
// import { toast } from "sonner";
// import Link from "next/link";
// import { useCurrentUser } from "@/src/redux/features/auth/authSlice";

// const SPECIES_EMOJI: Record<string, string> = {
//   dog: "🐕",
//   cat: "🐈",
//   bird: "🦜",
//   rabbit: "🐇",
//   reptile: "🦎",
//   other: "🐾",
// };
// const SPECIES_BG: Record<string, string> = {
//   dog: "bg-yellow-50 dark:bg-yellow-900/10",
//   cat: "bg-green-50 dark:bg-green-900/10",
//   bird: "bg-blue-50 dark:bg-blue-900/10",
//   rabbit: "bg-pink-50 dark:bg-pink-900/10",
//   reptile: "bg-teal-50 dark:bg-teal-900/10",
//   other: "bg-gray-100 dark:bg-white/5",
// };

// export default function LostFoundPage() {
//   const user = useAppSelector(useCurrentUser);
//   const [type, setType] = useState("all");
//   const [emirate, setEmirate] = useState("");
//   const [species, setSpecies] = useState("");
//   const [search, setSearch] = useState("");

//   const { data, isLoading } = useGetLostFoundPostsQuery(
//     {
//       type: type === "all" ? undefined : type,
//       emirate: emirate || undefined,
//       species: species || undefined,
//       search: search || undefined,
//     },
//     {
//       refetchOnMountOrArgChange: true,
//     },
//   );

//   const [markResolved] = useMarkLostFoundResolvedMutation();
//   const [deletePost] = useDeleteLostFoundPostMutation();
//   const posts: TLostFoundPost[] = data?.data ?? [];

//   async function handleResolve(id: string) {
//     try {
//       await markResolved(id).unwrap();
//       toast.success("Marked as reunited!");
//     } catch {
//       toast.error("Failed to update");
//     }
//   }
//   async function handleDelete(id: string) {
//     try {
//       await deletePost(id).unwrap();
//       toast.success("Post deleted");
//     } catch {
//       toast.error("Failed to delete");
//     }
//   }

//   const active = posts.filter((p) => p.status === "active").length;
//   const lost = posts.filter((p) => p.type === "lost").length;
//   const found = posts.filter((p) => p.type === "found").length;

//   return (
//     <div className="min-h-screen bg-white dark:bg-transparent text-gray-900 dark:text-white p-3 sm:p-4 transition-colors">
//       <div className="max-w-full mx-auto">
//         {/* Hero header */}
//         <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-none mb-4">
//           <CardBody className="p-4 sm:p-5">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-11 h-11 rounded-xl bg-steel-blue/10 dark:bg-steel-blue/20 flex items-center justify-center flex-shrink-0">
//                   <span className="text-xl">🔍</span>
//                 </div>
//                 <div>
//                   <h1 className="text-base font-bold text-gray-900 dark:text-white">
//                     Lost &amp; Found
//                   </h1>
//                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
//                     Help reunite UAE pets · {active} active reports
//                   </p>
//                 </div>
//               </div>
//               <Link href="/user/quickAccess/lost-found/post">
//                 <Button
//                   size="sm"
//                   className="bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black/90 font-semibold text-sm"
//                   startContent={<span>+</span>}
//                 >
//                   Post report
//                 </Button>
//               </Link>
//             </div>
//           </CardBody>
//         </Card>

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
//           {[
//             {
//               label: "Active reports",
//               value: active,
//               color: "text-steel-blue dark:text-lime-burst",
//               bg: "bg-steel-blue/10 dark:bg-steel-blue/20",
//             },
//             {
//               label: "Lost pets",
//               value: lost,
//               color: "text-red-600 dark:text-red-400",
//               bg: "bg-red-50 dark:bg-red-900/20",
//             },
//             {
//               label: "Found pets",
//               value: found,
//               color: "text-green-600 dark:text-green-400",
//               bg: "bg-green-50 dark:bg-green-900/20",
//             },
//           ].map((s) => (
//             <Card
//               key={s.label}
//               className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-none"
//             >
//               <CardBody className="p-2.5 sm:p-4">
//                 <div
//                   className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center mb-1.5`}
//                 >
//                   <span className="text-sm">
//                     {s.label === "Active reports"
//                       ? "📋"
//                       : s.label === "Lost pets"
//                         ? "💔"
//                         : "🐾"}
//                   </span>
//                 </div>
//                 <p className={`font-bold text-lg sm:text-xl ${s.color}`}>
//                   {s.value}
//                 </p>
//                 <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs leading-tight">
//                   {s.label}
//                 </p>
//               </CardBody>
//             </Card>
//           ))}
//         </div>

//         {/* Filters */}
//         <div className="flex flex-col gap-3 mb-4">
//           <div className="flex flex-wrap items-center justify-between gap-2">
//             <Tabs
//               selectedKey={type}
//               onSelectionChange={(k) => setType(k as string)}
//               color="primary"
//               radius="full"
//               size="sm"
//               classNames={{
//                 tabList: "bg-gray-100 dark:bg-white/5 p-0.5 rounded-full gap-0",
//                 tab: "px-4 py-1.5 h-auto text-xs",
//                 cursor: "rounded-full",
//               }}
//             >
//               <Tab key="all" title="All" />
//               <Tab key="lost" title="🔴 Lost" />
//               <Tab key="found" title="🟢 Found" />
//             </Tabs>
//             <Input
//               placeholder="Breed, area, chip..."
//               value={search}
//               onValueChange={setSearch}
//               size="sm"
//               variant="flat"
//               className="w-48"
//               classNames={{
//                 inputWrapper: "h-8 bg-gray-100 dark:bg-white/5",
//                 input: "text-xs",
//               }}
//               startContent={<span className="text-gray-400 text-xs">🔍</span>}
//             />
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <Select
//               placeholder="All Emirates"
//               selectedKeys={emirate ? [emirate] : []}
//               onChange={(e) => setEmirate(e.target.value)}
//               size="sm"
//               variant="flat"
//               className="w-40"
//               classNames={{
//                 trigger: "h-8 min-h-8 bg-gray-100 dark:bg-white/5",
//                 value: "text-xs",
//               }}
//             >
//               {LF_EMIRATES.map((e) => (
//                 <SelectItem key={e} className="text-xs">
//                   {e}
//                 </SelectItem>
//               ))}
//             </Select>
//             <Select
//               placeholder="All species"
//               selectedKeys={species ? [species] : []}
//               onChange={(e) => setSpecies(e.target.value)}
//               size="sm"
//               variant="flat"
//               className="w-36"
//               classNames={{
//                 trigger: "h-8 min-h-8 bg-gray-100 dark:bg-white/5",
//                 value: "text-xs",
//               }}
//             >
//               {LF_SPECIES.map((s) => (
//                 <SelectItem key={s} className="text-xs capitalize">
//                   {SPECIES_EMOJI[s]} {s}
//                 </SelectItem>
//               ))}
//             </Select>
//             {(emirate || species) && (
//               <Button
//                 size="sm"
//                 variant="light"
//                 className="text-xs h-8 text-gray-500"
//                 onPress={() => {
//                   setEmirate("");
//                   setSpecies("");
//                 }}
//               >
//                 Clear ✕
//               </Button>
//             )}
//           </div>
//         </div>

//         {/* Grid */}
//         {isLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="h-72 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse"
//               />
//             ))}
//           </div>
//         ) : posts.length === 0 ? (
//           <div className="text-center py-16 text-gray-400 text-sm">
//             <p className="text-4xl mb-3">🐾</p>
//             <p>No reports match your filters.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
//             {posts.map((post) => (
//               <PostCard
//                 key={post._id}
//                 post={post}
//                 currentUserId={user?._id}
//                 onResolve={handleResolve}
//                 onDelete={handleDelete}
//                 speciesEmoji={SPECIES_EMOJI}
//                 speciesBg={SPECIES_BG}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function PostCard({
//   post,
//   currentUserId,
//   onResolve,
//   onDelete,
//   speciesEmoji,
//   speciesBg,
// }: {
//   post: TLostFoundPost;
//   currentUserId?: string;
//   onResolve: (id: string) => void;
//   onDelete: (id: string) => void;
//   speciesEmoji: Record<string, string>;
//   speciesBg: Record<string, string>;
// }) {
//   const isOwner = currentUserId === post.postedBy?._id;
//   const isLost = post.type === "lost";
//   const isDone = post.status === "resolved";

//   return (
//     <Card
//       className={`bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm transition-all hover:border-steel-blue/50 dark:hover:border-steel-blue/40 ${isDone ? "opacity-55" : ""}`}
//     >
//       {/* Photo / placeholder */}
//       <div
//         className={`relative h-36 rounded-t-2xl overflow-hidden ${speciesBg[post.species] ?? "bg-gray-100 dark:bg-white/5"} flex items-center justify-center`}
//       >
//         {post.photos?.[0] ? (
//           <img
//             src={post.photos[0]}
//             alt={post.petName ?? "Pet"}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <span className="text-5xl select-none">
//             {speciesEmoji[post.species] ?? "🐾"}
//           </span>
//         )}

//         {/* Type badge */}
//         <Chip
//           size="sm"
//           className={`absolute top-2 left-2 text-[10px] font-bold px-2 h-5 ${isLost ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300" : "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"}`}
//         >
//           {isLost ? "🔴 Lost" : "🟢 Found"}
//         </Chip>

//         {/* Reward badge */}
//         {post.reward && post.reward > 0 && (
//           <Chip
//             size="sm"
//             className="absolute top-2 right-2 text-[10px] font-bold px-2 h-5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
//           >
//             🏆 AED {post.reward}
//           </Chip>
//         )}

//         {/* Resolved overlay */}
//         {isDone && (
//           <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
//             <Chip className="bg-white text-green-700 font-semibold text-xs px-3">
//               ✅ Reunited
//             </Chip>
//           </div>
//         )}
//       </div>

//       <CardBody className="p-3">
//         <div className="flex items-start justify-between gap-1 mb-1">
//           <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
//             {post.petName || `${post.species} (unnamed)`}
//           </h3>
//           <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">
//             {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
//           </span>
//         </div>

//         <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">
//           {post.species}
//           {post.breed ? ` · ${post.breed}` : ""} · {post.color}
//         </p>

//         <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
//           <span>📍</span>
//           {post.area}, {post.emirate}
//         </p>

//         {/* Chips */}
//         <div className="flex flex-wrap gap-1 mb-2">
//           {post.microchipNumber && (
//             <Chip
//               size="sm"
//               className="text-[10px] h-auto px-2 py-0.5 bg-steel-blue/10 dark:bg-steel-blue/20 text-steel-blue"
//             >
//               🔖 Microchipped
//             </Chip>
//           )}
//           {post.reward && post.reward > 0 && (
//             <Chip
//               size="sm"
//               className="text-[10px] h-auto px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
//             >
//               Reward offered
//             </Chip>
//           )}
//         </div>

//         <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
//           {post.description}
//         </p>

//         <div className="flex items-center gap-2">
//           <a href={`tel:${post.posterPhone}`} className="flex-1">
//             <Button
//               size="sm"
//               className="w-full bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black/90 text-xs h-7 font-semibold"
//             >
//               📞 Contact
//             </Button>
//           </a>
//           {isOwner && !isDone && (
//             <Button
//               size="sm"
//               variant="bordered"
//               onPress={() => onResolve(post._id)}
//               className="text-xs h-7 border-green-400 text-green-600 dark:text-green-400 px-2"
//             >
//               ✅
//             </Button>
//           )}
//           {isOwner && (
//             <Button
//               size="sm"
//               variant="light"
//               onPress={() => onDelete(post._id)}
//               className="text-xs h-7 text-red-400 min-w-0 px-2"
//             >
//               🗑
//             </Button>
//           )}
//         </div>
//       </CardBody>
//     </Card>
//   );
// }

"use client";
import { useState } from "react";
import {
  Card,
  CardBody,
  Button,
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
import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { toast } from "sonner";
import Link from "next/link";
import { Search } from "lucide-react";
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
  const posts: TLostFoundPost[] = data?.data ?? [];

  async function handleResolve(id: string) {
    try {
      await markResolved(id).unwrap();
      toast.success("Marked as reunited! 🎉");
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

  const active = posts.filter((p) => p.status === "active").length;
  const lost = posts.filter((p) => p.type === "lost").length;
  const found = posts.filter((p) => p.type === "found").length;

  return (
    <div className="min-h-screen bg-white dark:bg-transparent text-gray-900 dark:text-white p-3 sm:p-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <Card className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl shadow-none mb-4">
          <CardBody className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-steel-blue/10 dark:bg-steel-blue/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🔍</span>
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900 dark:text-white">
                    Lost &amp; Found
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Help reunite UAE pets · {active} active reports
                  </p>
                </div>
              </div>
              <Link href="/user/quickAccess/lost-found/post">
                <Button
                  size="sm"
                  className="bg-steel-blue dark:bg-lime-burst/60 text-white dark:text-black/90 font-semibold text-sm"
                  startContent={<span>+</span>}
                >
                  Post report
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          {[
            {
              label: "Active",
              value: active,
              icon: "📋",
              color: "text-steel-blue dark:text-lime-burst",
              bg: "bg-steel-blue/10",
            },
            {
              label: "Lost",
              value: lost,
              icon: "💔",
              color: "text-red-500 dark:text-red-400",
              bg: "bg-red-50 dark:bg-red-900/20",
            },
            {
              label: "Found",
              value: found,
              icon: "🐾",
              color: "text-green-600 dark:text-green-400",
              bg: "bg-green-50 dark:bg-green-900/20",
            },
          ].map((s) => (
            <Card
              key={s.label}
              className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl shadow-none"
            >
              <CardBody className="p-2.5 sm:p-4">
                <div
                  className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center mb-1.5`}
                >
                  <span className="text-sm">{s.icon}</span>
                </div>
                <p className={`font-bold text-lg sm:text-xl ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] sm:text-xs">
                  {s.label}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-4">
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
              placeholder="Breed, area, chip..."
              value={search}
              onValueChange={setSearch}
              size="sm"
              variant="flat"
              className="w-48"
              classNames={{
                inputWrapper: "h-8 bg-gray-100 dark:bg-white/5",
                input: "text-xs",
              }}
              startContent={<Search size={12} className="text-gray-400" />}
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
              placeholder="All species"
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

        {/* Grid */}
        {isLoading ? (
          <PostCardSkeletonGrid count={6} />
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            <p className="text-4xl mb-3">🐾</p>
            <p>No reports match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
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
    </div>
  );
}
