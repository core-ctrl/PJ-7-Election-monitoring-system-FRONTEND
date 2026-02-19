"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import {
  Shield, Vote, BarChart3, Users, AlertTriangle, MapPin, Bell, Eye,
  ChevronRight, Play, CheckCircle, Star, TrendingUp, Globe, Lock,
  ArrowRight, BookOpen, MessageSquare, Zap
} from "lucide-react";

const stats = [
  { label: "Registered Voters", value: "924K+", icon: Users, color: "text-blue-600" },
  { label: "Active Observers", value: "1,842", icon: Eye, color: "text-green-600" },
  { label: "Elections Monitored", value: "128", icon: Vote, color: "text-purple-600" },
  { label: "Reports Processed", value: "3,294", icon: AlertTriangle, color: "text-orange-600" },
];

const features = [
  {
    icon: Shield,
    title: "Secure & Transparent",
    desc: "JWT-secured access with role-based permissions. All actions are audit-logged for accountability.",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Live voter turnout charts, region-wise statistics, and fraud heatmaps updated every minute.",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  {
    icon: AlertTriangle,
    title: "Fraud Prevention",
    desc: "Geo-tagged issue reporting, anomaly detection alerts, and duplicate vote simulation.",
    color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  },
  {
    icon: MapPin,
    title: "Polling Station Map",
    desc: "Find your nearest polling station, view real-time status, and get directions instantly.",
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    desc: "Receive alerts for fraud reports, election updates, and critical announcements.",
    color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  },
  {
    icon: BookOpen,
    title: "Civic Education",
    desc: "Learn how voting works, why every vote matters, and how to protect your democratic rights.",
    color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  },
];

const roles = [
  { role: "Citizen", icon: Users, color: "from-blue-600 to-blue-800", desc: "Register, vote, report issues, and engage with your community.", demo: "citizen@electwatch.gov" },
  { role: "Admin", icon: Shield, color: "from-red-600 to-red-800", desc: "Manage elections, users, and platform security from the control panel.", demo: "admin@electwatch.gov" },
  { role: "Observer", icon: Eye, color: "from-green-600 to-green-800", desc: "Monitor polling stations, submit reports, and ensure fair processes.", demo: "observer@electwatch.gov" },
  { role: "Analyst", icon: BarChart3, color: "from-purple-600 to-purple-800", desc: "Access election datasets, generate insights, and detect anomalies.", demo: "analyst@electwatch.gov" },
];

