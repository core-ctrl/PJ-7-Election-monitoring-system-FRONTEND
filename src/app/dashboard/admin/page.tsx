"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers, mockElections, mockReports, auditLogs, regionTurnoutData } from "@/lib/mock-data";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Users, Vote, AlertTriangle, Shield, TrendingUp, CheckCircle,
  XCircle, Clock, Eye, Download, Settings, Activity, Lock,
  Bell, UserCheck, UserX, MoreVertical, RefreshCw
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

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) router.push("/login");
  }, [user, isLoading, router]);

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Admin Control Panel
            </h1>
            <p className="text-muted-foreground">Welcome back, {user.name}. Here's today's overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Report exported!")}>
              <Download className="w-4 h-4 mr-2" /> Export Report
            </Button>
            <Button size="sm">
              <Bell className="w-4 h-4 mr-2" /> Alerts (3)
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: mockUsers.length, icon: Users, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30", trend: "+12 today" },
            { label: "Active Elections", value: mockElections.filter(e => e.status === "ongoing").length, icon: Vote, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", trend: "1 ongoing" },
            { label: "Open Reports", value: mockReports.filter(r => r.status !== "resolved").length, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30", trend: "Needs review" },
            { label: "Active Observers", value: 1842, icon: Eye, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30", trend: "+47 today" },
          ].map((stat) => (
            <Card key={stat.label} className="border border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</p>
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

        {/* Fraud Alert Banner */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-100 dark:bg-red-800/40 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-red-800 dark:text-red-300">Critical Alert: Booth Capture reported at East Zone</p>
              <p className="text-sm text-red-600 dark:text-red-400">Booth 42 – 2 hours ago · Under investigation</p>
            </div>
          </div>
          <Button size="sm" variant="destructive" onClick={() => toast.info("Opening investigation panel...")}>Investigate</Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-1 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
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
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="region" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="turnout" fill="#3b82f6" name="Turnout %" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="target" fill="#e2e8f0" name="Target %" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Report Categories</CardTitle>
                  <CardDescription>Issue types breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={fraudData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                        {fraudData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Transparency + Security Scores */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Transparency Index", value: 94, max: 100, color: "bg-blue-500" },
                { label: "Security Score", value: 98, max: 100, color: "bg-green-500" },
                { label: "Observer Coverage", value: 87, max: 100, color: "bg-purple-500" },
              ].map((s) => (
                <Card key={s.label} className="border border-border/50">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium">{s.label}</span>
                      <span className="text-xl font-bold">{s.value}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className={`${s.color} h-2.5 rounded-full transition-all`} style={{ width: `${s.value}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Elections Tab */}
          <TabsContent value="elections" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Manage Elections</h3>
              <Button size="sm" onClick={() => toast.success("Create election modal would open here")}>
                + Create Election
              </Button>
            </div>
            {mockElections.map((election) => (
              <Card key={election.id} className="border border-border/50">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Vote className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{election.title}</div>
                        <div className="text-sm text-muted-foreground">{election.state} · {election.type} · {election.constituencies} constituencies</div>
                        <div className="text-xs text-muted-foreground mt-1">{election.startDate} → {election.endDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={
                        election.status === "ongoing" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        election.status === "upcoming" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-muted text-muted-foreground"
                      }>
                        {election.status.toUpperCase()}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => toast.info(`Editing: ${election.title}`)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => toast.error(`Delete requires confirmation`)}>Delete</Button>
                    </div>
                  </div>
                  {election.status === "ongoing" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Votes Cast: {election.votescast.toLocaleString()}</span>
                        <span>Total: {election.totalVoters.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${(election.votescast / election.totalVoters * 100).toFixed(1)}%` }} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">User Management</h3>
              <Button size="sm" variant="outline" onClick={() => toast.success("User list exported!")}>
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>
            <div className="rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 text-sm">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">User</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Role</th>
                      <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Joined</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mockUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{u.name}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-sm capitalize">{u.role}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">{u.joined}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[u.status]}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {u.status === "pending" && (
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600"
                                onClick={() => toast.success(`${u.name} approved!`)}>
                                <UserCheck className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"
                              onClick={() => toast.error(`${u.name} blocked!`)}>
                              <UserX className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <h3 className="font-semibold">Issue Reports Moderation</h3>
            {mockReports.map((report) => (
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
                        <div className="text-sm mt-1 text-foreground/80">{report.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">By {report.reporter} · {report.timestamp}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        report.status === "resolved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        report.status === "verified" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                        report.status === "under_review" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        "bg-muted text-muted-foreground"
                      }>
                        {report.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      {report.status === "pending" || report.status === "under_review" ? (
                        <Button size="sm" onClick={() => toast.success("Report verified!")}>Verify</Button>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Audit Logs */}
          <TabsContent value="audit" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Security Audit Logs</h3>
              <Button size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>
            <div className="rounded-xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 text-sm">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Action</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">User</th>
                      <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">IP Address</th>
                      <th className="text-left px-4 py-3 font-medium">Timestamp</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors text-sm">
                        <td className="px-4 py-3 font-medium">{log.action}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{log.user}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell font-mono text-xs">{log.ip}</td>
                        <td className="px-4 py-3 text-muted-foreground">{log.timestamp}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {log.status === "success" ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
