"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { fetchReports, createReport } from "@/lib/api";
import {
  AlertTriangle, Camera, MapPin, Upload, CheckCircle,
  Clock, Shield, Eye
} from "lucide-react";
import { toast } from "sonner";

const issueTypes = [
  "Booth Capture", "Voter Intimidation", "Fraud/Duplicate Vote",
  "Technical Issue (EVM)", "Technical Issue (VVPAT)", "Unauthorized Persons",
  "Accessibility Issue", "Process Violation", "Other"
];

export default function ReportPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [form, setForm] = useState({
    type: "", location: "", description: "", severity: "medium", boothNumber: ""
  });

  useEffect(() => {
    fetchReports()
      .then(data => setReports(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.location || !form.description) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsLoading(true);
    try {
      const newReport = await createReport({
        reporter: "Anonymous",
        location: form.location,
        type: form.type,
        status: "pending",
        description: form.description,
        severity: form.severity,
        timestamp: new Date().toISOString(),
      });
      setReports(prev => [newReport, ...prev]);
      setIsLoading(false);
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit report");
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Report Submitted!</h2>
          <p className="text-muted-foreground mb-2">
            Your report has been received and assigned Reference ID:{" "}
            <strong>RPT-2026-{Math.floor(Math.random() * 9000 + 1000)}</strong>
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            An election authority will review your report within 30 minutes.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setSubmitted(false)}>Submit Another Report</Button>
            <Button variant="outline" onClick={() => router.push("/")}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-orange-500" /> Report an Issue
          </h1>
          <p className="text-muted-foreground mt-1">
            Help maintain election integrity by reporting irregularities.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Issue Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Issue Type <span className="text-destructive">*</span></Label>
                      <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                        <SelectTrigger><SelectValue placeholder="Select issue type" /></SelectTrigger>
                        <SelectContent>
                          {issueTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Severity Level</Label>
                      <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low – Minor inconvenience</SelectItem>
                          <SelectItem value="medium">Medium – Significant issue</SelectItem>
                          <SelectItem value="high">High – Voter rights at risk</SelectItem>
                          <SelectItem value="critical">Critical – Election integrity threat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location / Address <span className="text-destructive">*</span></Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder="Polling station address"
                          value={form.location}
                          onChange={e => setForm({ ...form, location: e.target.value })} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Booth Number</Label>
                      <Input placeholder="e.g. 042" value={form.boothNumber}
                        onChange={e => setForm({ ...form, boothNumber: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description <span className="text-destructive">*</span></Label>
                    <Textarea
                      placeholder="Describe the issue in detail..."
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      rows={5} required
                    />
                  </div>

                  {/* Evidence Upload */}
                  <div className="space-y-2">
                    <Label>Upload Evidence (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium mb-1">Drop files here or click to upload</p>
                      <p className="text-xs text-muted-foreground">Images, videos up to 50MB</p>
                      <div className="flex gap-2 justify-center mt-3">
                        <Button type="button" variant="outline" size="sm"
                          onClick={() => toast.info("Camera access would be requested")}>
                          <Camera className="w-4 h-4 mr-2" /> Take Photo
                        </Button>
                        <Button type="button" variant="outline" size="sm"
                          onClick={() => toast.info("File picker would open")}>
                          <Upload className="w-4 h-4 mr-2" /> Upload File
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/40 rounded-lg p-4 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 inline mr-2 text-primary" />
                    Your identity will be kept confidential.
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    {isLoading ? "Submitting Report..." : "Submit Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Report Status Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { status: "Pending", desc: "Received, awaiting review", color: "bg-muted text-muted-foreground" },
                  { status: "Under Review", desc: "Being investigated", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
                  { status: "Verified", desc: "Confirmed, action taken", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
                  { status: "Resolved", desc: "Issue has been resolved", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
                ].map((s) => (
                  <div key={s.status} className="flex items-center gap-3">
                    <Badge className={s.color}>{s.status}</Badge>
                    <span className="text-sm text-muted-foreground">{s.desc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Reports from API */}
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Recent Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reports.length === 0 && (
                  <p className="text-sm text-muted-foreground">No reports yet.</p>
                )}
                {reports.slice(0, 4).map((r) => (
                  <div key={r.id} className="p-3 rounded-lg bg-muted/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{r.type}</span>
                      <Badge className={
                        r.severity === "critical"
                          ? "bg-red-100 text-red-700 text-xs"
                          : r.severity === "high"
                          ? "bg-orange-100 text-orange-700 text-xs"
                          : "bg-yellow-100 text-yellow-700 text-xs"
                      }>
                        {r.severity}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">{r.location}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {r.timestamp}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 border">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-blue-800 dark:text-blue-200">Emergency Helpline</span>
                </div>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">1800-111-VOTE</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">24/7 Election Monitoring Helpline</p>
                <p className="text-xs text-muted-foreground mt-2">For critical incidents requiring immediate intervention</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}