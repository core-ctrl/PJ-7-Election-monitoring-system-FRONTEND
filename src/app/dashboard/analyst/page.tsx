"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockElections, voterTurnoutData, regionTurnoutData, mockReports
} from "@/lib/mock-data";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";
import { BarChart3, Download, TrendingUp, AlertTriangle, Users, Zap } from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ef4444", "#14b8a6"];

const ageGroupData = [
  { group: "18-25", registered: 18000000, voted: 9000000 },
  { group: "26-35", registered: 24000000, voted: 15600000 },
  { group: "36-45", registered: 20000000, voted: 14400000 },
  { group: "46-55", registered: 16000000, voted: 12800000 },
  { group: "56-65", registered: 12000000, voted: 10200000 },
  { group: "65+", registered: 8000000, voted: 6240000 },
];

const fraudTrendData = [
  { month: "Oct", reports: 12, verified: 8 },
  { month: "Nov", reports: 18, verified: 14 },
  { month: "Dec", reports: 9, verified: 6 },
  { month: "Jan", reports: 24, verified: 19 },
  { month: "Feb", reports: 20, verified: 15 },
];

const heatmapData = [
  { region: "North", value: 2, label: "2 Incidents" },
  { region: "South", value: 1, label: "1 Incident" },
  { region: "East", value: 4, label: "4 Incidents" },
  { region: "West", value: 0, label: "Clean" },
  { region: "Central", value: 3, label: "3 Incidents" },
  { region: "NE", value: 1, label: "1 Incident" },
];

const performanceRadarData = [
  { metric: "Turnout", score: 71 },
  { metric: "Coverage", score: 87 },
  { metric: "Transparency", score: 94 },
  { metric: "Security", score: 98 },
  { metric: "Fairness", score: 88 },
  { metric: "Accuracy", score: 96 },
];

const predictiveData = [
  { time: "6am", actual: 5, predicted: 6 },
  { time: "8am", actual: 12, predicted: 13 },
  { time: "10am", actual: 22, predicted: 23 },
  { time: "12pm", actual: 38, predicted: 40 },
  { time: "2pm", actual: 51, predicted: 54 },
  { time: "4pm", actual: 65, predicted: 68 },
  { time: "6pm", actual: 73, predicted: 76 },
  { time: "8pm", actual: null, predicted: 78 },
];

