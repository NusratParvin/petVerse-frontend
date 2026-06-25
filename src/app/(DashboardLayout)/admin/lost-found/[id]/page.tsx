"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Button,
  Chip,
  Avatar,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
  Input,
  Card,
  CardBody,
  Skeleton,
  Divider,
} from "@heroui/react";
import {
  ArrowLeft,
  Trash2,
  CheckCircle,
  Mail,
  MessageCircle,
  Phone,
  Copy,
  MapPin,
  Calendar,
  Cpu,
  Star,
  Eye,
  Clock,
  AlertTriangle,
  User,
  Send,
} from "lucide-react";

import {
  useAdminDeleteLostFoundPostMutation,
  useAdminMarkLostFoundResolvedMutation,
  useContactOwnerByEmailMutation,
  useContactOwnerByWhatsAppMutation,
  useGetPostForAdminQuery,
} from "@/src/redux/features/lostFound/lostFoundApi";

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐕",
  cat: "🐈",
  bird: "🦜",
  fish: "🐠",
  rabbit: "🐇",
  reptile: "🦎",
  other: "🐾",
};

//   helpers

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied!`);
};

const formatReward = (amount: number) =>
  amount >= 1000
    ? `AED ${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}k`
    : `AED ${amount}`;

//   info row
const InfoRow = ({
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

//   section card
const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
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

// ─── main page ────────────────────────────────────────────────────────────────
export default function AdminLostFoundDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useGetPostForAdminQuery(id);

  console.log(data);
  const [adminDelete] = useAdminDeleteLostFoundPostMutation();
  const [adminResolve] = useAdminMarkLostFoundResolvedMutation();
  const [contactEmail, { isLoading: emailSending }] =
    useContactOwnerByEmailMutation();
  const [contactWhatsApp, { isLoading: whatsappSending }] =
    useContactOwnerByWhatsAppMutation();

  const [activePhoto, setActivePhoto] = useState(0);
  const [actionType, setActionType] = useState<"delete" | "resolve" | null>(
    null,
  );
  const [contactType, setContactType] = useState<"email" | "whatsapp" | null>(
    null,
  );
  const [emailSubject, setEmailSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const {
    isOpen: isActionOpen,
    onOpen: onActionOpen,
    onClose: onActionClose,
  } = useDisclosure();
  const {
    isOpen: isContactOpen,
    onOpen: onContactOpen,
    onClose: onContactClose,
  } = useDisclosure();

  const post = data?.data;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <div className="space-y-3">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
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
          href="/admin/manage-lost-found"
          className="text-steel-blue dark:text-lime-burst text-sm"
        >
          ← Back to management
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

  // days since posted
  const daysSincePosted = Math.floor(
    (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  const handleAction = async () => {
    const toastId = toast.loading(
      actionType === "delete" ? "Deleting..." : "Resolving...",
    );
    try {
      if (actionType === "delete") {
        await adminDelete(post._id).unwrap();
        toast.success("Post deleted", { id: toastId });
        router.push("/admin/manage-lost-found");
      } else {
        await adminResolve(post._id).unwrap();
        toast.success("Marked as resolved", { id: toastId });
        onActionClose();
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
      onContactClose();
    } catch {
      toast.error("Failed to send", { id: toastId });
    }
  };

  const openContact = (type: "email" | "whatsapp") => {
    setContactType(type);
    // pre-fill subject for email
    if (type === "email") {
      setEmailSubject(
        `Regarding your ${isLost ? "lost" : "found"} pet post — ${headline}`,
      );
    }
    setContactMessage("");
    onContactOpen();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 pb-16">
      <div className="max-w-5xl mx-auto space-y-4">
        {/* ── header ── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link
            href="/admin/manage-lost-found"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-steel-blue dark:hover:text-lime-burst transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to Lost & Found
          </Link>

          {/* admin action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {isActive && (
              <Button
                size="sm"
                onPress={() => {
                  setActionType("resolve");
                  onActionOpen();
                }}
                className="bg-emerald-500 text-white text-xs font-semibold"
                startContent={<CheckCircle className="size-3.5" />}
              >
                Force Resolve
              </Button>
            )}
            <Button
              size="sm"
              onPress={() => {
                setActionType("delete");
                onActionOpen();
              }}
              className="bg-red-500 text-white text-xs font-semibold"
              startContent={<Trash2 className="size-3.5" />}
            >
              Delete Post
            </Button>
          </div>
        </div>

        {/* ── admin alert banner ── */}
        {isActive && daysSincePosted > 30 && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="size-4 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              This post has been active for{" "}
              <strong>{daysSincePosted} days</strong>. Consider contacting the
              owner.
            </p>
          </div>
        )}

        {/* ── main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* left col — photo + post info */}
          <div className="lg:col-span-2 space-y-4">
            {/* photo */}
            <Card className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
              <CardBody className="p-0">
                <div className="relative aspect-[16/9] bg-zinc-100 dark:bg-zinc-800">
                  {hasPhotos ? (
                    <Image
                      src={post.photos[activePhoto]}
                      alt={headline}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-7xl">
                      {speciesEmoji}
                    </div>
                  )}

                  {/* type + status badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Chip
                      size="sm"
                      classNames={{
                        base: `${isLost ? "bg-red-500" : "bg-amber-500"} shadow-md`,
                        content:
                          "text-white font-bold text-[11px] tracking-wide",
                      }}
                    >
                      {isLost ? "LOST" : "FOUND"}
                    </Chip>
                    {!isActive && (
                      <Chip
                        size="sm"
                        classNames={{
                          base: "bg-emerald-500 shadow-md",
                          content: "text-white font-bold text-[11px]",
                        }}
                      >
                        RESOLVED
                      </Chip>
                    )}
                  </div>

                  {/* reward */}
                  {post.reward > 0 && (
                    <div className="absolute top-3 right-3 bg-lime-burst text-zinc-900 px-3 py-1.5 rotate-3 shadow-md rounded-sm">
                      <p className="text-[10px] font-serif italic leading-none">
                        Reward
                      </p>
                      <p className="text-sm font-bold leading-tight">
                        {formatReward(post.reward)}
                      </p>
                    </div>
                  )}
                </div>

                {/* thumbnails */}
                {hasPhotos && post.photos.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {post.photos.map((photo: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setActivePhoto(i)}
                        className={`relative size-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          i === activePhoto
                            ? "border-steel-blue dark:border-lime-burst scale-95"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={photo}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* post details */}
            <SectionCard title="Post Details" icon={<Eye className="size-4" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                <InfoRow
                  icon={<MapPin className="size-3.5" />}
                  label={isLost ? "Last seen" : "Found at"}
                  value={`${post.area ? post.area + ", " : ""}${post.emirate}`}
                />
                <InfoRow
                  icon={<Calendar className="size-3.5" />}
                  label={isLost ? "Date lost" : "Date found"}
                  value={format(new Date(post.dateLostFound), "dd MMM yyyy")}
                />
                <InfoRow
                  icon={<Clock className="size-3.5" />}
                  label="Posted"
                  value={`${daysSincePosted} days ago · ${format(new Date(post.createdAt), "dd MMM yyyy")}`}
                />
                {post.microchipNumber && (
                  <InfoRow
                    icon={<Cpu className="size-3.5" />}
                    label="Microchip"
                    value={post.microchipNumber}
                  />
                )}
                {post.breed && (
                  <InfoRow
                    icon={<Star className="size-3.5" />}
                    label="Breed"
                    value={post.breed}
                  />
                )}
                {post.color && (
                  <InfoRow
                    icon={<Eye className="size-3.5" />}
                    label="Color"
                    value={post.color}
                  />
                )}
              </div>

              {post.description && (
                <>
                  <Divider className="my-3" />
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                    Description
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-serif italic">
                    "{post.description}"
                  </p>
                </>
              )}
            </SectionCard>

            {/* contact log */}
            {post.contactLog?.length > 0 && (
              <SectionCard
                title="Contact Log"
                icon={<Clock className="size-4" />}
              >
                <div className="space-y-2">
                  {post.contactLog.map((log: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          log.method === "email"
                            ? "bg-steel-blue/10 text-steel-blue"
                            : "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        {log.method === "email" ? "📧 Email" : "💬 WhatsApp"}
                      </span>
                      <span className="text-zinc-500">
                        {format(new Date(log.timestamp), "dd MMM yyyy · HH:mm")}
                      </span>
                      {log.note && (
                        <span className="text-zinc-400 truncate">
                          {log.note}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* right col — owner + actions */}
          <div className="space-y-4">
            {/* pet summary */}
            <SectionCard
              title="Pet Info"
              icon={<span className="text-base">{speciesEmoji}</span>}
            >
              <div className="text-center py-2">
                <p className="text-3xl mb-1">{speciesEmoji}</p>
                <p className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                  {headline}
                </p>
                <p className="text-xs text-zinc-400 capitalize mt-1">
                  {post.species}
                  {post.breed ? ` · ${post.breed}` : ""}
                  {post.gender ? ` · ${post.gender}` : ""}
                </p>
              </div>
            </SectionCard>

            {/* owner info */}
            <SectionCard
              title="Owner / Reporter"
              icon={<User className="size-4" />}
            >
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  size="md"
                  name={owner?.name?.charAt(0).toUpperCase() || "U"}
                  src={owner?.profilePhoto}
                  classNames={{
                    base: "bg-steel-blue/20 dark:bg-steel-blue/30",
                    name: "text-steel-blue dark:text-lime-burst font-bold",
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {post.posterName || owner?.name}
                  </p>
                  <p className="text-[11px] text-zinc-400">{owner?.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                {/* email */}
                {owner?.email && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="size-3.5 text-zinc-400 shrink-0" />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                        {owner.email}
                      </span>
                    </div>
                    <Tooltip content="Copy email">
                      <button
                        onClick={() => copyToClipboard(owner.email, "Email")}
                        className="text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst transition-colors shrink-0 ml-2"
                      >
                        <Copy className="size-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                )}

                {/* phone */}
                {post.posterPhone && (
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                    <div className="flex items-center gap-2 min-w-0">
                      <Phone className="size-3.5 text-zinc-400 shrink-0" />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                        {post.posterPhone}
                      </span>
                    </div>
                    <Tooltip content="Copy phone">
                      <button
                        onClick={() =>
                          copyToClipboard(post.posterPhone, "Phone")
                        }
                        className="text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst transition-colors shrink-0 ml-2"
                      >
                        <Copy className="size-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* contact actions */}
            <SectionCard
              title="Contact Owner"
              icon={<Send className="size-4" />}
            >
              <div className="space-y-2">
                <Button
                  fullWidth
                  size="sm"
                  onPress={() => openContact("email")}
                  className="bg-steel-blue text-white text-xs font-semibold justify-start"
                  startContent={<Mail className="size-3.5" />}
                >
                  Send Email
                </Button>
                <Button
                  fullWidth
                  size="sm"
                  onPress={() => openContact("whatsapp")}
                  className="bg-emerald-500 text-white text-xs font-semibold justify-start"
                  startContent={<MessageCircle className="size-3.5" />}
                >
                  Send WhatsApp
                </Button>
                {post.posterPhone && (
                  <Button
                    as="a"
                    href={`tel:${post.posterPhone}`}
                    fullWidth
                    size="sm"
                    variant="flat"
                    className="text-xs font-semibold justify-start text-zinc-600 dark:text-zinc-400"
                    startContent={<Phone className="size-3.5" />}
                  >
                    Call {post.posterPhone}
                  </Button>
                )}
              </div>
            </SectionCard>

            {/* post meta */}
            <SectionCard title="Post Meta" icon={<Clock className="size-4" />}>
              <div className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Post ID</span>
                  <span className="font-mono text-[10px]">
                    {post._id.toString().slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>{format(new Date(post.createdAt), "dd MMM yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span
                    className={isActive ? "text-amber-500" : "text-emerald-500"}
                  >
                    {isActive ? "Active" : "Resolved"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Comments</span>
                  <span>{post.comments?.length ?? 0}</span>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* ── action confirm modal ── */}
      <Modal isOpen={isActionOpen} onClose={onActionClose} size="sm">
        <ModalContent className="bg-white dark:bg-zinc-900">
          <ModalHeader className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            {actionType === "delete" ? "Delete Post?" : "Force Resolve?"}
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-zinc-500">
              {actionType === "delete"
                ? `Permanently remove "${headline}"? This cannot be undone.`
                : `Mark "${headline}" as resolved? Owner will see it as reunited.`}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="light"
              onPress={onActionClose}
              className="text-zinc-500"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onPress={handleAction}
              className={
                actionType === "delete"
                  ? "bg-red-500 text-white"
                  : "bg-emerald-500 text-white"
              }
            >
              {actionType === "delete" ? "Delete" : "Resolve"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── contact modal ── */}
      <Modal isOpen={isContactOpen} onClose={onContactClose} size="md">
        <ModalContent className="bg-white dark:bg-zinc-900">
          <ModalHeader className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            {contactType === "email" ? (
              <>
                <Mail className="size-4 text-steel-blue" /> Send Email to Owner
              </>
            ) : (
              <>
                <MessageCircle className="size-4 text-emerald-500" /> Send
                WhatsApp to Owner
              </>
            )}
          </ModalHeader>
          <ModalBody className="space-y-3">
            {/* recipient info */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
              <span className="text-[11px] text-zinc-400">To:</span>
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {contactType === "email" ? owner?.email : post.posterPhone}
              </span>
            </div>

            {/* subject — email only */}
            {contactType === "email" && (
              <Input
                label="Subject"
                size="sm"
                value={emailSubject}
                onValueChange={setEmailSubject}
                classNames={{
                  inputWrapper:
                    "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
                  input: "text-sm",
                }}
              />
            )}

            {/* message */}
            <Textarea
              label="Message"
              placeholder={
                contactType === "email"
                  ? "Write your message to the owner..."
                  : "Write your WhatsApp message..."
              }
              minRows={4}
              value={contactMessage}
              onValueChange={setContactMessage}
              classNames={{
                inputWrapper:
                  "bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700",
                input: "text-sm",
              }}
            />

            <p className="text-[10px] text-zinc-400">
              {contactType === "whatsapp"
                ? "Message will be sent via Twilio WhatsApp. The owner must have WhatsApp on the registered number."
                : "Email will be sent from the PetVerse system email."}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              variant="light"
              onPress={onContactClose}
              className="text-zinc-500"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              isLoading={emailSending || whatsappSending}
              isDisabled={!contactMessage.trim()}
              onPress={handleContact}
              className={
                contactType === "email"
                  ? "bg-steel-blue text-white"
                  : "bg-emerald-500 text-white"
              }
              startContent={<Send className="size-3.5" />}
            >
              Send {contactType === "email" ? "Email" : "WhatsApp"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
