import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { COURSES } from "@/lib/mock-data";

export async function GET() {
  try {
    // Try to fetch from Supabase first
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Check if table doesn't exist
    if (error) {
      const errorMessage = error.message || String(error);
      const isTableNotFound = errorMessage.includes("Could not find the table") || 
                              errorMessage.includes("does not exist") ||
                              errorMessage.includes("relation") && errorMessage.includes("does not exist");
      
      if (isTableNotFound) {
        // Table doesn't exist - return mock data silently
        return NextResponse.json(COURSES);
      }
      // Other errors - still return mock data but could log if needed
      return NextResponse.json(COURSES);
    }
    
    // If we have data, return it
    if (data && data.length > 0) {
      return NextResponse.json(data);
    }
    
    // No data in table - return mock data
    return NextResponse.json(COURSES);
  } catch (error: any) {
    // Any other error - return mock data
    return NextResponse.json(COURSES);
  }
}


