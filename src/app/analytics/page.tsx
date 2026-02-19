"use client";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockElections, voterTurnoutData, regionTurnoutData } from "@/lib/mock-data";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import { BarChart3, Download, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ef4444"];

const historicalTurnout = [
  { year: "2009", turnout: 58.2 }, { year: "2014", turnout: 66.4 },
  { year: "2019", turnout: 67.4 }, { year: "2024", turnout: 65.8 },
  { year: "2026", turnout: 73.0 },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-primary" /> Election Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Public election data, trends, and transparency metrics</p>
          </div>
          <Button variant="outline" onClick={() => toast.success("Data exported!")}>
            <Download className="w-4 h-4 mr-2" /> Export Data
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Overall Turnout", value: "44.7%", trend: "+3.2%" },
            { label: "Active Observers", value: "1,842", trend: "+47" },
            { label: "Reports Filed", value: "20", trend: "-18%" },
            { label: "Transparency Index", value: "94/100", trend: "Excellent" },
          ].map(s => (
            <Card key={s.label} className="border border-border/50">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{s.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="turnout">
          <TabsList className="mb-6">
            <TabsTrigger value="turnout">Turnout</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="historical">Historical</TabsTrigger>
          </TabsList>

          <TabsContent value="turnout" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Hourly Turnout Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={voterTurnoutData}>
                      <defs>
                        <linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="turnout" stroke="#3b82f6" fill="url(#tg2)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Region-wise Turnout</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={regionTurnoutData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="turnout" fill="#3b82f6" name="Turnout %" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {mockElections.filter(e => e.candidates.some(c => c.votes > 0)).map(election => (
              <Card key={election.id} className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">{election.title}</CardTitle>
                  <CardDescription>{election.state}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={election.candidates}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v: number) => v.toLocaleString()} />
                      <Bar dataKey="votes" radius={[3, 3, 0, 0]}>
                        {election.candidates.map((c, i) => <Cell key={i} fill={c.color || COLORS[i]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="historical">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Historical Voter Turnout (2009–2026)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalTurnout}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[55, 80]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="turnout" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
