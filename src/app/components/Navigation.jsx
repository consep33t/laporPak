"use client";
import { usePathname } from "next/navigation";
import TopNavbar from "./TopNavbar";
import BottomNav from "./BottomNav";

export default function Navigation() {
  const pathname = usePathname();

  // Hide navigation on auth and admin routes
  const hideNavigation = pathname.startsWith("/auth") || pathname.startsWith("/admin");

  if (hideNavigation) return null;

  return (
    <>
      <TopNavbar />
      <BottomNav />
    </>
  );
}
