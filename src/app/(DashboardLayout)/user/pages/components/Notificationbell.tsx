"use client";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Avatar,
  Chip,
} from "@heroui/react";
import {
  Bell,
  MessageCircle,
  Eye,
  Star,
  Users,
  UserPlus,
  CheckCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/src/redux/features/notifications/notificationsApi";

//   icon + color per notification type
const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; label: string }
> = {
  comment: {
    icon: <MessageCircle className="size-3.5" />,
    color: "bg-steel-blue/10 text-steel-blue dark:text-lime-burst",
    label: "Comment",
  },
  sighting: {
    icon: <Eye className="size-3.5" />,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    label: "Sighting",
  },
  helpful_lead: {
    icon: <Star className="size-3.5 fill-current" />,
    color: "bg-lime-burst/10 text-lime-600 dark:text-lime-burst",
    label: "Helpful Lead",
  },
  invitation: {
    icon: <Users className="size-3.5" />,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    label: "Invitation",
  },
  friend_request: {
    icon: <UserPlus className="size-3.5" />,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    label: "Friend Request",
  },
};

//   nav target per notification
const getNavTarget = (n: any): string => {
  if (n.targetType === "LostFound")
    return `/user/quickAccess/lost-found/${n.targetId}`;
  if (n.targetType === "Article") return `/user/article/${n.targetId}`;
  return "#";
};

//   single notification row
const NotificationRow = ({
  notification,
  onRead,
}: {
  notification: any;
  onRead: (id: string, url: string) => void;
}) => {
  const config = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.comment;
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <button
      onClick={() => onRead(notification._id, getNavTarget(notification))}
      className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
        !notification.isRead ? "bg-steel-blue/5 dark:bg-lime-burst/5" : ""
      }`}
    >
      {/* avatar + type icon */}
      <div className="relative shrink-0">
        <Avatar
          size="sm"
          name={notification.sender?.name?.charAt(0).toUpperCase() || "?"}
          src={notification.sender?.profilePhoto || undefined}
          classNames={{
            base: "bg-steel-blue/20 dark:bg-steel-blue/30",
            name: "text-steel-blue dark:text-lime-burst text-xs font-bold",
          }}
        />
        <span
          className={`absolute -bottom-1 -right-1 p-0.5 rounded-full ${config.color}`}
        >
          {config.icon}
        </span>
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug">
          {notification.message}
        </p>
        <p className="text-[10px] text-zinc-400 mt-0.5">{timeAgo}</p>
      </div>

      {/* unread dot */}
      {!notification.isRead && (
        <span className="shrink-0 size-2 rounded-full bg-steel-blue dark:bg-lime-burst mt-1" />
      )}
    </button>
  );
};

const NotificationBell = () => {
  const router = useRouter();

  const { data } = useGetMyNotificationsQuery(undefined, {
    pollingInterval: 30000,
  });

  //   console.log(data);

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = data?.data?.notifications ?? [];
  const unreadCount = data?.data?.unreadCount ?? 0;

  const handleRead = async (notificationId: string, url: string) => {
    await markAsRead(notificationId);
    if (url !== "#") router.push(url);
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead(undefined);
  };

  return (
    <Popover placement="bottom-end" showArrow>
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative text-zinc-600 dark:text-zinc-300"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <Chip
                size="sm"
                classNames={{
                  base: "bg-steel-blue/10 dark:bg-lime-burst/10 h-4",
                  content:
                    "text-steel-blue dark:text-lime-burst text-[10px] font-bold px-1",
                }}
              >
                {unreadCount} new
              </Chip>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-steel-blue dark:hover:text-lime-burst transition-colors"
            >
              <CheckCheck className="size-3" />
              Mark all read
            </button>
          )}
        </div>

        {/* list */}
        <div className="max-h-96 overflow-y-auto py-1 space-y-0.5 px-1">
          {notifications.length === 0 ? (
            <div className="py-10 text-center">
              <Bell className="size-8 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
              <p className="text-xs text-zinc-400">No notifications yet</p>
            </div>
          ) : (
            notifications.map((n: any) => (
              <NotificationRow
                key={n._id}
                notification={n}
                onRead={handleRead}
              />
            ))
          )}
        </div>

        {/* footer */}
        {notifications.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-2 text-center">
            <p className="text-[10px] text-zinc-400">
              Showing last {notifications.length} notifications
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
