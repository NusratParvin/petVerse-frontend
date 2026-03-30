"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = !mounted || theme === "petverse-dark";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 transition-all duration-500"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #020812 0%, #041020 40%, #030a1a 70%, #020812 100%)"
            : "#ffffff",
          // "linear-gradient(135deg, #ffffff 0%, #f0eeff 25%, #e8f4ff 50%, #eefff8 75%, #ffffff 100%)",
        }}
      />

      {/* Center nebula */}
      <div
        className="fixed top-[-40%] left-[-5%] w-[700px] h-[600px] rounded-full pointer-events-none z-0 transition-all duration-500"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(30,80,200,0.35) 0%, rgba(10,40,120,0.18) 40%, transparent 70%)"
            : // "radial-gradient(circle, rgba(49,214,24,0.15) 0%, rgba(10,40,120,0.18) 40%, transparent 70%)"

              "#ffffff",
          // "radial-gradient(circle, rgba(37,211,102,0.35) 0%, rgba(150,200,255,0.12) 40%, transparent 70%)",
        }}
      />

      {/* Right nebula */}
      <div
        className="fixed top-[30%] right-[-5%] w-[450px] h-[450px] rounded-full pointer-events-none z-0 transition-all duration-500"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(20,60,180,0.2) 0%, rgba(5,20,80,0.08) 50%, transparent 70%)"
            : "#ffffff",
          // "radial-gradient(circle, rgba(37,211,102,0.2) 0%, rgba(150,230,200,0.1) 50%, transparent 70%)",
        }}
      />

      {/* Bottom nebula */}
      <div
        className="fixed bottom-[-10%] left-[30%] w-[400px] h-[300px] rounded-full pointer-events-none z-0 transition-all duration-500"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(15,50,150,0.15) 0%, transparent 70%)"
            : "#ffffff",
          // "radial-gradient(circle, rgba(200,180,255,0.2) 0%, transparent 70%)",
        }}
      />

      {/* Content sits on top of background */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
