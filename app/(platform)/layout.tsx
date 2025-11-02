import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import AuthButton from "@/app/components/auth-button";
import PlatformHeader from "@/app/components/PlatformHeader";
import { SidebarNav } from "./_components/sidebar-nav";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { cn } from "@/lib/utils";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  // Use getUser() for server components
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Layout auth error:", error);
    redirect("/login");
  }

  // Get the role from JWT token (user_role claim added by Auth Hook)
  // Fallback to database query if JWT claim is not available
  let userRole = 'student';
  let userEmail = user.email || '';
  
  // Try to get role from JWT token first (faster, no DB query)
  if ((user as any).user_metadata?.user_role) {
    userRole = (user as any).user_metadata.user_role;
  } else if ((user as any).app_metadata?.user_role) {
    userRole = (user as any).app_metadata.user_role;
  } else {
    // Fallback: query database if JWT claim is not available
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        userRole = profile.role || 'student';
      }
    } catch (error) {
      // Silently fail and default to student role
    }
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Left Sidebar - Always Fixed, Never Scrolls with Page */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen border-r bg-card transition-all duration-300 flex flex-col",
          // Desktop: full width sidebar, always fixed
          "lg:w-64",
          // Tablet: collapsed (icons only), always fixed
          "hidden md:flex md:w-20",
        )}
      >
        {/* Logo Section - Fixed at top */}
        <div className="p-4 lg:p-6 border-b flex items-center justify-start shrink-0 bg-card">
          <Link href="/dashboard" className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shrink-0">
              <GraduationCap className="h-5 w-5 lg:h-7 lg:w-7" />
            </div>
            <span className="hidden lg:inline-block text-lg lg:text-xl font-bold text-foreground whitespace-nowrap">
              E-Certify
            </span>
          </Link>
        </div>

        {/* Navigation - Scrollable middle section */}
        <SidebarNav userRole={userRole} />

        {/* Bottom Section - Fixed at bottom */}
        <div className="hidden lg:flex border-t bg-card shrink-0 flex-col gap-4">
          {/* Join Course Card (only for students) */}
          {userRole === 'student' && (
            <div className="p-4">
              <Card className="border-2 border-secondary bg-secondary/20 shadow-md">
                <CardContent className="p-4">
                  <div className="mb-3 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary shadow-sm">
                      <GraduationCap className="h-8 w-8 text-secondary-foreground" />
                    </div>
                  </div>
                  <p className="mb-4 text-center text-sm font-medium text-foreground">
                    Ready to start learning?
                  </p>
                  <Button className="w-full bg-primary text-primary-foreground hover:opacity-90 shadow-lg" asChild>
                    <Link href="/courses">
                      Join Course
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Auth Button */}
          <div className="p-4 pt-0">
            <AuthButton userEmail={userEmail} />
          </div>
        </div>
      </aside>

      {/* Main Content Area - Separate scroll, accounts for sidebar width */}
      <div className={cn(
        "flex flex-col min-h-screen",
        // Add left margin/padding to account for fixed sidebar
        "md:ml-20 lg:ml-64"
      )}>
        <PlatformHeader userEmail={userEmail} />
        <main className="flex-1 overflow-y-auto bg-muted/20 overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
}
