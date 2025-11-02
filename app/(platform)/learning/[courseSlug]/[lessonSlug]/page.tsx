"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@/app/components/ui/button";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Lesson = {
  id: string;
  title: string;
  slug: string;
  mux_playback_id: string | null;
};

export default function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const [courseSlug, setCourseSlug] = useState("");
  const [lessonSlug, setLessonSlug] = useState("");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const slug = resolvedParams.courseSlug;
      const lessonSlug = resolvedParams.lessonSlug;
      setCourseSlug(slug);
      setLessonSlug(lessonSlug);

      try {
        const res = await fetch(`/api/courses/${slug}`);
        if (!res.ok) {
          setLesson(null);
          setLoading(false);
          return;
        }
        const course = await res.json();
        const found = (course?.lessons || []).find(
          (l: any) => l.slug === lessonSlug
        );
        setLesson(found || null);

        // Check if lesson is completed
        const { data: { user } } = await supabase.auth.getUser();
        if (user && found) {
          const { data: progressData } = await supabase
            .from("lesson_progress")
            .select("id")
            .eq("user_id", user.id)
            .eq("lesson_id", found.id)
            .maybeSingle();
          setIsCompleted(!!progressData);
        }
      } catch (error) {
        console.error("Failed to load lesson:", error);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params, supabase]);

  const handleMarkComplete = async () => {
    if (!lesson) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please log in to mark lessons as complete");
      return;
    }

    try {
      const { error } = await supabase.from("lesson_progress").upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        progress_percentage: 100,
        completed_at: new Date().toISOString(),
      });

      if (error) throw error;

      setIsCompleted(true);
      toast.success("Lesson marked as complete!");
    } catch (error: any) {
      console.error("Failed to mark lesson complete:", error);
      toast.error("Failed to mark lesson as complete");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading lesson...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Lesson not found</p>
          <p className="text-sm text-muted-foreground mt-2">
            This lesson doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lesson Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{lesson.title}</h1>
      </div>

      {/* Video Player */}
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg">
        {lesson.mux_playback_id ? (
          <MuxPlayer
            playbackId={lesson.mux_playback_id}
            streamType="on-demand"
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white">
            <div className="text-center">
              <p className="text-lg font-semibold">Video is processing</p>
              <p className="text-sm opacity-80 mt-2">
                Please check back later or contact support.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Complete Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleMarkComplete}
          disabled={isCompleted}
          size="lg"
          className={isCompleted ? "bg-success text-success-foreground" : ""}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Completed
            </>
          ) : (
            "Mark as Complete"
          )}
        </Button>
      </div>
    </div>
  );
}





