"use client";
import { useParams, useRouter } from "next/navigation";
import { mockElections } from "@/lib/mock-data";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import { Vote, MapPin, Calendar, Users, ArrowLeft, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7"];

export default function ElectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const election = mockElections.find(e => e.id === id);

  if (!election) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Vote className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h2 className="text-2xl font-bold mb-2">Election not found</h2>
          <Button onClick={() => router.push("/elections")}>Back to Elections</Button>
        </div>
      </div>
    );
  }

  const totalVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);
  const leadingCandidate = [...election.candidates].sort((a, b) => b.votes - a.votes)[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back + Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-3xl font-bold">{election.title}</h1>
                <Badge className={
                  election.status === "ongoing" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  election.status === "upcoming" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                  "bg-muted text-muted-foreground"
                }>
                  {election.status === "ongoing" && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse inline-block" />}
                  {election.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{election.state}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{election.startDate} – {election.endDate}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{election.constituencies} constituencies</span>
                <span className="flex items-center gap-1"><Vote className="w-3.5 h-3.5" />{election.totalVoters.toLocaleString()} registered voters</span>
              </div>
            </div>
            {(user?.role === "citizen" || user?.role === "observer") && (
              <Link href="/report">
                <Button variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" /> Report Issue
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* About */}
        <Card className="border border-border/50 mb-6">
          <CardContent className="p-6">
            <p className="text-muted-foreground">{election.description}</p>
          </CardContent>
        </Card>

        {/* Turnout Progress */}
        {election.status !== "upcoming" && (
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card className="border border-border/50">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Voter Turnout</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {election.totalVoters > 0 ? ((election.votescast / election.totalVoters) * 100).toFixed(1) : 0}%
                </p>
                <Progress value={election.totalVoters > 0 ? (election.votescast / election.totalVoters) * 100 : 0} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card className="border border-border/50">
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Votes Cast</p>
                <p className="text-3xl font-bold mt-1">{election.votescast.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">of {election.totalVoters.toLocaleString()}</p>
              </CardContent>
            </Card>
            {election.status === "ongoing" ? (
              <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 border">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">Current Leader</p>
                  </div>
                  <p className="text-lg font-bold">{leadingCandidate?.name}</p>
                  <p className="text-sm text-muted-foreground">{leadingCandidate?.party}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-border/50">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Winner</p>
                  <p className="text-lg font-bold mt-1">{leadingCandidate?.name}</p>
                  <p className="text-sm text-muted-foreground">{leadingCandidate?.party}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Candidates */}
        {election.candidates.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Vote className="w-4 h-4 text-primary" /> Candidates & Vote Share
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...election.candidates].sort((a, b) => b.votes - a.votes).map((c, i) => (
                  <div key={c.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: c.color || COLORS[i] }} />
                        <span className="font-medium">{c.name}</span>
                        <span className="text-muted-foreground text-xs">({c.party})</span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : 0}%</span>
                        {c.votes > 0 && <span className="text-xs text-muted-foreground ml-2">{c.votes.toLocaleString()}</span>}
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{
                        width: `${totalVotes > 0 ? (c.votes / totalVotes) * 100 : 0}%`,
                        background: c.color || COLORS[i]
                      }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {totalVotes > 0 && (
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Vote Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={election.candidates} cx="50%" cy="50%" outerRadius={80} dataKey="votes" nameKey="name"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                        {election.candidates.map((c, i) => <Cell key={i} fill={c.color || COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => v.toLocaleString()} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Region data */}
        {election.regions && election.regions.length > 0 && (
          <Card className="border border-border/50 mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Regional Turnout
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={election.regions}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="turnout" fill="#3b82f6" name="Turnout %" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="fraud" fill="#ef4444" name="Fraud Reports" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {election.status === "upcoming" && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 border">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">Election Not Started Yet</h3>
              <p className="text-muted-foreground mb-4">This election begins on {election.startDate}. Check back for live results.</p>
              <Button onClick={() => router.push("/register")}>Register to Vote</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
