"use client";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import {
  BookOpen, Vote, Shield, Users, Star, CheckCircle, ChevronRight,
  Lightbulb, Globe, Heart, Award, Play
} from "lucide-react";

const articles = [
  {
    id: 1, title: "How Voting Works in India", category: "Process", readTime: "5 min",
    icon: Vote,
    summary: "Step-by-step guide to the Indian electoral process — from voter registration to result declaration.",
    content: [
      "Voter Registration: Register at your local electoral office or online at voters.eci.gov.in",
      "Voter ID: Ensure your EPIC (Electoral Photo Identity Card) is valid and up-to-date",
      "Polling Day: Visit your assigned polling booth with your Voter ID between 7 AM – 6 PM",
      "Casting Vote: Show ID, receive ballot paper, vote using EVM, verify on VVPAT",
      "Result Declaration: Votes are counted publicly; results announced by Election Commission"
    ],
  },
  {
    id: 2, title: "Why Your Vote Matters", category: "Awareness", readTime: "3 min",
    icon: Heart,
    summary: "Understand the real impact of your single vote on national policy, governance, and your daily life.",
    content: [
      "In 2014, 5 Lok Sabha seats were decided by fewer than 1,000 votes each",
      "Your vote directly elects your MP who votes on laws affecting education, healthcare, taxes",
      "Low turnout gives disproportionate power to organized voting blocs",
      "Young voters (18-25) are now India's largest demographic — collectively decisive",
      "Abstaining is also a choice — but one that others make for you"
    ],
  },
  {
    id: 3, title: "Understanding EVM & VVPAT", category: "Technology", readTime: "4 min",
    icon: Shield,
    summary: "How Electronic Voting Machines work, why they're secure, and the role of VVPAT verification.",
    content: [
      "EVMs are standalone devices with no network connectivity — cannot be hacked remotely",
      "Each EVM stores votes in encrypted form, accessible only with special keys",
      "VVPAT (Voter Verifiable Paper Audit Trail) prints a slip showing your vote for 7 seconds",
      "You can verify your vote was recorded correctly via VVPAT",
      "EVMs are tested and sealed before deployment; observers monitor the process"
    ],
  },
  {
    id: 4, title: "Using NOTA – None of the Above", category: "Rights", readTime: "2 min",
    icon: Star,
    summary: "What NOTA means, when to use it, and its legal implications in Indian elections.",
    content: [
      "NOTA was introduced by the Supreme Court in 2013 to protect voter choice",
      "NOTA allows you to reject all candidates without spoiling your ballot",
      "NOTA votes are counted but do not affect the election outcome — the candidate with most valid votes wins",
      "Use NOTA when you feel no candidate deserves your vote",
      "High NOTA percentages send a strong message to political parties"
    ],
  },
  {
    id: 5, title: "Voter Rights & Protections", category: "Rights", readTime: "4 min",
    icon: Shield,
    summary: "Know your rights as a voter — what you're entitled to, and what constitutes illegal interference.",
    content: [
      "Right to vote: Every citizen above 18 on the electoral roll has an unconditional right to vote",
      "Right to secret ballot: No one can force you to reveal how you voted",
      "Protection from intimidation: Any coercion near polling booth is illegal (200m exclusion zone)",
      "Right to assistance: Disabled voters can bring one attendant into the booth",
      "Right to complain: Report violations to the Returning Officer or call 1950"
    ],
  },
  {
    id: 6, title: "Election Observer Program", category: "Participation", readTime: "3 min",
    icon: Globe,
    summary: "How citizens can become election observers and help ensure fair polling process.",
    content: [
      "Election Commission appoints IAS/IPS officers as central observers",
      "Citizens can apply to be Booth Level Officers (BLOs) in their area",
      "NGOs can register with ECI to deploy observer teams",
      "Observers monitor EVM sealing, voter list accuracy, and polling conduct",
      "Submit observer credentials at your District Election Office"
    ],
  },
];

const faqs = [
  { q: "Can I vote without a Voter ID?", a: "Yes! You can use 12 alternative documents including Aadhaar, Passport, Driving License, MNREGA Job Card, or Bank/Post Office Passbook with photo." },
  { q: "What if my name is missing from the voter list?", a: "File Form 6 with your Electoral Registration Officer at least 10 days before the election. You can also register online at voters.eci.gov.in" },
  { q: "Can I vote from a different city than my registration?", a: "No, you must vote in the constituency where you are registered. However, government employees can register for proxy voting." },
  { q: "Is it compulsory to vote?", a: "Voting is not legally compulsory in India (except Gujarat, which passed a local mandatory voting law). However, it is a civic duty." },
  { q: "What happens if my finger ink mark is already there?", a: "This indicates fraud. Report immediately to the Presiding Officer and Returning Officer. Your vote can be verified via VVPAT." },
  { q: "Can I take a photo inside the polling booth?", a: "No. Photography inside the polling booth is strictly prohibited and is a punishable offense under Section 128 of the Representation of the People Act." },
];

