import { Avatar } from "@heroui/react";
import { PawPrint } from "lucide-react";
import { MILESTONE_EMOJI, MILESTONE_LABELS } from "./constants";
import { timeAgo } from "./utils";

export function PostHeader({ post }: { post: any }) {
  const pet = post.petId;
  const owner = post.authorId;

  return (
    <header className="flex items-start gap-2.5 px-2.5 pt-3">
      <div className="group/avatar relative shrink-0 pb-0.5 pr-1">
        <Avatar
          src={owner?.profilePhoto}
          name={owner?.name?.charAt(0)?.toUpperCase() ?? "U"}
          className="size-8 rotate-2 rounded-md ring-1 ring-zinc-200/70 shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:ring-white/10"
        />
        {pet && (
          <span className="absolute -bottom-2.5 -right-1.5 grid size-[28px] -rotate-6 place-items-center overflow-hidden rounded-md border-2 border-white bg-lime-burst/70 text-steel-blue shadow-sm transition-transform duration-300 group-hover/avatar:rotate-0 dark:border-zinc-900 dark:bg-lime-burst/70 dark:text-black/80">
            {pet.profilePhoto ? (
              <img
                src={pet.profilePhoto}
                alt={pet.name ?? "Pet"}
                className="size-full object-cover"
              />
            ) : (
              <PawPrint size={13} strokeWidth={2.5} />
            )}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="text-[13px] font-bold leading-tight text-zinc-700 dark:text-zinc-100/80">
            {owner?.name ?? "Pet lover"}
          </span>
          {pet && (
            <>
              <span
                aria-hidden
                className="shrink-0 text-zinc-400/60 dark:text-zinc-500/60"
              >
                ·
              </span>
              <span className="truncate text-[11px] font-bold text-steel-blue dark:text-lime-burst">
                {pet.name ?? "pet"}
              </span>
            </>
          )}
        </div>
        <div className="flex min-w-0 items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-zinc-400/80 dark:text-zinc-500/80">
          <span>{pet ? "Pet moment" : "Community"}</span>
          <span aria-hidden className="opacity-50">
            ·
          </span>
          <time className="shrink-0" dateTime={post.createdAt}>
            {timeAgo(post.createdAt)}
          </time>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 pt-0.5">
        {post.isMilestone && (
          <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-[3px] text-[9px] font-extrabold uppercase tracking-wide text-amber-700 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300 sm:px-2">
            <span className="sm:hidden">
              {MILESTONE_EMOJI[post.milestoneCategory] ?? "✨"}
            </span>
            <span className="hidden sm:inline">
              {MILESTONE_LABELS[post.milestoneCategory] ?? "✨ Milestone"}
            </span>
          </span>
        )}
      </div>
    </header>
  );
}
