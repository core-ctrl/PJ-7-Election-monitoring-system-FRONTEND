"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { mockPollingStations, mockReports } from "@/lib/mock-data";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip
} from "recharts";
import {
  Eye, MapPin, AlertTriangle, CheckCircle, XCircle, Clock, Upload,
  Star, ChevronRight, Camera, FileText, Shield, Activity
} from "lucide-react";
import { toast } from "sonner";

const checklist = [
  { id: 1, item: "Voter ID verification process in place", category: "Process" },
  { id: 2, item: "Polling booths accessible for disabled voters", category: "Accessibility" },
  { id: 3, item: "Security personnel deployed appropriately", category: "Security" },
  { id: 4, item: "No unauthorized persons within 200m zone", category: "Security" },
  { id: 5, item: "VVPAT machines functioning correctly", category: "Equipment" },
  { id: 6, item: "EVM sealed and numbered correctly", category: "Equipment" },
  { id: 7, item: "Voter list publicly displayed outside booth", category: "Process" },
  { id: 8, item: "Party agents present within permitted count", category: "Process" },
];

const transparencyData = [
  { metric: "Process", score: 88 },
  { metric: "Security", score: 92 },
  { metric: "Equipment", score: 85 },
  { metric: "Accessibility", score: 78 },
  { metric: "Transparency", score: 90 },
  { metric: "Integrity", score: 95 },
];

export default function ObserverDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [notes, setNotes] = useState("");
  const [reportText, setReportText] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "observer")) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const completedChecks = Object.values(checks).filter(Boolean).length;
  const checkProgress = (completedChecks / checklist.length) * 100;

  const toggleCheck = (id: number) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const submitReport = () => {
    if (!reportText.trim()) { toast.error("Please write a report"); return; }
    toast.success("Observation report submitted!");
    setReportText("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" /> Observer Dashboard
            </h1>
            <p className="text-muted-foreground">Welcome, {user.name}. Monitor your assigned polling stations.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
              Verified Observer
            </Badge>
            <Button size="sm" variant="destructive" onClick={() => toast.error("Emergency alert sent to admin!")}>
              <AlertTriangle className="w-4 h-4 mr-2" /> Emergency Alert
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Assigned Stations", value: 4, icon: MapPin, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
            { label: "Reports Submitted", value: 7, icon: FileText, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
            { label: "Alerts Raised", value: 2, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
            { label: "Transparency Score", value: "88/100", icon: Star, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
          ].map((s) => (
            <Card key={s.label} className="border border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold mt-1">{s.value}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left - Assigned Stations + Checklist */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assigned Polling Stations */}
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Assigned Polling Stations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockPollingStations.map((ps) => (
                  <div key={ps.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${ps.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                      <div>
                        <div className="font-medium text-sm">{ps.name}</div>
                        <div className="text-xs text-muted-foreground">{ps.district} · Booth #{ps.boothNumber} · {ps.observers} observers</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={ps.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}>
                        {ps.status === "active" ? "Normal" : "Issue Reported"}
                      </Badge>
                      <Button size="sm" variant="ghost" className="h-7" onClick={() => toast.info(`Opening ${ps.name}`)}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Real-time Observation Checklist */}
            <Card className="border border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> Observation Checklist
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">{completedChecks}/{checklist.length} complete</div>
                </div>
                <Progress value={checkProgress} className="h-2 mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                      checks[item.id]
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : "bg-muted/20 border-transparent hover:bg-muted/50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      checks[item.id] ? "bg-green-500 border-green-500" : "border-muted-foreground/50"
                    }`}>
                      {checks[item.id] && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${checks[item.id] ? "line-through text-muted-foreground" : ""}`}>
                        {item.item}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                  </div>
                ))}
                <Button className="w-full mt-3" disabled={completedChecks < checklist.length}
                  onClick={() => toast.success("Checklist submitted successfully!")}>
                  {completedChecks < checklist.length ? `Complete ${checklist.length - completedChecks} more items` : "Submit Checklist"}
                </Button>
              </CardContent>
            </Card>

            {/* Submit Observation Report */}
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Submit Observation Report
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Describe your observations at the polling station. Include booth conditions, voter experience, any irregularities noted..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info("Camera access would be requested")}>
                    <Camera className="w-4 h-4 mr-2" /> Upload Photo
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => toast.info("Video upload would open")}>
                    <Upload className="w-4 h-4 mr-2" /> Upload Video
                  </Button>
                </div>
                <Button className="w-full" onClick={submitReport}>
                  Submit Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Transparency Score Radar */}
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" /> Transparency Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={transparencyData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="text-center mt-2">
                  <div className="text-3xl font-bold text-primary">88/100</div>
                  <div className="text-sm text-muted-foreground">Overall Transparency Score</div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Reports by Others */}
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockReports.slice(0, 3).map((r) => (
                  <div key={r.id} className="p-3 rounded-lg bg-muted/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge className={
                        r.severity === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        r.severity === "high" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }>
                        {r.severity?.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{r.timestamp.split(" ")[1]}</span>
                    </div>
                    <div className="text-sm font-medium">{r.type}</div>
                    <div className="text-xs text-muted-foreground">{r.location}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Observer Notes */}
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Quick Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Personal field notes (not submitted)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => toast.success("Notes saved!")}>
                  Save Notes
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
