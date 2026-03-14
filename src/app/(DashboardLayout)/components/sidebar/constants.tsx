import {
  Home,
  User,
  Pen,
  DollarSign,
  Newspaper,
  Users,
  NotebookText,
  PawPrint,
  HeartPulse,
  Bell,
  Settings,
} from "lucide-react";

export const userLinks = [
  { href: "/user/newsfeed", label: "News Feed", icon: <Home size={16} /> },
  { href: "/user/pets", label: "My Pets", icon: <PawPrint size={16} /> },
  {
    href: "/user/health-passport",
    label: "Health Passport",
    icon: <HeartPulse size={16} />,
  },
  { href: "/user/reminders", label: "Reminders", icon: <Bell size={16} /> },
  {
    href: "/user/create-article",
    label: "Create Article",
    icon: <Pen size={16} />,
  },
  { href: "/user/my-friends", label: "My Friends", icon: <Users size={16} /> },
  { href: "/user/pages", label: "My Pages", icon: <NotebookText size={16} /> },
  { href: "/user/profile", label: "My Profile", icon: <User size={16} /> },
  {
    href: "/user/manage-articles",
    label: "Manage Articles",
    icon: <Newspaper size={16} />,
  },
];

export const adminLinks = [
  {
    href: "/admin/dashboard",
    label: "Admin Dashboard",
    icon: <Home size={16} />,
  },
  {
    href: "/admin/manage-users",
    label: "Manage Users",
    icon: <Users size={16} />,
  },
  {
    href: "/admin/manage-articles",
    label: "Manage Articles",
    icon: <Newspaper size={16} />,
  },
  {
    href: "/admin/manage-payments",
    label: "Manage Payments",
    icon: <DollarSign size={16} />,
  },
  { href: "/admin/my-profile", label: "My Profile", icon: <User size={16} /> },
  {
    href: "/admin/edit-profile",
    label: "Edit Profile",
    icon: <Pen size={16} />,
  },
];
