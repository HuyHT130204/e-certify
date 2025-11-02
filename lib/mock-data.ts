// Shared mock data for courses and lessons

const DEMO_PLAYBACK_ID = process.env.NEXT_PUBLIC_MUX_DEMO_PLAYBACK_ID || null;

export const COURSES = [
  { id: "c1", title: "Beginner's Guide To Becoming A Professional Frontend Developer", slug: "frontend-101", description: "Learn React, UI, and tooling.", thumbnail_url: "" },
  { id: "c2", title: "Product Design Essentials", slug: "product-design", description: "Design thinking & prototyping.", thumbnail_url: "" },
  { id: "c3", title: "Software Development", slug: "software-dev", description: "Backend, databases, and cloud.", thumbnail_url: "" },
];

export const COURSE_DB: Record<string, any> = {
  "frontend-101": {
    id: "c1",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    slug: "frontend-101",
    description: "Learn React, UI, and tooling.",
    lessons: [
      { id: "l1", title: "Introduction to Web", slug: "intro", mux_playback_id: DEMO_PLAYBACK_ID },
      { id: "l2", title: "React Components", slug: "react-components", mux_playback_id: DEMO_PLAYBACK_ID },
    ],
  },
  "product-design": {
    id: "c2",
    title: "Product Design Essentials",
    slug: "product-design",
    description: "Design thinking & prototyping.",
    lessons: [
      { id: "l3", title: "User Research", slug: "user-research", mux_playback_id: DEMO_PLAYBACK_ID },
      { id: "l4", title: "Wireframing", slug: "wireframing", mux_playback_id: DEMO_PLAYBACK_ID },
    ],
  },
};

// For client components - playback ID needs to be available at runtime
export function getCourseBySlug(slug: string) {
  const course = COURSE_DB[slug];
  if (!course) return null;
  // In client, we'll fetch playback ID from API if needed
  return course;
}






