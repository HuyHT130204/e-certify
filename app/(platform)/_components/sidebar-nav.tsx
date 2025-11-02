// app/(platform)/_components/sidebar-nav.tsx
// All code and comments must be in English.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookCopy,
  ShieldCheck,
  Settings,
  Users,
  GraduationCap,
  ShieldAlert,
  FileText,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";

// Define role-specific navigation items
const studentNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/courses", icon: BookCopy, label: "Browse Courses" },
  { href: "/passport", icon: ShieldCheck, label: "Skills Passport" },
  { href: "/settings", icon: Settings, label: "My Settings" },
];

const teacherNav = [
  { href: "/teacher/dashboard", icon: LayoutDashboard, label: "Teacher Dashboard" },
  { href: "/create-course", icon: BookCopy, label: "Create Course" },
  { href: "/teacher/courses", icon: FileText, label: "My Courses" },
  { href: "/teacher/students", icon: Users, label: "My Students" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const adminNav = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Admin Dashboard" },
  { href: "/admin/users", icon: Users, label: "User Management" },
  { href: "/admin/courses", icon: BookCopy, label: "Course Management" },
  { href: "/admin/certify", icon: Award, label: "Certification Center" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

// Helper to get the correct nav based on role
const getNavItems = (role: string) => {
  switch (role) {
    case 'admin':
      return adminNav;
    case 'teacher':
      return teacherNav;
    default:
      return studentNav;
  }
};

export function SidebarNav({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const navItems = getNavItems(userRole);

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto min-h-0 overscroll-contain">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Button
            key={item.href}
            variant="ghost"
            className={cn(
              "justify-start text-left h-12 w-full transition-all rounded-lg",
              "md:justify-center lg:justify-start",
              "md:px-2 lg:px-4",
              isActive
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
            )}
            asChild
          >
            <Link href={item.href}>
              <Icon className="h-5 w-5 shrink-0 md:mx-0 lg:mr-3" />
              <span className="hidden lg:inline-block">
                {item.label}
              </span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

