import { useCurrentUser } from "@/src/redux/features/auth/authSlice";
import { useAppSelector } from "@/src/redux/hooks";
import {
  PawPrint,
  Heart,
  Stethoscope,
  Bell,
  Users,
  User,
  FileText,
  Home,
  Newspaper,
  DollarSign,
  Pen,
  Building2,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const userLinks: NavItem[] = [
  { href: "/user/newsfeed", label: "News Feed", icon: PawPrint },
  { href: "/user/my-pets", label: "My Pets", icon: Heart },
  { href: "/user/health", label: "Health", icon: Stethoscope },
  {
    href: "/user/reminders",
    label: "Reminders",
    icon: Bell,
    // badge: 2,
  },
  {
    href: "/user/create-article",
    label: "Create Article",
    icon: FileText,
  },
  { href: "/user/friends", label: "Friends", icon: Users },
  { href: "/user/profile", label: "Profile", icon: User },
];

export const adminLinks: NavItem[] = [
  {
    href: "/admin/dashboard",
    label: "Admin Dashboard",
    icon: Home,
    // icon: <Home size={16} />,
  },
  { href: "/admin/vets", label: "Vets", icon: Building2 },

  {
    href: "/admin/manage-users",
    label: "Manage Users",
    // icon: <Users size={16} />,
    icon: Users,
  },
  {
    href: "/admin/manage-articles",
    label: "Manage Articles",
    // icon: <Newspaper size={16} />,
    icon: Newspaper,
  },
  {
    href: "/admin/manage-payments",
    label: "Manage Payments",
    // icon: <DollarSign size={16} />,
    icon: DollarSign,
  },
  { href: "/admin/my-profile", label: "My Profile", icon: User },
  {
    href: "/admin/edit-profile",
    label: "Edit Profile",
    // icon: <Pen size={16} />,
    icon: Pen,
  },
];
