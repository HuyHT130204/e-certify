"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export default function CreateCoursePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const requestUploadUrl = async () => {
    const res = await fetch("/api/mux/upload", { method: "POST" });
    const data = await res.json();
    setUploadUrl(data.uploadUrl || null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Course</h1>
      <Card>
        <CardHeader>
          <CardTitle>Course Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input className="w-full rounded-md border px-3 py-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="w-full rounded-md border px-3 py-2" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <div className="flex gap-3">
            <Button type="button" onClick={requestUploadUrl}>Get Mux Upload URL</Button>
            {uploadUrl ? (
              <a href={uploadUrl} className="text-sm text-blue-600 underline" target="_blank" rel="noreferrer">Open Upload URL</a>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}









