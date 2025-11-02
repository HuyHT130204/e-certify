"use client";

import { Button } from "@/app/components/ui/button";
import { GraduationCap, PlayCircle } from "lucide-react";

export function BannerHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground shadow-lg">
      <div className="relative z-10 max-w-2xl">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-3 py-1">
          <GraduationCap className="h-4 w-4" />
          <p className="text-xs font-medium uppercase tracking-wider opacity-90">Online Learning Platform</p>
        </div>
        <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
          Sharpen your skills with professional online courses
        </h2>
        <p className="mt-3 text-sm opacity-90 md:text-base">
          Learn from industry experts and earn verifiable on-chain certificates
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Button 
            size="lg" 
            className="bg-primary-foreground text-primary hover:opacity-90"
          >
            Explore Courses
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Watch Demo
          </Button>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
    </div>
  );
}




