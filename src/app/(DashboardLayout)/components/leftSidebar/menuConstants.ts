import {
  PawPrint,
  Heart,
  Stethoscope,
  Bell,
  Users,
  User,
  FileText,
} from "lucide-react";

export const navItems = [
  { href: "/user/newsfeed", label: "News Feed", icon: PawPrint },
  { href: "/user/my-pets", label: "My Pets", icon: Heart },
  { href: "/user/health", label: "Health", icon: Stethoscope },
  {
    href: "/user/reminders",
    label: "Reminders",
    icon: Bell,
    badge: 2,
  },
  {
    href: "/user/create-article",
    label: "Create Article",
    icon: FileText,
  },
  { href: "/user/friends", label: "Friends", icon: Users },
  { href: "/user/profile", label: "Profile", icon: User },
];
