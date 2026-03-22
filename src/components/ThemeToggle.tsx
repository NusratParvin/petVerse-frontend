"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "petverse-dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "petverse-light" : "petverse-dark")}
      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
    >
      {isDark ? (
        <Sun size={14} className="text-pv-yellow" />
      ) : (
        <Moon size={14} className="text-pv-purple" />
      )}
    </button>
  );
}
