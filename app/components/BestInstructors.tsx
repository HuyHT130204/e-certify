"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { UserAvatar } from "@/app/components/user-avatar";
import Link from "next/link";

interface Instructor {
  id: string;
  name: string;
  email: string;
  courseCount: number;
}

interface BestInstructorsProps {
  instructors?: Instructor[];
}

export function BestInstructors({ instructors }: BestInstructorsProps) {
  const displayInstructors: Instructor[] = instructors || [
    { id: "1", name: "Devon Lane", email: "devon.lane@example.com", courseCount: 5 },
    { id: "2", name: "Albert Flores", email: "albert.flores@example.com", courseCount: 8 },
    { id: "3", name: "Jane Cooper", email: "jane.cooper@example.com", courseCount: 6 },
    { id: "4", name: "Cody Fisher", email: "cody.fisher@example.com", courseCount: 12 },
  ];

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900">
            Best Instructors
          </CardTitle>
          <Button 
            variant="link" 
            size="sm" 
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold h-auto p-0"
            asChild
          >
            <Link href="/instructors">See All</Link>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {displayInstructors.map((instructor) => (
            <div
              key={instructor.id}
              className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              {/* Avatar with Status */}
              <div className="relative shrink-0">
                <UserAvatar value={instructor.email} size={48} />
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white"></div>
              </div>

              {/* Instructor Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-900 truncate mb-0.5">
                  {instructor.name}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {instructor.courseCount} Design Courses
                </p>
              </div>

              {/* Courses Button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="shrink-0 border border-slate-300 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 font-medium h-8 px-4"
                asChild
              >
                <Link href={`/instructors/${instructor.id}`}>
                  Courses
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}