"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@electwatch.gov", password: "admin123" },
  { role: "Citizen", email: "citizen@electwatch.gov", password: "citizen123" },
  { role: "Observer", email: "observer@electwatch.gov", password: "observer123" },
  { role: "Analyst", email: "analyst@electwatch.gov", password: "analyst123" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      toast.success("Login successful!");
      const stored = localStorage.getItem("ems_user");
      if (stored) {
        const user = JSON.parse(stored);
        router.push(`/dashboard/${user.role}`);
      }
    } else {
      setError(result.error || "Invalid credentials");
    }
  };

  const quickLogin = async (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      toast.success("Login successful!");
      const stored = localStorage.getItem("ems_user");
      if (stored) {
        const user = JSON.parse(stored);
        router.push(`/dashboard/${user.role}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-16 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-bold">ElectWatch</div>
            <div className="text-blue-300 text-sm">Election Monitoring System</div>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 leading-tight">
          Transparent Elections.<br />
          <span className="text-blue-300">Empowered Citizens.</span>
        </h1>
        <p className="text-blue-200 text-lg leading-relaxed mb-8">
          Monitor elections in real-time, report irregularities, and help ensure every vote counts.
        </p>
        <div className="space-y-3">
          {["Real-time vote tracking", "Fraud detection & reporting", "Civic engagement tools", "Analytics & transparency"].map(f => (
            <div key={f} className="flex items-center gap-2 text-blue-100">
              <div className="w-5 h-5 rounded-full bg-green-500/80 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 lg:flex-none lg:w-[480px] flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-lg font-bold">ElectWatch</div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your ElectWatch account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Demo Accounts</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.role}
                      onClick={() => quickLogin(acc.email, acc.password)}
                      disabled={isLoading}
                      className="text-left p-2.5 rounded-lg border hover:bg-muted transition-colors text-xs disabled:opacity-50"
                    >
                      <div className="font-semibold text-foreground">{acc.role}</div>
                      <div className="text-muted-foreground truncate">{acc.email}</div>
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Register now
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
