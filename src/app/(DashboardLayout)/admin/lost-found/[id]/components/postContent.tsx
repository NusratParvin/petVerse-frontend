"use client";
import { useState } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Card,
  CardBody,
  Chip,
  Divider,
  Avatar,
  Button,
  Tooltip,
} from "@heroui/react";
import {
  Eye,
  MapPin,
  Calendar,
  Clock,
  Cpu,
  Star,
  Mail,
  MessageCircle,
  Phone,
  Copy,
  User,
  Send,
} from "lucide-react";

import { InfoRow, SectionCard, formatReward, copyToClipboard } from "../page";

interface PostContentProps {
  post: any;
  speciesEmoji: string;
  isLost: boolean;
  isActive: boolean;
  headline: string;
  hasPhotos: boolean;
  daysSincePosted: number;
  owner: any;
  onContact: (type: "email" | "whatsapp") => void;
}

export const PostContent = ({
  post,
  speciesEmoji,
  isLost,
  isActive,
  headline,
  hasPhotos,
  daysSincePosted,
  owner,
  onContact,
}: PostContentProps) => {
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-4">
        {/* Photos */}
        <Card className="bg-white dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          <CardBody className="p-0">
            <div className="relative aspect-[16/9] bg-zinc-100 dark:bg-zinc-800/60  rounded-md">
              {hasPhotos ? (
                <Image
                  src={post.photos[activePhoto]}
                  alt={headline}
                  fill
                  className="object-cover "
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-7xl  rounded-md">
                  {speciesEmoji}
                </div>
              )}

              <div className="absolute top-3 left-3 flex gap-2">
                <Chip
                  size="sm"
                  classNames={{
                    base: `${isLost ? "bg-red-500" : "bg-amber-500"} shadow-md`,
                    content: "text-white font-bold text-[11px] tracking-wide",
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

            {hasPhotos && post.photos.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {post.photos.map((photo: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`relative size-14 shrink-0 rounded-md overflow-hidden border-2 transition-all ${i === activePhoto ? "border-steel-blue dark:border-lime-burst scale-95" : "border-transparent opacity-60 hover:opacity-100"}`}
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

        {/* Details */}
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
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        {/* Pet Summary */}
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

        {/* Owner Info */}
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
            {owner?.email && (
              <div className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800">
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
            {post.posterPhone && (
              <div className="flex items-center justify-between px-3 py-2 rounded-md bg-zinc-50 dark:bg-zinc-800">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="size-3.5 text-zinc-400 shrink-0" />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                    {post.posterPhone}
                  </span>
                </div>
                <Tooltip content="Copy phone">
                  <button
                    onClick={() => copyToClipboard(post.posterPhone, "Phone")}
                    className="text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst transition-colors shrink-0 ml-2"
                  >
                    <Copy className="size-3.5" />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Contact Actions */}
        <SectionCard title="Contact Owner" icon={<Send className="size-4" />}>
          <div className="space-y-2">
            <Button
              fullWidth
              size="sm"
              onPress={() => onContact("email")}
              className="bg-steel-blue text-white text-xs font-semibold justify-start"
              startContent={<Mail className="size-3.5" />}
            >
              Send Email
            </Button>
            <Button
              fullWidth
              size="sm"
              onPress={() => onContact("whatsapp")}
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

        {/* Post Meta */}
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
  );
};
