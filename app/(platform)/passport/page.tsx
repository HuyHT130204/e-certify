// app/(platform)/passport/page.tsx
// All code and comments must be in English.
"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ShieldCheck, ExternalLink, Search, Award, Calendar, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ICertificate {
  id: string;
  content?: {
    metadata?: {
      name?: string;
      attributes?: Array<{ trait_type: string; value: string }>;
    };
  };
  grouping?: Array<{ group_key: string; group_value: string }>;
}

export default function SkillsPassportPage() {
  const supabase = useMemo(() => createClient(), []);
  const [owner, setOwner] = useState("");
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [userWallet, setUserWallet] = useState<string>("");

  useEffect(() => {
    // Try to get wallet from user profile if available
    const fetchUserWallet = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // In future, fetch wallet from user profile
          // For now, leave empty
        }
      } catch (error) {
        console.error("Error fetching user wallet:", error);
      }
    };
    fetchUserWallet();
  }, [supabase]);

  const fetchCerts = async () => {
    if (!owner) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/cnft?owner=${owner}`);
      const data = await res.json();
      const items = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data)
        ? data
        : [];
      setCertificates(items as ICertificate[]);
    } catch (e) {
      console.error(e);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const colorVariants = [
    "bg-purple-50 border-purple-200 text-purple-900",
    "bg-blue-50 border-blue-200 text-blue-900",
    "bg-indigo-50 border-indigo-200 text-indigo-900",
    "bg-slate-50 border-slate-200 text-slate-900",
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1600px] space-y-6 p-6 md:p-8 lg:p-10">
        {/* Page Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Skills Passport
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Your on-chain verified certificates and achievements
              </p>
            </div>
          </div>
        </div>

        {/* Search Wallet Section */}
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-slate-700" />
              Find Certificates
            </CardTitle>
            <CardDescription>
              Enter a Solana wallet address to view on-chain certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                className="flex-1"
                placeholder="Enter Solana wallet address (e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU)..."
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchCerts()}
              />
              <Button
                onClick={fetchCerts}
                disabled={!owner || loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? (
                  <>
                    <Search className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Search className="h-6 w-6 text-purple-600 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-slate-900">Searching blockchain...</p>
                  <p className="text-xs text-slate-500">Fetching certificates from Solana</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No Wallet */}
        {!owner && !loading && (
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-slate-400" />
                </div>
                <div className="text-center space-y-2 max-w-md">
                  <h3 className="text-lg font-semibold text-slate-900">Connect Your Wallet</h3>
                  <p className="text-sm text-slate-600">
                    Enter your Solana wallet address above to view your on-chain certificates and achievements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No Certificates */}
        {certificates.length === 0 && !loading && owner && (
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                  <Award className="h-8 w-8 text-slate-400" />
                </div>
                <div className="text-center space-y-2 max-w-md">
                  <h3 className="text-lg font-semibold text-slate-900">No Certificates Found</h3>
                  <p className="text-sm text-slate-600">
                    This wallet doesn't have any E-Certify certificates yet. Complete a course to receive your first certificate!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certificates Grid */}
        {certificates.length > 0 && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900">
                Found <span className="text-purple-600 font-semibold">{certificates.length}</span> certificate{certificates.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert, index) => {
                const course = cert.grouping?.find(g => g.group_key === 'collection')?.group_value || 'Unknown Course';
                const issued_date = cert.content?.metadata?.attributes?.find(a => a.trait_type === 'Issued Date')?.value || 'N/A';
                const certName = cert.content?.metadata?.name || `Certificate #${cert.id.slice(0, 8)}`;
                const colorClass = colorVariants[index % colorVariants.length];

                return (
                  <Card
                    key={cert.id}
                    className={cn(
                      "border-2 shadow-sm hover:shadow-md transition-shadow",
                      colorClass
                    )}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 pr-2">
                          <CardTitle className="text-lg line-clamp-2 mb-1">{certName}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <BookOpen className="h-3 w-3" />
                            <span className="line-clamp-1">{course}</span>
                          </CardDescription>
                        </div>
                        <div className="h-10 w-10 rounded-lg bg-white/50 flex items-center justify-center shrink-0">
                          <Award className="h-5 w-5" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">Issued: {issued_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-white/50">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Verified on-chain
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full bg-white/50 hover:bg-white"
                      >
                        <a
                          href={`https://xray.helius.xyz/asset/${cert.id}?network=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Verify on-chain
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
