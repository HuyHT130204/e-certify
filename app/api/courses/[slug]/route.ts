import { NextResponse } from "next/server";
import { COURSE_DB } from "@/lib/mock-data";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = COURSE_DB[slug];
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(course);
}


