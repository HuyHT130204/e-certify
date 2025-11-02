"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CheckCircle, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  order_index: number;
}

interface LessonProgress {
  lesson_id: string;
}

export default function LearningLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseSlug: string }>;
}) {
  const [courseSlug, setCourseSlug] = useState<string>("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [courseTitle, setCourseTitle] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const slug = resolvedParams.courseSlug;
      setCourseSlug(slug);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      try {
        // Fetch course with lessons
        const courseRes = await fetch(`/api/courses/${slug}`);
        if (!courseRes.ok) return;
        const courseData = await courseRes.json();
        setCourseTitle(courseData.title || "");
        const lessonsList = (courseData.lessons || []).sort(
          (a: Lesson, b: Lesson) => (a.order_index || 0) - (b.order_index || 0)
        );
        setLessons(lessonsList);

        // Fetch user progress
        if (user) {
          const { data: progressData } = await supabase
            .from("lesson_progress")
            .select("lesson_id")
            .in(
              "lesson_id",
              lessonsList.map((l: Lesson) => l.id)
            );
          setProgress(progressData || []);
        }
      } catch (error) {
        console.error("Failed to load course data:", error);
      }
    };

    loadData();
  }, [params]);

  const currentLessonSlug = pathname.split("/").pop() || "";

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6 p-6">
      {/* Lesson Sidebar */}
      <aside className="hidden w-80 shrink-0 lg:block">
        <Card className="h-full overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="line-clamp-2 text-lg">{courseTitle || "Course Lessons"}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <nav className="space-y-1 p-4">
                {lessons.length > 0 ? (
                  lessons.map((lesson, index) => {
                    const isCompleted = progress.some((p) => p.lesson_id === lesson.id);
                    const isActive = lesson.slug === currentLessonSlug;
                    const href = `/learning/${courseSlug}/${lesson.slug}`;

                    return (
                      <Link
                        key={lesson.id}
                        href={href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg p-3 transition-all",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "hover:bg-muted",
                          isCompleted && !isActive && "border-l-2 border-success"
                        )}
                      >
                        <div className="shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <PlayCircle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium line-clamp-1",
                            isActive ? "text-primary-foreground" : "text-foreground"
                          )}>
                            {index + 1}. {lesson.title}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No lessons available
                  </div>
                )}
              </nav>
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

