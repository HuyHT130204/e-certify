// app/(platform)/dashboard/page.tsx
// All code and comments must be in English.
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StudentDashboard from "./_components/student-dashboard";

export default async function Dashboard() {
  const supabase = await createClient();
  
  // Use getUser() instead of getSession() for server components
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    console.error("Dashboard auth error:", error);
    redirect("/login");
  }

  // Get the role from JWT token (user_role claim added by Auth Hook)
  // Fallback to database query if JWT claim is not available
  let userRole = 'student';
  
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
      console.error('Failed to fetch user role:', error);
    }
  }

  // Redirect to role-specific dashboard
  if (userRole === 'admin') {
    redirect('/admin/dashboard');
  }
  
  if (userRole === 'teacher') {
    redirect('/teacher/dashboard');
  }

  // Default to student dashboard
  return <StudentDashboard />;
}
