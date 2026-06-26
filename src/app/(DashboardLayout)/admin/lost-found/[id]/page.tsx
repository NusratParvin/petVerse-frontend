"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/react";
import { toast } from "sonner";
import { Skeleton } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import { differenceInDays } from "date-fns";

import {
  useAdminDeleteLostFoundPostMutation,
  useAdminMarkLostFoundResolvedMutation,
  useContactOwnerByEmailMutation,
  useContactOwnerByWhatsAppMutation,
  useGetPostForAdminQuery,
} from "@/src/redux/features/lostFound/lostFoundApi";
import Link from "next/link";
import { PostHeader } from "./components/postHeader";
import { PostContent } from "./components/postContent";
import { ActionModals } from "./components/actionModals";

// Helpers
export const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied!`);
};

export const formatReward = (amount: number) =>
  amount >= 1000
    ? `AED ${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
    : `AED ${amount}`;

export const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  fish: "🐠",
  rabbit: "🐇",
  reptile: "🦎",
  other: "🐾",
};

export const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
    <span className="text-zinc-400 mt-0.5 shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
        {label}
      </p>
      <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium mt-0.5 break-words">
        {value}
      </p>
    </div>
  </div>
);

export const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card className="bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 shadow-sm rounded-md dark:shadow-primary">
    <CardBody className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-steel-blue dark:text-lime-burst">{icon}</span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </h3>
      </div>
      {children}
    </CardBody>
  </Card>
);

const AdminLostFoundDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetPostForAdminQuery(id);
  const [adminDelete] = useAdminDeleteLostFoundPostMutation();
  const [adminResolve] = useAdminMarkLostFoundResolvedMutation();
  const [contactEmail, { isLoading: emailSending }] =
    useContactOwnerByEmailMutation();
  const [contactWhatsApp, { isLoading: whatsappSending }] =
    useContactOwnerByWhatsAppMutation();

  const [actionType, setActionType] = useState<"delete" | "resolve" | null>(
    null,
  );
  const [contactType, setContactType] = useState<"email" | "whatsapp" | null>(
    null,
  );
  const [emailSubject, setEmailSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const post = data?.data;

  if (isLoading) {
    return (
      <div className="p-4 space-y-3 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48 rounded-md" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-80 rounded-md lg:col-span-2" />
          <div className="space-y-3">
            {Array(4).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="size-10 text-zinc-300" />
        <p className="text-zinc-500">Post not found</p>
        <Link
          href="/admin/lost-found"
          className="text-steel-blue dark:text-lime-burst text-sm"
        >
          ← Back to Lost & Found
        </Link>
      </div>
    );
  }

  const isLost = post.type === "lost";
  const isActive = post.status !== "resolved";
  const speciesEmoji = SPECIES_EMOJI[post.species?.toLowerCase()] ?? "🐾";
  const headline = post.petName || `${post.species} (unnamed)`;
  const hasPhotos = post.photos?.length > 0;
  const owner = post.postedBy as any;
  const daysSincePosted = differenceInDays(
    new Date(),
    new Date(post.createdAt),
  );

  const handleAction = async () => {
    const toastId = toast.loading(
      actionType === "delete" ? "Deleting..." : "Resolving...",
    );
    try {
      if (actionType === "delete") {
        await adminDelete(post._id).unwrap();
        toast.success("Post deleted", { id: toastId });
        router.push("/admin/lost-found");
      } else {
        await adminResolve(post._id).unwrap();
        toast.success("Marked as resolved", { id: toastId });
        setIsActionOpen(false);
      }
    } catch {
      toast.error("Action failed", { id: toastId });
    }
  };

  const handleContact = async () => {
    if (!contactMessage.trim()) return toast.error("Message is required");

    const toastId = toast.loading(
      contactType === "email" ? "Sending email..." : "Sending WhatsApp...",
    );
    try {
      if (contactType === "email") {
        if (!emailSubject.trim()) return toast.error("Subject is required");
        await contactEmail({
          id: post._id,
          subject: emailSubject,
          message: contactMessage,
        }).unwrap();
        toast.success("Email sent!", { id: toastId });
      } else {
        await contactWhatsApp({
          id: post._id,
          message: contactMessage,
        }).unwrap();
        toast.success("WhatsApp sent!", { id: toastId });
      }
      setContactMessage("");
      setEmailSubject("");
      setIsContactOpen(false);
    } catch {
      toast.error("Failed to send", { id: toastId });
    }
  };

  const openContact = (type: "email" | "whatsapp") => {
    setContactType(type);
    if (type === "email") {
      setEmailSubject(
        `Regarding your ${isLost ? "lost" : "found"} pet post — ${headline}`,
      );
    }
    setContactMessage("");
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-transparent p-4 pt-2 pb-36">
      <div className="w-full mx-auto space-y-3">
        <PostHeader
          isActive={isActive}
          daysSincePosted={daysSincePosted}
          onResolve={() => {
            setActionType("resolve");
            setIsActionOpen(true);
          }}
          onDelete={() => {
            setActionType("delete");
            setIsActionOpen(true);
          }}
        />

        <PostContent
          post={post}
          speciesEmoji={speciesEmoji}
          isLost={isLost}
          isActive={isActive}
          headline={headline}
          hasPhotos={hasPhotos}
          daysSincePosted={daysSincePosted}
          owner={owner}
          onContact={openContact}
        />

        <ActionModals
          isActionOpen={isActionOpen}
          isContactOpen={isContactOpen}
          actionType={actionType}
          contactType={contactType}
          headline={headline}
          owner={owner}
          post={post}
          emailSubject={emailSubject}
          setEmailSubject={setEmailSubject}
          contactMessage={contactMessage}
          setContactMessage={setContactMessage}
          emailSending={emailSending}
          whatsappSending={whatsappSending}
          onActionClose={() => setIsActionOpen(false)}
          onContactClose={() => setIsContactOpen(false)}
          onActionConfirm={handleAction}
          onContactConfirm={handleContact}
        />
      </div>
    </div>
  );
};

export default AdminLostFoundDetailPage;
