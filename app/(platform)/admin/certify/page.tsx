"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

export default function CertifyPage() {
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState<string>("");

  const runBatchMint = async () => {
    setStatus("Minting...");
    // This page is a thin UI; actual minting should be a secured server script.
    // Hook up to your admin endpoint or run script in background as needed.
    try {
      // placeholder
      await new Promise((r) => setTimeout(r, 800));
      setStatus("Done (placeholder). Connect to admin script).");
    } catch (e: any) {
      setStatus(e?.message || "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Issue Certificates</h1>
      <Card>
        <CardHeader>
          <CardTitle>Batch Mint cNFT Certificates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input className="w-full rounded-md border px-3 py-2" placeholder="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
          <Button type="button" onClick={runBatchMint} disabled={!courseId}>Run</Button>
          {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}









