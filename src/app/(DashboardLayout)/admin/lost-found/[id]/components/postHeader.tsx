"use client";
import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowLeft, CheckCircle, Trash2, AlertTriangle } from "lucide-react";

interface PostHeaderProps {
  isActive: boolean;
  daysSincePosted: number;
  onResolve: () => void;
  onDelete: () => void;
}

export const PostHeader = ({
  isActive,
  daysSincePosted,
  onResolve,
  onDelete,
}: PostHeaderProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <Link
        href="/admin/lost-found"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-steel-blue dark:hover:text-lime-burst transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        Back to Lost & Found
      </Link>

      <div className="flex items-center gap-2 flex-wrap">
        {isActive && (
          <Button
            size="sm"
            onPress={onResolve}
            className="bg-emerald-500 text-white text-xs font-semibold"
            startContent={<CheckCircle className="size-3.5" />}
          >
            Force Resolve
          </Button>
        )}
        <Button
          size="sm"
          onPress={onDelete}
          className="bg-red-500 text-white text-xs font-semibold"
          startContent={<Trash2 className="size-3.5" />}
        >
          Delete Post
        </Button>
      </div>
    </div>

    {isActive && daysSincePosted > 30 && (
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-md bg-amber-500/10 border border-amber-500/20">
        <AlertTriangle className="size-4 text-amber-500 shrink-0" />
        <p className="text-xs text-amber-700 dark:text-amber-400">
          This post has been active for <strong>{daysSincePosted} days</strong>.
          Consider contacting the owner.
        </p>
      </div>
    )}
  </div>
);
