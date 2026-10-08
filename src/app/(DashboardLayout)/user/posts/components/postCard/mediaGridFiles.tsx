"use client";
import { Play } from "lucide-react";

type TMediaItem = { url: string; type: "image" | "video" };

export const MediaGrid = ({
  media,
  petName,
  onOpen,
}: {
  media: TMediaItem[];
  petName?: string;
  onOpen?: (m: TMediaItem) => void;
}) => {
  if (!media?.length) return null;

  const count = Math.min(media.length, 4);
  const itemClass = (index: number) => {
    if (count === 1) return "max-h-[300px] aspect-[16/10] sm:aspect-[16/5]";
    if (count === 2) return "max-h-[320px] aspect-[4/2]";
    if (count === 3 && index === 0) return "col-span-2 aspect-[2/1]";
    return "aspect-square";
  };

  return (
    <div
      className={`grid overflow-hidden rounded-md bg-zinc-100 dark:bg-white/[0.04] ${
        count === 1 ? "grid-cols-1" : "grid-cols-2"
      }`}
    >
      {media.slice(0, 4).map((item, index) => {
        const classes = `h-full w-full object-cover ${itemClass(index)}`;
        const inner =
          item.type === "video" ? (
            <>
              <video
                src={item.url}
                className={classes}
                muted
                preload="metadata"
              />
              <span className="absolute inset-0 grid place-items-center bg-black/30">
                <Play className="size-9 fill-white text-white" />
              </span>
            </>
          ) : (
            <img
              src={item.url}
              alt={`${petName ?? "Pet"} post ${index + 1}`}
              loading="lazy"
              className={classes}
            />
          );

        const moreBadge = index === 3 && media.length > 4 && (
          <span className="absolute inset-0 grid place-items-center bg-zinc-900/55 text-lg font-extrabold text-white">
            +{media.length - 4}
          </span>
        );

        if (!onOpen) {
          return (
            <div
              key={`${item.url}-${index}`}
              className="relative overflow-hidden border border-white/70 dark:border-zinc-900/70"
            >
              {inner}
              {moreBadge}
            </div>
          );
        }

        return (
          <button
            key={`${item.url}-${index}`}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOpen(item);
            }}
            className="relative overflow-hidden border border-white/70 dark:border-zinc-900/70"
          >
            {inner}
            {moreBadge}
          </button>
        );
      })}
    </div>
  );
};
