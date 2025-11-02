import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const course = searchParams.get("course");
  const lesson = searchParams.get("lesson");
  if (!course || !lesson) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("id, title, mux_playback_id, slug, course_id, courses!inner(slug)")
    .eq("slug", lesson)
    .eq("courses.slug", course)
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: data.id, title: data.title, mux_playback_id: data.mux_playback_id });
}