export default function AnalystDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "analyst")) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" /> Data Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">Real-time election data insights and predictive analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Dataset exported!")}>
              <Download className="w-4 h-4 mr-2" /> Export Dataset
            </Button>
            <Button size="sm" onClick={() => toast.success("Report generated!")}>
              <BarChart3 className="w-4 h-4 mr-2" /> Generate Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Avg. Turnout", value: "69.5%", icon: Users, delta: "+3.2%", pos: true, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
            { label: "Fraud Reports", value: "20", icon: AlertTriangle, delta: "-18% vs last", pos: true, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
            { label: "AI Anomaly Score", value: "Low Risk", icon: Zap, delta: "94% confidence", pos: true, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
            { label: "Observer Coverage", value: "87%", icon: TrendingUp, delta: "Stations covered", pos: true, color: "text-teal-600", bg: "bg-teal-100 dark:bg-teal-900/30" },
          ].map((k) => (
            <Card key={k.label} className="border border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                    <p className="text-xl font-bold mt-1">{k.value}</p>
                    <p className={`text-xs mt-1 ${k.pos ? "text-green-600 dark:text-green-400" : "text-red-600"}`}>{k.delta}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center`}>
                    <k.icon className={`w-4 h-4 ${k.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="turnout" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-1 p-1">
            <TabsTrigger value="turnout">Turnout</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="fraud">Fraud Heatmap</TabsTrigger>
            <TabsTrigger value="predictive">Predictive</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Turnout Tab */}
          <TabsContent value="turnout" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Hourly Turnout – Feb 19, 2026</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={voterTurnoutData}>
                      <defs>
                        <linearGradient id="turnoutGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="turnout" stroke="#3b82f6" fill="url(#turnoutGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Region-wise Turnout Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={regionTurnoutData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="turnout" fill="#3b82f6" name="Actual %" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="target" fill="#94a3b8" name="Target %" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Region Table */}
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Region-wise Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 text-sm">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium">Region</th>
                        <th className="text-right px-4 py-2 font-medium">Turnout</th>
                        <th className="text-right px-4 py-2 font-medium">Target</th>
                        <th className="text-right px-4 py-2 font-medium">Gap</th>
                        <th className="text-right px-4 py-2 font-medium">Fraud Reports</th>
                        <th className="px-4 py-2 font-medium">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {regionTurnoutData.map((r) => (
                        <tr key={r.region} className="hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium">{r.region}</td>
                          <td className="px-4 py-3 text-right">{r.turnout}%</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">{r.target}%</td>
                          <td className={`px-4 py-3 text-right ${r.turnout >= r.target ? "text-green-600" : "text-red-500"}`}>
                            {r.turnout >= r.target ? "+" : ""}{r.turnout - r.target}%
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={r.fraud > 2 ? "text-red-500 font-medium" : "text-green-600"}>{r.fraud}</span>
                          </td>
                          <td className="px-4 py-3 w-32">
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(r.turnout / r.target) * 100}%` }} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demographics */}
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Voter Participation by Age Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={ageGroupData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="group" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                      <Tooltip formatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
                      <Legend />
                      <Bar dataKey="registered" fill="#94a3b8" name="Registered" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="voted" fill="#3b82f6" name="Voted" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Youth Voter Participation Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Insight: Youth Participation Gap</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">18-25 age group shows only 50% turnout vs. 77% in 46-55 group. This represents a significant civic engagement challenge.</p>
                  </div>
                  {ageGroupData.map((d) => (
                    <div key={d.group}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{d.group}</span>
                        <span className="text-muted-foreground">{((d.voted / d.registered) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(d.voted / d.registered) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fraud Heatmap */}
          <TabsContent value="fraud" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Fraud Report Heatmap by Region</CardTitle>
                  <CardDescription>Incident density across electoral zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {heatmapData.map((r) => (
                      <div key={r.region} className={`p-4 rounded-xl text-center text-sm font-semibold ${
                        r.value === 0 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                        r.value <= 2 ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" :
                        "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      }`}>
                        <div className="text-2xl font-bold">{r.value}</div>
                        <div className="text-xs">{r.region}</div>
                        <div className="text-xs opacity-70">{r.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground justify-center">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-green-400" />Clean</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-yellow-400" />Low Risk</div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-400" />High Risk</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Fraud Report Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={fraudTrendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="reports" stroke="#ef4444" strokeWidth={2} name="Total Reports" dot />
                      <Line type="monotone" dataKey="verified" stroke="#22c55e" strokeWidth={2} name="Verified" dot />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* AI Anomaly Detection */}
            <Card className="border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" /> AI-Based Anomaly Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Duplicate Vote Detection", risk: "Low", score: "2 flagged", color: "text-green-600" },
                    { label: "Unusual Turnout Spikes", risk: "Medium", score: "East Zone", color: "text-yellow-600" },
                    { label: "Report Pattern Anomaly", risk: "Low", score: "Normal", color: "text-green-600" },
                  ].map((a) => (
                    <div key={a.label} className="p-3 bg-background rounded-lg border">
                      <div className="text-sm font-medium mb-1">{a.label}</div>
                      <div className={`text-lg font-bold ${a.color}`}>{a.risk} Risk</div>
                      <div className="text-xs text-muted-foreground">{a.score}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Predictive */}
          <TabsContent value="predictive" className="space-y-6">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Predicted vs. Actual Turnout</CardTitle>
                <CardDescription>ML model prediction accuracy for General Elections 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictiveData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} name="Actual" dot />
                    <Line type="monotone" dataKey="predicted" stroke="#f97316" strokeWidth={2} name="Predicted" dot strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Final Turnout Prediction", value: "73-78%", desc: "Model confidence: 87%" },
                { label: "Expected Close Constituencies", value: "47", desc: "Margin < 2%" },
                { label: "Anomaly Probability", value: "8.3%", desc: "Based on historical patterns" },
              ].map((p) => (
                <Card key={p.label} className="border border-border/50">
                  <CardContent className="p-5">
                    <p className="text-xs text-muted-foreground mb-1">{p.label}</p>
                    <p className="text-2xl font-bold text-primary">{p.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Election Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={performanceRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Candidate Vote Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={mockElections[0].candidates}
                        cx="50%" cy="50%"
                        outerRadius={90}
                        dataKey="votes"
                        nameKey="party"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {mockElections[0].candidates.map((c, i) => (
                          <Cell key={i} fill={c.color || COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => v.toLocaleString()} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
