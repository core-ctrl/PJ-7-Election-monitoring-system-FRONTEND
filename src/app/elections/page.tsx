"use client";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockPollingStations } from "@/lib/mock-data";
import Link from "next/link";
import { Vote, Search, MapPin, Calendar, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchElections } from "@/lib/api";

export default function ElectionsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElections()
      .then(data => {
        setElections(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = elections.filter(e => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.state?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Elections</h1>
          <p className="text-muted-foreground">Track ongoing, upcoming, and completed elections across India</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search elections..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {["all", "ongoing", "upcoming", "completed"].map((f) => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)} className="capitalize">
                {f}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12 text-muted-foreground">
            <Vote className="w-12 h-12 mx-auto mb-3 opacity-30 animate-pulse" />
            <p>Loading elections...</p>
          </div>
        )}

        {/* Election Cards */}
        {!loading && (
          <div className="grid gap-4 mb-10">
            {filtered.map((e) => (
              <Card key={e.id} className="border border-border/50 hover:shadow-md transition-all hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Vote className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg">{e.title}</h3>
                          <Badge className={
                            e.status === "ongoing"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : e.status === "upcoming"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-muted text-muted-foreground"
                          }>
                            {e.status === "ongoing" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse inline-block" />
                            )}
                            {e.status?.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{e.description}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />{e.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {e.startDate} → {e.endDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {e.totalVoters?.toLocaleString()} voters
                          </span>
                        </div>
                        {e.status === "ongoing" && e.totalVoters > 0 && (
                          <div className="mt-3 max-w-xs">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Turnout: {((e.votesCast / e.totalVoters) * 100).toFixed(1)}%</span>
                              <span>{e.votesCast?.toLocaleString()} votes</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full"
                                style={{ width: `${(e.votesCast / e.totalVoters) * 100}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/elections/${e.id}`}>
                        <Button>View Details</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <Vote className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No elections found. Add elections from Postman first!</p>
              </div>
            )}
          </div>
        )}

        {/* Polling Stations */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Polling Stations
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {mockPollingStations.map((ps) => (
              <Card key={ps.id} className="border border-border/50 hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${ps.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                    <Badge variant="outline" className="text-xs">
                      {ps.status === "active" ? "Normal" : "Issue"}
                    </Badge>
                  </div>
                  <div className="font-medium text-sm">{ps.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{ps.district}</div>
                  <div className="text-xs text-muted-foreground">
                    Booth #{ps.boothNumber} · {ps.observers} observers
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-3 text-xs">
                    Get Directions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="border border-border/50">
            <CardContent className="p-0">
              <div className="h-80 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">Polling station locations</p>
                  <div className="flex gap-4 mt-4 justify-center">
                    {mockPollingStations.map((ps) => (
                      <div key={ps.id} className="flex items-center gap-1.5 text-xs">
                        <div className={`w-3 h-3 rounded-full ${ps.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                        {ps.district}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}