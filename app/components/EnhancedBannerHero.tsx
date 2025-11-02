"use client";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { GraduationCap, Users, Sparkles, ArrowRight } from "lucide-react";

export function EnhancedBannerHero() {
  return (
    <div className="space-y-4">
      {/* Main Hero Banner - Compact Design */}
      <Card className="relative overflow-hidden border-none bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
        <CardContent className="relative p-8 md:p-10">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex items-center justify-between">
            {/* Left Content */}
            <div className="max-w-xl space-y-4">
              {/* Badge */}
              <Badge 
                variant="outline" 
                className="border border-white/30 bg-white/20 text-white backdrop-blur-sm px-3 py-1 text-xs font-semibold"
              >
                <Sparkles className="h-3 w-3 mr-1.5" />
                Learn Effectively With Us!
              </Badge>

              {/* Headline */}
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Get 30% Off every courses in January.
              </h2>
              
              <p className="text-sm md:text-base text-white/90">
                Start your learning journey today and unlock your potential with professional courses from industry experts.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button 
                  size="default"
                  className="bg-white text-indigo-600 hover:bg-white/90 shadow-lg font-semibold"
                >
                  Explore Courses
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className="border border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm font-semibold"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Stats - Inline & Compact */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Students */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Students</p>
                  <p className="text-2xl font-bold text-white">50,000+</p>
                </div>
              </div>

              {/* Expert Mentors */}
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Expert Mentors</p>
                  <p className="text-2xl font-bold text-white">500+</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Stats - Only show on mobile */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <GraduationCap className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600">Students</p>
                <p className="text-xl font-bold text-slate-900">50K+</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600">Mentors</p>
                <p className="text-xl font-bold text-slate-900">500+</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}