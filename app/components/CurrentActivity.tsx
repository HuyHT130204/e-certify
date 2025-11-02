"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { CheckCircle, Play, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jan", hours: 24 },
  { month: "Feb", hours: 32 },
  { month: "Mar", hours: 28 },
  { month: "Apr", hours: 45 },
  { month: "May", hours: 38 },
  { month: "Jun", hours: 52 },
];

export function CurrentActivity() {
  return (
    <div className="space-y-4">
      {/* Monthly Progress Chart */}
      <Card className="border-none bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-white">
            Monthly Progress
          </CardTitle>
          <CardDescription className="text-white/80 text-sm">
            This is the latest improvement
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-4 pb-6">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)" 
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: "rgba(255,255,255,0.8)", fontSize: 12 }}
                axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "rgba(0,0,0,0.8)", 
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  padding: "8px 12px",
                  fontSize: "12px"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#fff" 
                strokeWidth={3}
                dot={{ fill: "#fff", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stats Cards - Side by Side */}
      <div className="grid grid-cols-2 gap-4">
        {/* Completed Courses */}
        <Card className="border-none bg-linear-to-br from-blue-500 to-cyan-500 shadow-lg overflow-hidden">
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">45K+</p>
                <p className="text-sm font-medium text-white/90 mt-1">Completed Courses</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <TrendingUp className="h-3 w-3 text-white" />
                  <span className="text-xs font-bold text-white">+12%</span>
                </div>
                <span className="text-xs text-white/70">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Courses */}
        <Card className="border-none bg-linear-to-br from-violet-500 to-purple-500 shadow-lg overflow-hidden">
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">20K+</p>
                <p className="text-sm font-medium text-white/90 mt-1">Video Courses</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <TrendingUp className="h-3 w-3 text-white" />
                  <span className="text-xs font-bold text-white">+8%</span>
                </div>
                <span className="text-xs text-white/70">vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}