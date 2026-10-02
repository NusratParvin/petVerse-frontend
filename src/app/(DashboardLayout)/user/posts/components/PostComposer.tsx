"use client";

import { useState, useRef, useCallback } from "react";
import {
  Card,
  Avatar,
  Textarea,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
} from "@heroui/react";
import {
  ImagePlus,
  PartyPopper,
  X,
  Loader2,
  PawPrint,
  Send,
  Check,
  Sparkles,
  Play,
} from "lucide-react";
import Confetti from "react-confetti";
import { toast } from "sonner";
import { useCreatePostMutation } from "@/src/redux/features/posts/postsApi";
import { uploadToCloudinary } from "@/src/components/home/cloudinaryUpload ";

type TMediaDraft = {
  url: string;
  type: "image" | "video";
  uploading?: boolean;
};

const MAX_IMAGES = 3;

const MILESTONE_CATEGORIES = [
  { key: "adoption", label: "🏠 Adoption" },
  { key: "birthday", label: "🎂 Birthday" },
  { key: "vet-visit", label: "🩺 Vet Visit" },
  { key: "health", label: "💊 Health" },
  { key: "other", label: "✨ Other" },
];

export default function PostComposer({
  currentUser,
  pets,
}: {
  currentUser: { name: string; profilePhoto?: string };
  pets: { _id: string; name: string; profilePhoto?: string }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [caption, setCaption] = useState("");
  const [petId, setPetId] = useState<string | undefined>();
  const [media, setMedia] = useState<TMediaDraft[]>([]);
  const [milestoneCategory, setMilestoneCategory] = useState<
    string | undefined
  >();
  const [petOpen, setPetOpen] = useState(false);
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createPost, { isLoading }] = useCreatePostMutation();

  const canPost = caption.trim().length > 0 || media.length > 0;
  const hasVideo = media.some((m) => m.type === "video");
  const isFull = hasVideo || media.length >= MAX_IMAGES;
  const isUploading = media.some((m) => m.uploading);
  const isMilestone = !!milestoneCategory;
  const selectedPet = pets?.find((p) => p._id === petId);
  const selectedMilestone = MILESTONE_CATEGORIES.find(
    (c) => c.key === milestoneCategory,
  );

  const fireConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3500);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const incomingKind = files[0].type.startsWith("video") ? "video" : "image";

    if (media.length > 0 && media[0].type !== incomingKind) {
      toast.error("Photos or a video — not both 🐾");
      return;
    }
    if (incomingKind === "video" && files.length > 1) {
      toast.error("One video per post, greedy.");
      return;
    }
    if (incomingKind === "image" && media.length + files.length > MAX_IMAGES) {
      toast.error(`${MAX_IMAGES} photos max.`);
      return;
    }

    const filesToUpload =
      incomingKind === "image"
        ? files.slice(0, MAX_IMAGES - media.length)
        : files.slice(0, 1);

    for (const file of filesToUpload) {
      const draftIndex = media.length + filesToUpload.indexOf(file);
      setMedia((prev) => [
        ...prev,
        { url: "", type: incomingKind, uploading: true },
      ]);
      try {
        const url = await uploadToCloudinary(file);
        setMedia((prev) =>
          prev.map((m, i) =>
            i === draftIndex ? { url, type: incomingKind } : m,
          ),
        );
      } catch {
        toast.error("Upload flopped. Try again?");
        setMedia((prev) => prev.filter((_, i) => i !== draftIndex));
      }
    }
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const resetComposer = () => {
    setCaption("");
    setPetId(undefined);
    setMedia([]);
    setMilestoneCategory(undefined);
    setExpanded(false);
  };

  const handlePost = async () => {
    if (isUploading) {
      toast.error("Still uploading — hang on a sec.");
      return;
    }
    try {
      const payload = {
        caption: caption.trim() || undefined,
        petId,
        media: media.map(({ url, type }) => ({ url, type })),
        isMilestone,
        milestoneCategory,
      };
      await createPost(payload).unwrap();
      toast.success(isMilestone ? "Milestone shared! 🎉" : "Posted! 🐾");
      fireConfetti();
      resetComposer();
    } catch (err) {
      toast.error("Couldn't post — try again.");
      console.log(err);
    }
  };

  const pillProps = {
    size: "sm" as const,
    radius: "full" as const,
    className: "h-6 min-w-0 px-3 text-[11px] font-bold",
  };

  return (
    <>
      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={350}
          gravity={0.3}
          tweenDuration={4000}
          colors={[
            "#F5D020",
            "#00E5CC",
            "#1E90FF",
            "#FF4D6D",
            "#4682B4",
            "#B8FF2E",
            "#5aab1e",
          ]}
          style={{ position: "fixed", top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      <Card
        radius="none"
        shadow="none"
        className="w-full rounded-md border-none bg-slate-100 p-2 shadow-md transition-colors dark:bg-zinc-900/70"
      >
        <div className="flex items-start gap-2.5">
          <Avatar
            src={currentUser?.profilePhoto}
            name={currentUser?.name?.charAt(0)?.toUpperCase() ?? "U"}
            className="h-7 w-7 shrink-0 ring-2 ring-steel-blue/20 dark:ring-lime-burst/20"
          />

          <div className="min-w-0 flex-1">
            <Textarea
              value={caption}
              onValueChange={setCaption}
              onFocus={() => setExpanded(true)}
              placeholder={
                selectedPet
                  ? `Spill the tea on ${selectedPet.name}…… ☕🐾`
                  : "Share a little tail-wagging moment…… 🐾💫"
              }
              minRows={expanded ? 2 : 1}
              maxRows={6}
              variant="faded"
              classNames={{
                inputWrapper:
                  "!min-h-0 !rounded-md !px-2 !py-0.5 " +
                  "!bg-zinc-50/60 dark:!bg-zinc-500/20 " +
                  "!border !border-zinc-200/60 dark:!border-zinc-700/50 " +
                  "!shadow-none !ring-0 !outline-none " +
                  "data-[hover=true]:!bg-zinc-50/80 " +
                  "dark:data-[hover=true]:!bg-zinc-900/55 " +
                  "data-[hover=true]:!border-zinc-300/60 " +
                  "dark:data-[hover=true]:!border-zinc-600/50 " +
                  "group-data-[focus=true]:!bg-white/80 " +
                  "dark:group-data-[focus=true]:!bg-zinc-900/70 " +
                  "group-data-[focus=true]:!border-zinc-300/70 " +
                  "dark:group-data-[focus=true]:!border-zinc-600/60 " +
                  "group-data-[focus=true]:!ring-0 " +
                  "group-data-[focus=true]:!outline-none " +
                  "group-data-[focus=true]:!shadow-[0_1px_4px_rgba(0,0,0,0.04)] " +
                  "dark:group-data-[focus=true]:!shadow-[0_1px_5px_rgba(0,0,0,0.18)] " +
                  "transition-[background-color,border-color,box-shadow] duration-200",

                input:
                  "p-0 !outline-none !ring-0 focus:!outline-none focus:!ring-0 " +
                  "text-[11px] leading-7 tracking-normal " +
                  "text-zinc-700 dark:text-zinc-200 " +
                  "placeholder:text-zinc-400/80 dark:placeholder:text-zinc-500/80 " +
                  "placeholder:italic",
              }}
            />

            {/* media previews */}
            {/* {expanded && media.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2.5">
                {media.map((m, i) => (
                  <div
                    key={i}
                    className="group relative size-16 rounded-md border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-white/[0.06] sm:size-12"
                  >
                    {m.uploading ? (
                      <div className="flex h-full items-center justify-center">
                        <Loader2
                          className="animate-spin text-sky-500 dark:text-sky-400"
                          size={16}
                        />
                      </div>
                    ) : m.type === "video" ? (
                      <video
                        src={m.url}
                        className="h-full w-full object-cover"
                        // controls
                      />
                    ) : (
                      <img
                        src={m.url}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    )}

                    {!m.uploading && (
                      <button
                        type="button"
                        onClick={() => removeMedia(i)}
                        aria-label="Remove"
                        className="absolute -right-1.5 -top-2 grid size-4 place-items-center rounded-full opacity-100 transition-all bg-rose-500 z-100"
                      >
                        <X size={11} className="text-white" />
                      </button>
                    )}
                  </div>
                ))}

                {!isFull && media[0]?.type === "image" && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="grid size-16 place-items-center rounded-md border-2 border-dashed border-sky-500/30 text-sky-500 transition-colors hover:border-sky-500/60 dark:border-sky-400/30 dark:text-sky-400 dark:hover:border-sky-400/60 sm:size-12"
                  >
                    <span className="text-[10px] font-bold">
                      +{MAX_IMAGES - media.length}
                    </span>
                  </button>
                )}
              </div>
            )} */}
            {media.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2.5">
                {media.map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.type === "video"
                        ? "group relative h-16 w-24 overflow-hidden rounded-md border border-zinc-200 bg-black dark:border-white/10 sm:h-14 sm:w-20"
                        : "group relative size-16 overflow-hidden rounded-md border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-white/[0.06] sm:size-12"
                    }
                  >
                    {m.uploading ? (
                      <div className="flex h-full w-full items-center justify-center">
                        <Loader2
                          className="animate-spin text-sky-500 dark:text-sky-400"
                          size={15}
                        />
                      </div>
                    ) : m.type === "video" ? (
                      <>
                        <video
                          src={m.url}
                          className="h-full w-full object-cover"
                          preload="metadata"
                        />

                        <div className="pointer-events-none absolute inset-0 grid place-items-center">
                          <div className="grid size-7 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                            <Play size={12} fill="currentColor" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <img
                        src={m.url}
                        className="h-full w-full object-cover"
                        alt=""
                      />
                    )}

                    {!m.uploading && (
                      <button
                        type="button"
                        onClick={() => removeMedia(i)}
                        aria-label="Remove"
                        className="absolute right-1 top-1 z-20 grid size-4 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                ))}

                {!isFull && media[0]?.type === "image" && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="grid size-16 place-items-center rounded-md border border-dashed border-sky-500/30 text-sky-500 transition-colors hover:border-sky-500/60 dark:border-sky-400/30 dark:text-sky-400 dark:hover:border-sky-400/60 sm:size-12"
                  >
                    <span className="text-[10px] font-bold">
                      +{MAX_IMAGES - media.length}
                    </span>
                  </button>
                )}
              </div>
            )}

            {/*  pills */}
            <div className="mt-2 flex items-center gap-1.5">
              {/* media */}
              <Button
                {...pillProps}
                color="primary"
                variant={media.length > 0 ? "flat" : "light"}
                isDisabled={isFull}
                startContent={<ImagePlus size={13} />}
                onPress={() => {
                  // setExpanded(true);
                  fileInputRef.current?.click();
                }}
              >
                Media
              </Button>

              {/* Tag a pet */}
              <Popover
                placement="top"
                showArrow
                isOpen={petOpen}
                onOpenChange={setPetOpen}
              >
                <PopoverTrigger>
                  <Button
                    {...pillProps}
                    color="success"
                    variant={petId ? "flat" : "light"}
                    startContent={
                      selectedPet?.profilePhoto ? (
                        <Avatar
                          src={selectedPet.profilePhoto}
                          name={selectedPet.name.charAt(0).toUpperCase()}
                          className="size-4"
                        />
                      ) : (
                        <PawPrint size={13} />
                      )
                    }
                  >
                    {selectedPet ? selectedPet.name : "Tag"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="w-52 p-2">
                    <p className="px-2 pb-1 pt-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80">
                      Who&apos;s the star?
                    </p>

                    {pets?.length > 0 ? (
                      <>
                        {pets.map((p) => (
                          <button
                            key={p._id}
                            type="button"
                            onClick={() => {
                              setPetId(p._id === petId ? undefined : p._id);
                              setPetOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] font-semibold transition-colors ${
                              petId === p._id
                                ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300"
                                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                            }`}
                          >
                            <Avatar
                              src={p.profilePhoto}
                              name={p.name.charAt(0).toUpperCase()}
                              className="h-6 w-6"
                            />

                            <span className="truncate">{p.name}</span>

                            {petId === p._id && (
                              <Check size={12} className="ml-auto shrink-0" />
                            )}
                          </button>
                        ))}

                        {petId && (
                          <button
                            type="button"
                            onClick={() => {
                              setPetId(undefined);
                              setPetOpen(false);
                            }}
                            className="mt-1 w-full rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
                          >
                            Clear
                          </button>
                        )}
                      </>
                    ) : (
                      <Spinner color="success" />
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              {/* // )} */}

              {/* Milestone */}
              <Popover
                placement="top"
                showArrow
                isOpen={milestoneOpen}
                onOpenChange={setMilestoneOpen}
              >
                <PopoverTrigger>
                  <Button
                    {...pillProps}
                    color="warning"
                    variant={isMilestone ? "flat" : "light"}
                    // className=" border-0"
                    startContent={<PartyPopper size={13} />}
                  >
                    {selectedMilestone
                      ? selectedMilestone.label.replace(/^\S+\s/, "")
                      : "Milestone"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="w-52 p-2">
                    <div className="flex items-center gap-1.5 px-2 pb-1 pt-1">
                      <Sparkles size={11} className="text-amber-500" />
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        What's the occasion?
                      </p>
                    </div>
                    {MILESTONE_CATEGORIES.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => {
                          setMilestoneCategory(
                            c.key === milestoneCategory ? undefined : c.key,
                          );
                          setMilestoneOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[12px] font-semibold transition-colors ${
                          milestoneCategory === c.key
                            ? "bg-amber-400/20 text-amber-700 dark:text-amber-300"
                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/[0.06]"
                        }`}
                      >
                        <span>{c.label}</span>
                        {milestoneCategory === c.key && (
                          <Check size={12} className="ml-auto" />
                        )}
                      </button>
                    ))}
                    {/* clear option */}
                    {milestoneCategory && (
                      <button
                        type="button"
                        onClick={() => {
                          setMilestoneCategory(undefined);
                          setMilestoneOpen(false);
                        }}
                        className="mt-1 w-full rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <div className="ml-auto flex items-center gap-1 ">
                {expanded && (
                  <button
                    type="button"
                    onClick={resetComposer}
                    aria-label="Cancel"
                    title="Cancel"
                    className="grid size-8 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/[0.06] dark:hover:text-zinc-200"
                  >
                    <X size={15} />
                  </button>
                )}

                <Button
                  size="sm"
                  radius="full"
                  isDisabled={!canPost || isLoading || isUploading}
                  isLoading={isLoading}
                  onPress={handlePost}
                  startContent={
                    !isLoading ? (
                      <Send size={12} className="shrink-0" />
                    ) : undefined
                  }
                  className={`h-7 min-w-0 !rounded-full px-3.5 text-[11px] font-bold uppercase tracking-wide shadow-sm transition-colors ${
                    isMilestone
                      ? "bg-amber-400 text-zinc-900 hover:bg-amber-300 " +
                        "dark:bg-amber-400 dark:text-zinc-900 dark:hover:bg-amber-300"
                      : "bg-steel-blue text-white hover:bg-steel-blue/90 " +
                        "dark:bg-lime-burst dark:text-zinc-900 dark:hover:bg-lime-burst/90"
                  }`}
                >
                  {isMilestone ? "Celebrate" : "Post"}
                </Button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
