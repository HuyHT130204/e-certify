"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { UserAvatar } from "@/app/components/user-avatar";
import { Badge } from "@/app/components/ui/badge";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  "Senior Frontend Developer",
  "Full Stack Engineer",
  "UI/UX Designer",
  "Product Designer",
];

const roleColors = ["primary", "secondary", "accent", "info"] as const;

export function MentorItem({ 
  name, 
  role, 
  color 
}: { 
  name: string;
  role: string;
  color: typeof roleColors[number];
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-3">
        <UserAvatar value={name} size={40} />
        <div>
          <p className="text-sm font-semibold">{name}</p>
          <Badge variant="secondary" className="mt-1 text-xs">
            {role}
          </Badge>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        className="text-xs"
      >
        Follow
      </Button>
    </div>
  );
}

export function MentorPanel() {
  const mentors = [
    "Prashant Kumar Singh",
    "Ravi Kumar",
    "Arun Raj",
    "Isha Kapoor",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-primary" />
          Top Mentors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mentors.map((m, i) => (
          <MentorItem
            key={m}
            name={m}
            role={roles[i] || roles[0]}
            color={roleColors[i % roleColors.length]}
          />
        ))}
      </CardContent>
    </Card>
  );
}




