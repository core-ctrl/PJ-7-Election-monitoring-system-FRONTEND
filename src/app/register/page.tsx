"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, User, Mail, Lock, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", role: "citizen", password: "", confirmPassword: "", otp: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        });
        const data = await res.text();
        if (data === "Registered successfully") {
          setIsLoading(false);
          setStep(3);
          toast.success("Registration successful!");
        } else if (data === "Email already exists") {
          toast.error("Email already registered!");
          setIsLoading(false);
        } else {
          toast.error("Registration failed");
          setIsLoading(false);
        }
      } catch {
        toast.error("Cannot connect to server");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
      {/* Left panel */}
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
        <h1 className="text-4xl font-bold mb-4">Join the movement<br /><span className="text-green-400">for fair elections.</span></h1>
        <p className="text-blue-200 text-lg mb-8">Register as a citizen, observer, or analyst and play your part in democratic transparency.</p>
        <div className="space-y-3">
          {["Monitor elections in real-time", "Report suspicious activities", "Access election analytics", "Engage with civic community"].map(f => (
            <div key={f} className="flex items-center gap-2 text-blue-100">
              <CheckCircle className="w-5 h-5 text-green-400" /> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 lg:flex-none lg:w-[480px] flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-lg font-bold">ElectWatch</div>
          </div>

          {step === 3 ? (
            <Card className="border-0 shadow-xl text-center">
              <CardContent className="pt-12 pb-10">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                <p className="text-muted-foreground mb-2">Your account has been created and is pending admin approval.</p>
                <p className="text-sm text-muted-foreground mb-8">You'll receive an email once your account is verified.</p>
                <Button onClick={() => router.push("/login")} className="w-full">Proceed to Login</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">{step === 1 ? "Create Account" : "Verify Email"}</CardTitle>
                <CardDescription>
                  {step === 1 ? "Join ElectWatch to participate in election monitoring" : `Enter the OTP sent to ${formData.email}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Steps indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {[1, 2].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${s <= step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        }`}>{s}</div>
                      {s < 2 && <div className={`h-0.5 w-8 transition-colors ${s < step ? "bg-primary" : "bg-muted"}`} />}
                    </div>
                  ))}
                  <span className="text-xs text-muted-foreground ml-2">{step === 1 ? "Account Details" : "Verify OTP"}</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {step === 1 ? (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="Your full name" value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="email" placeholder="you@example.com" value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" placeholder="+91 XXXXX XXXXX" value={formData.phone}
                              onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Register As</Label>
                          <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="citizen">Citizen</SelectItem>
                              <SelectItem value="observer">Election Observer</SelectItem>
                              <SelectItem value="analyst">Data Analyst</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="password" placeholder="Create password" value={formData.password}
                              onChange={e => setFormData({ ...formData, password: e.target.value })} required minLength={6} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-10" type="password" placeholder="Confirm password" value={formData.confirmPassword}
                              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} required />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4 text-sm text-center">
                        A 6-digit OTP has been sent to<br />
                        <span className="font-semibold text-foreground">{formData.email}</span>
                      </div>
                      <div className="space-y-2">
                        <Label>Enter OTP</Label>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={formData.otp}
                          onChange={e => setFormData({ ...formData, otp: e.target.value })}
                          maxLength={6}
                          className="text-center text-2xl tracking-widest letter-spacing-widest"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Demo: enter any 6 digits to continue
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? "Processing..." : step === 1 ? "Continue" : "Verify & Register"}
                  </Button>
                  {step === 2 && (
                    <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)}>Back</Button>
                  )}
                </form>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