const quizQuestions = [
  { q: "At what age can an Indian citizen vote?", options: ["16", "18", "21", "25"], answer: 1 },
  { q: "What does NOTA stand for?", options: ["None Of The Above", "Not Over The Act", "No Other Than Accepted", "National Option To Abstain"], answer: 0 },
  { q: "VVPAT stands for:", options: ["Vote Verified Paper Audit Trail", "Voter Verifiable Paper Audit Trail", "Valid Voting Paper And Tracking", "Verified Voting Printed Audit Trail"], answer: 1 },
  { q: "How long is an EVM voting slip visible on VVPAT?", options: ["3 seconds", "5 seconds", "7 seconds", "10 seconds"], answer: 2 },
];

export default function CivicEducationPage() {
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(articles.map(a => a.category)))];
  const filteredArticles = categoryFilter === "All" ? articles : articles.filter(a => a.category === categoryFilter);

  const quizScore = Object.entries(quizAnswers).filter(([i, ans]) => quizQuestions[parseInt(i)].answer === ans).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-900 to-emerald-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-9 h-9" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Civic Education Center</h1>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Empowering every Indian citizen with the knowledge to participate meaningfully in democracy. Learn, engage, and inspire others.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[{ label: "Articles", value: "6" }, { label: "FAQs", value: "6" }, { label: "Quiz Questions", value: "4" }].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl px-6 py-3 text-center">
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-green-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {selectedArticle ? (
          /* Article Detail */
          <div className="max-w-3xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)} className="mb-6">
              ← Back to Articles
            </Button>
            <Card className="border border-border/50">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <selectedArticle.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Badge className="mb-1">{selectedArticle.category}</Badge>
                    <div className="text-sm text-muted-foreground">{selectedArticle.readTime} read</div>
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-3">{selectedArticle.title}</h1>
                <p className="text-muted-foreground mb-6">{selectedArticle.summary}</p>
                <div className="space-y-4">
                  {selectedArticle.content.map((point, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className="text-sm leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Articles Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" /> Learning Articles
              </h2>
              <p className="text-muted-foreground mb-6">Essential knowledge for every voter</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(c => (
                  <Button key={c} size="sm" variant={categoryFilter === c ? "default" : "outline"} onClick={() => setCategoryFilter(c)}>
                    {c}
                  </Button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredArticles.map((article) => (
                  <Card key={article.id} className="border border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group"
                    onClick={() => setSelectedArticle(article)}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <article.icon className="w-5 h-5 text-primary" />
                        </div>
                        <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                      </div>
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.summary}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{article.readTime} read</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-primary" /> Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground mb-6">Quick answers to common voter questions</p>
              <Card className="border border-border/50">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="divide-y divide-border">
                    {faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`} className="px-6">
                        <AccordionTrigger className="text-left font-medium py-4">{faq.q}</AccordionTrigger>
                        <AccordionContent className="pb-4 text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            {/* Quiz Section */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" /> Voter Knowledge Quiz
              </h2>
              <p className="text-muted-foreground mb-6">Test your knowledge about Indian elections</p>

              {quizSubmitted ? (
                <Card className="border border-border/50 text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Your Score: {quizScore}/{quizQuestions.length}</h3>
                  <p className="text-muted-foreground mb-4">
                    {quizScore === quizQuestions.length ? "Perfect score! You're a true civic champion!" :
                     quizScore >= quizQuestions.length / 2 ? "Good job! Keep learning to become a civic expert." :
                     "Keep reading the articles above to improve your knowledge!"}
                  </p>
                  <Button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}>Retake Quiz</Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {quizQuestions.map((q, qi) => (
                    <Card key={qi} className="border border-border/50">
                      <CardContent className="p-6">
                        <p className="font-semibold mb-4">{qi + 1}. {q.q}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => (
                            <button
                              key={oi}
                              onClick={() => setQuizAnswers({...quizAnswers, [qi]: oi})}
                              className={`p-3 rounded-lg border text-sm text-left transition-all ${
                                quizAnswers[qi] === oi
                                  ? "border-primary bg-primary/10 text-primary font-medium"
                                  : "border-border hover:border-primary/50 hover:bg-muted/30"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button className="w-full"
                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                    onClick={() => setQuizSubmitted(true)}>
                    Submit Quiz ({Object.keys(quizAnswers).length}/{quizQuestions.length} answered)
                  </Button>
                </div>
              )}
            </section>

            {/* Youth CTA */}
            <section>
              <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border">
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-3">Are you a first-time voter?</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Join 180 million first-time voters in the 2026 elections. Register today and be part of history!
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button size="lg">Register to Vote</Button>
                    <Button size="lg" variant="outline">Share with Friends</Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
