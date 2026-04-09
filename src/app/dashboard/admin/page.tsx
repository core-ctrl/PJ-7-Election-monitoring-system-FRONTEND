"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auditLogs, regionTurnoutData } from "@/lib/mock-data";
import { fetchElections, fetchReports } from "@/lib/api";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Users, Vote, AlertTriangle, Shield, CheckCircle,
  XCircle, Eye, Download, Bell, UserCheck, UserX, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#3b82f6", "#22c55e", "#f97316", "#a855f7", "#ef4444"];
const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  blocked: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [elections, setElections] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    fetchElections().then(d => setElections(Array.isArray(d) ? d : []));
    fetchReports().then(d => setReports(Array.isArray(d) ? d : []));
  }, []);

  if (isLoading || !user) return null;

  const fraudData = [
    { name: "Booth Capture", value: 4 },
    { name: "Tech Issues", value: 8 },
    { name: "Fraud/Duplicate", value: 3 },
    { name: "Intimidation", value: 5 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> Admin Control Panel
            </h1>
            <p className="text-muted-foreground">Welcome back, {user.name}.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Report exported!")}>
              <Download className="w-4 h-4 mr-2" /> Export Report
            </Button>
            <Button size="sm"><Bell className="w-4 h-4 mr-2" /> Alerts (3)</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Elections", value: elections.length, icon: Vote, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", trend: "All elections" },
            { label: "Active Elections", value: elections.filter(e => e.status === "ongoing").length, icon: Vote, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", trend: "Ongoing" },
            { label: "Open Reports", value: reports.filter(r => r.status !== "resolved").length, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30", trend: "Needs review" },
            { label: "Active Observers", value: 1842, icon: Eye, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30", trend: "+47 today" },
          ].map((stat) => (
            <Card key={stat.label} className="border border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-1 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Regional Voter Turnout</CardTitle>
                  <CardDescription>Current vs. target turnout by zone</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={regionTurnoutData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip /><Legend />
                      <Bar dataKey="turnout" fill="#3b82f6" name="Turnout %" radius={[4,4,0,0]} />
                      <Bar dataKey="target" fill="#e2e8f0" name="Target %" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Report Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={fraudData} cx="50%" cy="50%" outerRadius={70} dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                        {fraudData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip /><Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="elections" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Manage Elections</h3>
              <Button size="sm" onClick={() => toast.success("Create election via Postman!")}>+ Create Election</Button>
            </div>
            {elections.length === 0 && (
              <p className="text-muted-foreground text-sm">No elections yet. Add via Postman!</p>
            )}
            {elections.map((election) => (
              <Card key={election.id} className="border border-border/50">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Vote className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{election.title}</div>
                        <div className="text-sm text-muted-foreground">{election.state} · {election.type}</div>
                        <div className="text-xs text-muted-foreground mt-1">{election.startDate} → {election.endDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={
                        election.status === "ongoing" ? "bg-green-100 text-green-700" :
                        election.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                        "bg-muted text-muted-foreground"
                      }>
                        {election.status?.toUpperCase()}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => toast.info(`Editing: ${election.title}`)}>Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <h3 className="font-semibold">Issue Reports</h3>
            {reports.length === 0 && (
              <p className="text-muted-foreground text-sm">No reports yet.</p>
            )}
            {reports.map((report) => (
              <Card key={report.id} className="border border-border/50">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                        report.severity === "critical" ? "bg-red-500" :
                        report.severity === "high" ? "bg-orange-500" :
                        report.severity === "medium" ? "bg-yellow-500" : "bg-green-500"
                      }`} />
                      <div>
                        <div className="font-medium">{report.type}</div>
                        <div className="text-sm text-muted-foreground">{report.location}</div>
                        <div className="text-sm mt-1">{report.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">By {report.reporter} · {report.timestamp}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        report.status === "resolved" ? "bg-green-100 text-green-700" :
                        report.status === "verified" ? "bg-blue-100 text-blue-700" :
                        "bg-muted text-muted-foreground"
                      }>
                        {report.status?.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Button size="sm" onClick={() => toast.success("Report verified!")}>Verify</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Security Audit Logs</h3>
              <Button size="sm" variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
            </div>
            <div className="rounded-xl border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50 text-sm">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Action</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">User</th>
                    <th className="text-left px-4 py-3 font-medium">Timestamp</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30 text-sm">
                      <td className="px-4 py-3 font-medium">{log.action}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{log.user}</td>
                      <td className="px-4 py-3 text-muted-foreground">{log.timestamp}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {log.status === "success"
                            ? <CheckCircle className="w-4 h-4 text-green-600" />
                            : <XCircle className="w-4 h-4 text-red-600" />}
                          <span className={log.status === "success" ? "text-green-600" : "text-red-600"}>
                            {log.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
