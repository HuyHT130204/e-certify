"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import EnrollButton from "@/app/components/enroll-button";
import { BookOpen, Clock, Play } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Lesson {
  id: string;
  title: string;
  slug: string;
  order_index: number;
  mux_playback_id: string | null;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  lessons?: Lesson[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${slug}`);
        if (!res.ok) {
          toast.error("Course not found");
          router.push("/courses");
          return;
        }
        const courseData = await res.json();
        setCourse(courseData);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: enrollmentData } = await supabase
            .from("enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", courseData.id)
            .maybeSingle();
          setIsEnrolled(!!enrollmentData);
        }
      } catch (error) {
        console.error("Failed to load course:", error);
        toast.error("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadCourse();
    }
  }, [slug, supabase, router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-muted-foreground">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Course not found</p>
          <Button className="mt-4" asChild>
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const lessons = course.lessons || [];
  const firstLesson = lessons.length > 0 ? lessons[0] : null;

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <Button variant="ghost" asChild>
          <Link href="/courses">← Back to Courses</Link>
        </Button>
        
        <div className="flex gap-6">
          <div className="relative h-64 w-full max-w-md overflow-hidden rounded-xl bg-primary shadow-lg" style={{ backgroundColor: 'hsl(280, 85%, 60%)' }}>
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <BookOpen className="h-24 w-24 text-primary-foreground opacity-30" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">{course.title}</h1>
              {course.description && (
                <p className="mt-2 text-lg text-muted-foreground">{course.description}</p>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Intermediate</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isEnrolled && firstLesson ? (
                <Button size="lg" asChild>
                  <Link href={`/learning/${course.slug}/${firstLesson.slug}`}>
                    <Play className="mr-2 h-5 w-5" />
                    Continue Learning
                  </Link>
                </Button>
              ) : (
                <EnrollButton
                  courseId={course.id}
                  courseSlug={course.slug}
                  firstLessonSlug={firstLesson?.slug || ""}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {lessons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Course Lessons</CardTitle>
            <CardDescription>
              {lessons.length} lesson{lessons.length > 1 ? "s" : ""} in this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lessons
                .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                .map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold" style={{ backgroundColor: 'hsl(280, 85%, 60%, 0.1)' }}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{lesson.title}</h3>
                    </div>
                    {isEnrolled ? (
                      <Button size="sm" asChild>
                        <Link href={`/learning/${course.slug}/${lesson.slug}`}>
                          <Play className="mr-2 h-4 w-4" />
                          Watch
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Enroll to access
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

