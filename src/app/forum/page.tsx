"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth-context";
import { fetchForumPosts, createForumPost, likeForumPost } from "@/lib/api";
import {
  MessageSquare, Heart, Search, Plus, Tag, TrendingUp, Users
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["All", "FAQ", "Awareness", "Report", "Analysis", "Education", "Discussion"];

const categoryColors: Record<string, string> = {
  FAQ: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Awareness: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Report: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Analysis: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Education: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Discussion: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  citizen: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  observer: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  analyst: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export default function ForumPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", category: "Discussion" });
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForumPosts()
      .then(data => {
        setPosts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.content?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const toggleLike = async (id: number) => {
    try {
      await likeForumPost(id);
      const newLiked = new Set(liked);
      if (newLiked.has(id)) {
        newLiked.delete(id);
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes - 1 } : p));
      } else {
        newLiked.add(id);
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
      }
      setLiked(newLiked);
    } catch {
      toast.error("Failed to like post");
    }
  };

  const submitPost = async () => {
    if (!newPost.title || !newPost.body) { toast.error("Fill all fields"); return; }
    try {
      const post = await createForumPost({
        title: newPost.title,
        content: newPost.body,
        author: user?.name || "Anonymous",
        likes: 0,
        replies: 0,
      });
      setPosts(prev => [post, ...prev]);
      setNewPost({ title: "", body: "", category: "Discussion" });
      setShowNewPost(false);
      toast.success("Post created!");
    } catch {
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-primary" /> Community Forum
            </h1>
            <p className="text-muted-foreground mt-1">
              Discuss elections, share insights, ask questions, and inspire fellow citizens.
            </p>
          </div>
          {user && (
            <Button onClick={() => setShowNewPost(!showNewPost)}>
              <Plus className="w-4 h-4 mr-2" /> New Post
            </Button>
          )}
        </div>

        {/* New Post Form */}
        {showNewPost && user && (
          <Card className="border border-primary/30 mb-6">
            <CardHeader>
              <CardTitle className="text-base">Create New Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Post title..."
                value={newPost.title}
                onChange={e => setNewPost({ ...newPost, title: e.target.value })}
              />
              <Textarea
                placeholder="Share your thoughts, questions, or insights..."
                value={newPost.body}
                onChange={e => setNewPost({ ...newPost, body: e.target.value })}
                rows={4}
              />
              <div className="flex items-center gap-3">
                <select
                  className="flex h-9 w-40 rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={newPost.category}
                  onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                >
                  {CATEGORIES.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <Button onClick={submitPost}>Publish Post</Button>
                <Button variant="ghost" onClick={() => setShowNewPost(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search discussions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <Button
                  key={c} size="sm"
                  variant={category === c ? "default" : "outline"}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </Button>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30 animate-pulse" />
                <p>Loading posts...</p>
              </div>
            )}

            {/* Posts */}
            {!loading && filtered.map((post) => (
              <Card key={post.id} className="border border-border/50 hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                        {post.author?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-semibold">{post.author}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${roleColors[post.role] || roleColors.citizen}`}>
                            {post.role || "citizen"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <h3 className="font-semibold text-base group-hover:text-primary transition-colors mb-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <button
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${liked.has(post.id) ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                              }`}
                          >
                            <Heart className={`w-4 h-4 ${liked.has(post.id) ? "fill-current" : ""}`} />
                            {post.likes}
                          </button>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MessageSquare className="w-4 h-4" />
                            {post.replies} replies
                          </div>
                        </div>
                      </div>
                    </div>
                    {post.category && (
                      <Badge className={categoryColors[post.category] || "bg-muted text-muted-foreground"}>
                        {post.category}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No posts found. Be the first to start a discussion!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card className="border border-border/50">
              <CardHeader><CardTitle className="text-sm">Forum Stats</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Total Discussions", value: posts.length.toString(), icon: MessageSquare },
                  { label: "Community Members", value: "1,842", icon: Users },
                  { label: "Topics This Week", value: "47", icon: TrendingUp },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <s.icon className="w-4 h-4" />
                      {s.label}
                    </div>
                    <span className="font-semibold text-sm">{s.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader><CardTitle className="text-sm">Trending Topics</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {["#GeneralElections2026", "#VoterID", "#EVMDebate", "#NOTA", "#YoungVoters", "#FairElections"].map((tag) => (
                  <button key={tag} onClick={() => setSearch(tag.slice(1))}
                    className="flex items-center gap-2 text-sm text-primary hover:underline w-full text-left">
                    <Tag className="w-3.5 h-3.5" /> {tag}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border/50">
              <CardHeader><CardTitle className="text-sm">Community Guidelines</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>• Be respectful and constructive</p>
                <p>• Share verified information only</p>
                <p>• No misinformation or hate speech</p>
                <p>• Respect electoral confidentiality</p>
                <p>• Report suspicious content</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}