"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function EnrollButton({
  courseId,
  courseSlug,
  firstLessonSlug,
}: {
  courseId: string;
  courseSlug: string;
  firstLessonSlug: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase.from("enrollments").insert({
        user_id: user.id,
        course_id: courseId,
      });

      if (error) {
        if (error.code === "23505") {
          // Already enrolled
          router.push(`/learning/${courseSlug}/${firstLessonSlug}`);
        } else {
          toast.error("Failed to enroll: " + error.message);
        }
      } else {
        toast.success("Successfully enrolled!");
        router.push(`/learning/${courseSlug}/${firstLessonSlug}`);
      }
    } catch (error: any) {
      toast.error("Failed to enroll: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleEnroll} size="lg" disabled={loading}>
      {loading ? "Enrolling..." : "Enroll Now"}
    </Button>
  );
}