const timeline = [
  { date: "Feb 15, 2026", event: "General Elections 2026 Begin", status: "active" },
  { date: "Feb 16-18, 2026", event: "Phase 2 Polling", status: "active" },
  { date: "Feb 19, 2026", event: "Final Phase Voting", status: "today" },
  { date: "Feb 20, 2026", event: "Vote Counting", status: "upcoming" },
  { date: "Feb 21, 2026", event: "Results Declaration", status: "upcoming" },
];

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30">
                <Zap className="w-3 h-3 mr-1" /> LIVE – General Elections 2026
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Secure Elections.<br />
                <span className="text-blue-300">Transparent Process.</span><br />
                <span className="text-green-400">Empowered Citizens.</span>
              </h1>
              <p className="text-blue-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                ElectWatch is India's comprehensive election monitoring platform. Track votes in real-time, report irregularities, and inspire the next generation of voters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <Button size="lg" onClick={() => router.push(`/dashboard/${user.role}`)}
                    className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8">
                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button size="lg" onClick={() => router.push("/register")}
                      className="bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8">
                      Register Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => router.push("/login")}
                      className="border-white/30 text-white hover:bg-white/10">
                      <Play className="mr-2 h-4 w-4" /> Explore Demo
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Live Stats Card */}
            <div className="flex-shrink-0 w-full lg:w-80">
              <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Live Election Status</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-300">LIVE</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Votes Cast</span>
                    <span className="font-semibold">4,12,890</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: "44.7%"}} />
                  </div>
                  <div className="flex justify-between text-xs text-blue-300">
                    <span>44.7% Turnout</span>
                    <span>Target: 75%</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 space-y-2">
                    {["Arvind Mehta – 44.2%", "Sunita Verma – 37.6%", "Ramesh Gupta – 11.8%"].map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-orange-400" : i === 1 ? "bg-blue-400" : "bg-green-400"}`} />
                        <span className="text-blue-100">{c}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/elections" className="block w-full text-center text-xs text-blue-300 hover:text-white transition-colors mt-2">
                    View Full Results →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-10 fill-background">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center border-none shadow-sm bg-card hover:shadow-md transition-shadow">
                <CardContent className="pt-6 pb-4">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Election Timeline Banner */}
      <section className="py-8 bg-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-blue-300 mb-6">
            Election 2026 Timeline
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-0">
            {timeline.map((item, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center">
                <div className={`flex flex-col items-center text-center px-6 py-3 rounded-xl ${
                  item.status === "today" ? "bg-green-500/20 border border-green-500/40" : ""
                }`}>
                  <div className={`text-xs mb-1 ${
                    item.status === "today" ? "text-green-400 font-bold" :
                    item.status === "active" ? "text-blue-300" : "text-slate-400"
                  }`}>
                    {item.status === "today" ? "TODAY" : item.date}
                  </div>
                  <div className="text-sm font-medium text-white">{item.event}</div>
                </div>
                {i < timeline.length - 1 && (
                  <ChevronRight className="hidden md:block text-blue-600 mx-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-3">Platform Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need for election transparency</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive suite of tools to monitor, report, analyze, and improve the electoral process.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border/50">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="outline" className="mb-3">User Roles</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your role in democratic process</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Whether you're a citizen, observer, or analyst — ElectWatch has a role tailored for you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r) => (
              <div key={r.role} className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${r.color}`} />
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-4`}>
                    <r.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{r.role}</h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{r.desc}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/login")}
                  >
                    Explore as {r.role}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Youth CTA */}
      <section className="py-20 bg-gradient-to-br from-green-900 to-emerald-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px"}} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Star className="w-4 h-4 text-yellow-400" />
            Special Initiative for First-Time Voters
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Your vote is your voice.<br />
            <span className="text-green-300">Use it wisely.</span>
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Join 180 million first-time voters in shaping India's future. Learn how the electoral process works and why your participation matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => router.push("/civic-education")}
              className="bg-white text-green-900 hover:bg-green-50 font-semibold px-8">
              <BookOpen className="mr-2 h-5 w-5" /> Learn About Voting
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/forum")}
              className="border-white/30 text-white hover:bg-white/10">
              <MessageSquare className="mr-2 h-5 w-5" /> Join Community Forum
            </Button>
          </div>
        </div>
      </section>

      {/* About Transparency */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="outline" className="mb-3">About Election Transparency</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built on the principles of open democracy</h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                ElectWatch was developed with a single mission: to make every election fair, verifiable, and trustworthy. We believe that transparency is the cornerstone of a healthy democracy.
              </p>
              <div className="space-y-4">
                {[
                  { title: "Independent Monitoring", desc: "Our platform enables citizens and certified observers to independently verify the electoral process." },
                  { title: "Tamper-Proof Records", desc: "All reports, observations, and data are immutably logged with timestamps and geo-tags." },
                  { title: "Citizen Empowerment", desc: "We provide tools and education that transform passive voters into active democratic participants." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Transparency Index", value: "94/100", icon: TrendingUp, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
                { label: "Reports Verified", value: "87%", icon: CheckCircle, color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
                { label: "Active Constituencies", value: "543", icon: Globe, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
                { label: "Security Score", value: "A+", icon: Lock, color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
              ].map((m) => (
                <Card key={m.label} className="border border-border/50">
                  <CardContent className="p-6">
                    <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center mb-3`}>
                      <m.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold mb-1">{m.value}</div>
                    <div className="text-sm text-muted-foreground">{m.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white text-lg">ElectWatch</span>
              </div>
              <p className="text-sm text-blue-300 leading-relaxed">Secure, transparent, and reliable election monitoring for a stronger democracy.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Platform</h4>
              <div className="space-y-2 text-sm">
                <Link href="/elections" className="block hover:text-white transition-colors">Elections</Link>
                <Link href="/analytics" className="block hover:text-white transition-colors">Analytics</Link>
                <Link href="/forum" className="block hover:text-white transition-colors">Forum</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Resources</h4>
              <div className="space-y-2 text-sm">
                <Link href="/civic-education" className="block hover:text-white transition-colors">Civic Education</Link>
                <Link href="/report" className="block hover:text-white transition-colors">Report Issue</Link>
                <Link href="/login" className="block hover:text-white transition-colors">Login</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Demo Accounts</h4>
              <div className="space-y-1 text-xs">
                <div className="text-blue-300">admin@electwatch.gov</div>
                <div className="text-blue-300">citizen@electwatch.gov</div>
                <div className="text-blue-300">observer@electwatch.gov</div>
                <div className="text-blue-300">analyst@electwatch.gov</div>
                <div className="text-blue-400 mt-2 italic">password: [role]123</div>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-900 pt-6 text-center text-sm text-blue-400">
            FSAD-PS07 – Election Monitoring System | Built with transparency and integrity
          </div>
        </div>
      </footer>
    </div>
  );
}
