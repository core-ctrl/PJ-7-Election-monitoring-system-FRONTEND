"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { mockPollingStations, voterTurnoutData } from "@/lib/mock-data";
import { fetchElections, fetchForumPosts } from "@/lib/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Vote, MapPin, AlertTriangle, MessageSquare, BookOpen, Bell,
  TrendingUp, Calendar, ChevronRight, Info, Heart
} from "lucide-react";

export default function CitizenDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [elections, setElections] = useState<any[]>([]);
  const [forumPosts, setForumPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "citizen")) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchElections().then(d => setElections(Array.isArray(d) ? d : []));
    fetchForumPosts().then(d => setForumPosts(Array.isArray(d) ? d : []));
  }, []);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground">Your civic dashboard.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/report")}>
              <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" /> Report Issue
            </Button>
            <Button size="sm" onClick={() => router.push("/elections")}>
              <Vote className="w-4 h-4 mr-2" /> View Elections
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "View Elections", icon: Vote, href: "/elections", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
            { label: "Find Polling Station", icon: MapPin, href: "/elections", color: "bg-green-100 dark:bg-green-900/30 text-green-600" },
            { label: "Report Issue", icon: AlertTriangle, href: "/report", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600" },
            { label: "Civic Education", icon: BookOpen, href: "/civic-education", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600" },
          ].map((a) => (
            <Link key={a.label} href={a.href}>
              <Card className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer border border-border/50">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`w-11 h-11 rounded-xl ${a.color} flex items-center justify-center`}>
                    <a.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{a.label}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" /> Live Voter Turnout
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">LIVE</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mb-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">44.7%</div>
                    <div className="text-xs text-muted-foreground">Current Turnout</div>
                  </div>
                  <div>
                    <div className="text-xl font-semibold">4,12,890</div>
                    <div className="text-xs text-muted-foreground">Votes Cast</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={voterTurnoutData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="turnout" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Vote className="w-4 h-4 text-primary" /> Elections
                  </CardTitle>
                  <Link href="/elections" className="text-xs text-primary hover:underline">View all</Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {elections.length === 0 && (
                  <p className="text-sm text-muted-foreground">No elections yet.</p>
                )}
                {elections.map((e) => (
                  <Link href={`/elections/${e.id}`} key={e.id}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Vote className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{e.title}</div>
                          <div className="text-xs text-muted-foreground">{e.state} · {e.startDate}</div>
                          {e.status === "ongoing" && (
                            <Progress value={(e.votesCast / e.totalVoters) * 100} className="h-1.5 w-40 mt-1" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          e.status === "ongoing" ? "bg-green-100 text-green-700" :
                            e.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                              "bg-muted text-muted-foreground"
                        }>{e.status}</Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" /> Community Forum
                  </CardTitle>
                  <Link href="/forum" className="text-xs text-primary hover:underline">Join discussion</Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {forumPosts.length === 0 && (
                  <p className="text-sm text-muted-foreground">No posts yet.</p>
                )}
                {forumPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-sm">{post.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{post.author}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{post.replies}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-blue-800 dark:text-blue-200">Next Election</span>
                </div>
                <div className="font-bold text-lg mb-1">Maharashtra State Assembly 2026</div>
                <div className="text-sm text-muted-foreground mb-3">March 10, 2026</div>
                <Button size="sm" className="w-full" onClick={() => router.push("/elections")}>View Details</Button>
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Nearby Polling Stations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockPollingStations.slice(0, 3).map((ps) => (
                  <div key={ps.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/30">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ps.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                    <div>
                      <div className="text-sm font-medium">{ps.name}</div>
                      <div className="text-xs text-muted-foreground">{ps.district}</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => router.push("/elections")}>
                  View Full Map
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800 dark:text-green-200">Did you know?</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  India has over <strong>946 million</strong> registered voters — the largest electorate in the world!
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary" /> Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { msg: "Voting hours extended in East Zone", time: "2 hours ago", type: "info" },
                  { msg: "New polling station added in Laxmi Nagar", time: "5 hours ago", type: "success" },
                  { msg: "Critical report filed at Booth 42", time: "3 hours ago", type: "warning" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === "info" ? "bg-blue-500" : n.type === "success" ? "bg-green-500" : "bg-orange-500"
                      }`} />
                    <div>
                      <div className="text-xs">{n.msg}</div>
                      <div className="text-xs text-muted-foreground">{n.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
