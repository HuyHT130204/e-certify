"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ChevronDown, MoreVertical } from "lucide-react";
import Link from "next/link";

interface PopularCoursesProps {
  courses?: any[];
}

export function PopularCourses({ courses = [] }: PopularCoursesProps) {
  const [selectedFilter, setSelectedFilter] = useState("All Courses");

  const displayCourses = courses.length > 0 ? courses : [
    { 
      id: "1", 
      title: "Web Design", 
      slug: "web-design", 
      description: "20+ Courses",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-400 to-orange-500"
    },
    { 
      id: "2", 
      title: "UI/UX Design", 
      slug: "uiux-design", 
      description: "38+ Courses",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-400 to-pink-500"
    },
    { 
      id: "3", 
      title: "UI/UX Design", 
      slug: "uiux-design-2", 
      description: "50+ Courses",
      color: "from-red-400 to-rose-500",
      bgColor: "bg-gradient-to-br from-red-400 to-rose-500"
    },
    { 
      id: "4", 
      title: "UI/UX Design", 
      slug: "uiux-design-3", 
      description: "18+ Courses",
      color: "from-teal-400 to-cyan-500",
      bgColor: "bg-gradient-to-br from-teal-400 to-cyan-500"
    },
  ];

  const getGradient = (index: number) => {
    const gradients = [
      { bg: "bg-gradient-to-br from-yellow-400 to-orange-500" },
      { bg: "bg-gradient-to-br from-purple-400 to-pink-500" },
      { bg: "bg-gradient-to-br from-red-400 to-rose-500" },
      { bg: "bg-gradient-to-br from-teal-400 to-cyan-500" },
      { bg: "bg-gradient-to-br from-blue-400 to-indigo-500" },
      { bg: "bg-gradient-to-br from-green-400 to-emerald-500" }
    ];
    return gradients[index % gradients.length];
  };

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900">
            Popular Courses
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs text-slate-600 hover:text-slate-900 h-8 px-2"
          >
            {selectedFilter}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {displayCourses.map((course, index) => {
            const gradient = getGradient(index);
            
            return (
              <div
                key={course.id}
                className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-200"
              >
                {/* Icon Circle */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${gradient.bg} shadow-sm`}>
                  <span className="text-lg font-bold text-white">
                    {course.title.charAt(0)}
                  </span>
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-slate-900 truncate mb-0.5">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">
                    {course.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium h-8 px-3"
                    asChild
                  >
                    <Link href={`/courses/${course.slug}`}>
                      View course
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-slate-600"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Link */}
        <Button 
          variant="ghost" 
          className="w-full mt-3 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium"
          asChild
        >
          <Link href="/courses">
            View All Courses
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}