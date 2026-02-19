export const mockElections = [
  {
    id: "e1",
    title: "General Elections 2026",
    type: "General",
    status: "ongoing",
    startDate: "2026-02-15",
    endDate: "2026-02-20",
    totalVoters: 924500,
    votescast: 412890,
    constituencies: 543,
    state: "National",
    description: "18th General Elections of the Republic. Citizens elect representatives to the Lok Sabha.",
    candidates: [
      { id: "c1", name: "Arvind Mehta", party: "National Progress Party", symbol: "Lotus", votes: 182450, color: "#f97316" },
      { id: "c2", name: "Sunita Verma", party: "United People Alliance", symbol: "Hand", votes: 155230, color: "#3b82f6" },
      { id: "c3", name: "Ramesh Gupta", party: "Peoples Democratic Front", symbol: "Bicycle", votes: 48900, color: "#22c55e" },
      { id: "c4", name: "Kavita Singh", party: "Independent", symbol: "Star", votes: 26310, color: "#a855f7" },
    ],
    regions: [
      { name: "North Zone", turnout: 72, fraud: 2 },
      { name: "South Zone", turnout: 68, fraud: 1 },
      { name: "East Zone", turnout: 65, fraud: 4 },
      { name: "West Zone", turnout: 74, fraud: 0 },
      { name: "Central Zone", turnout: 61, fraud: 3 },
    ]
  },
  {
    id: "e2",
    title: "Maharashtra State Assembly 2026",
    type: "State",
    status: "upcoming",
    startDate: "2026-03-10",
    endDate: "2026-03-10",
    totalVoters: 89200000,
    votescast: 0,
    constituencies: 288,
    state: "Maharashtra",
    description: "Maharashtra Legislative Assembly elections for 288 seats.",
    candidates: [
      { id: "c5", name: "Vijay Patil", party: "Progressive Maharashtra", symbol: "Clock", votes: 0, color: "#f97316" },
      { id: "c6", name: "Meera Desai", party: "Maha Vikas Front", symbol: "Lamp", votes: 0, color: "#3b82f6" },
    ],
    regions: []
  },
  {
    id: "e3",
    title: "Municipal Corporation Delhi 2026",
    type: "Municipal",
    status: "completed",
    startDate: "2026-01-05",
    endDate: "2026-01-05",
    totalVoters: 14200000,
    votescast: 9522000,
    constituencies: 272,
    state: "Delhi",
    description: "Delhi Municipal Corporation elections for ward councillors.",
    candidates: [
      { id: "c7", name: "Aam Aadmi Party", party: "Aam Aadmi Party", symbol: "Broom", votes: 4210000, color: "#3b82f6" },
      { id: "c8", name: "Bharatiya Jan Sangh", party: "BJP", symbol: "Lotus", votes: 3840000, color: "#f97316" },
      { id: "c9", name: "Indian National Congress", party: "INC", symbol: "Hand", votes: 1472000, color: "#22c55e" },
    ],
    regions: [
      { name: "North Delhi", turnout: 66, fraud: 1 },
      { name: "South Delhi", turnout: 71, fraud: 0 },
      { name: "East Delhi", turnout: 63, fraud: 2 },
      { name: "West Delhi", turnout: 68, fraud: 1 },
    ]
  }
];

export const mockReports = [
  { id: "r1", reporter: "Citizen 01", location: "Booth 42, North Zone", type: "Booth Capture", status: "under_review", description: "Armed individuals blocking voters from entering booth.", timestamp: "2026-02-19 09:23", severity: "critical", image: null },
  { id: "r2", reporter: "Observer Raj", location: "Polling Station 17, East Zone", type: "Technical Issue", status: "resolved", description: "EVM machine not functioning properly. Voters sent away.", timestamp: "2026-02-19 10:05", severity: "medium", image: null },
  { id: "r3", reporter: "Citizen 02", location: "Booth 8, South Zone", type: "Fraud", status: "verified", description: "Multiple people using same voter ID card.", timestamp: "2026-02-19 11:15", severity: "high", image: null },
  { id: "r4", reporter: "Citizen 03", location: "Booth 23, West Zone", type: "Intimidation", status: "pending", description: "Party workers intimidating voters outside 200m zone.", timestamp: "2026-02-19 12:00", severity: "high", image: null },
  { id: "r5", reporter: "Observer Priya", location: "Polling Station 55, Central Zone", type: "Technical Issue", status: "resolved", description: "Long queues due to slow VVPAT machine.", timestamp: "2026-02-18 14:30", severity: "low", image: null },
];

export const mockUsers = [
  { id: "u1", name: "Admin Kumar", email: "admin@electwatch.gov", role: "admin", status: "active", joined: "2025-01-10" },
  { id: "u2", name: "Priya Sharma", email: "citizen@electwatch.gov", role: "citizen", status: "active", joined: "2026-01-15" },
  { id: "u3", name: "Raj Observer", email: "observer@electwatch.gov", role: "observer", status: "active", joined: "2025-12-01" },
  { id: "u4", name: "Ananya Analyst", email: "analyst@electwatch.gov", role: "analyst", status: "active", joined: "2025-11-20" },
  { id: "u5", name: "Vikram Singh", email: "vikram@mail.com", role: "citizen", status: "pending", joined: "2026-02-10" },
  { id: "u6", name: "Sunita Patel", email: "sunita@mail.com", role: "observer", status: "blocked", joined: "2026-01-22" },
  { id: "u7", name: "Arjun Dev", email: "arjun@mail.com", role: "citizen", status: "active", joined: "2026-02-05" },
  { id: "u8", name: "Deepa Nair", email: "deepa@mail.com", role: "analyst", status: "active", joined: "2025-10-15" },
];

export const mockForumPosts = [
  { id: "f1", author: "Priya S.", role: "citizen", title: "How to verify my voter ID online?", body: "I want to check if my name is on the voter list before election day. What's the process?", replies: 12, likes: 34, timestamp: "2026-02-18", category: "FAQ" },
  { id: "f2", author: "Youth4Democracy", role: "citizen", title: "Why first-time voters should not miss 2026 elections", body: "As young citizens, our vote shapes the next 5 years of policy. Here's why every vote counts...", replies: 28, likes: 87, timestamp: "2026-02-17", category: "Awareness" },
  { id: "f3", author: "Raj O.", role: "observer", title: "Observer field report - polling station conditions", body: "Visited 12 polling stations in North Zone today. Overall positive experience with minor technical glitches...", replies: 5, likes: 19, timestamp: "2026-02-19", category: "Report" },
  { id: "f4", author: "Ananya A.", role: "analyst", title: "Voter turnout patterns - analysis of past 5 elections", body: "Interesting data showing urban vs rural turnout disparities. Younger demographic (18-25) shows 23% lower participation...", replies: 41, likes: 102, timestamp: "2026-02-16", category: "Analysis" },
  { id: "f5", author: "Civic Hero", role: "citizen", title: "NOTA - When and why to use it?", body: "Many voters don't know about NOTA (None of the Above). Here's a complete guide on when it makes sense to use it.", replies: 18, likes: 56, timestamp: "2026-02-15", category: "Education" },
];

export const mockPollingStations = [
  { id: "ps1", name: "Government School, Sector 14", district: "North Delhi", lat: 28.72, lng: 77.21, status: "active", boothNumber: "042", observers: 2 },
  { id: "ps2", name: "Community Hall, Raja Garden", district: "West Delhi", lat: 28.66, lng: 77.11, status: "active", boothNumber: "017", observers: 1 },
  { id: "ps3", name: "Municipal Building, Laxmi Nagar", district: "East Delhi", lat: 28.63, lng: 77.28, status: "issue", boothNumber: "089", observers: 3 },
  { id: "ps4", name: "Panchayat Office, Mehrauli", district: "South Delhi", lat: 28.52, lng: 77.18, status: "active", boothNumber: "156", observers: 2 },
];

export const voterTurnoutData = [
  { time: "8:00", turnout: 5 },
  { time: "9:00", turnout: 12 },
  { time: "10:00", turnout: 22 },
  { time: "11:00", turnout: 31 },
  { time: "12:00", turnout: 38 },
  { time: "13:00", turnout: 42 },
  { time: "14:00", turnout: 51 },
  { time: "15:00", turnout: 58 },
  { time: "16:00", turnout: 65 },
  { time: "17:00", turnout: 71 },
  { time: "18:00", turnout: 73 },
];

export const regionTurnoutData = [
  { region: "North", turnout: 72, target: 75, fraud: 2 },
  { region: "South", turnout: 68, target: 75, fraud: 1 },
  { region: "East", turnout: 65, target: 75, fraud: 4 },
  { region: "West", turnout: 74, target: 75, fraud: 0 },
  { region: "Central", turnout: 61, target: 75, fraud: 3 },
  { region: "NE", turnout: 78, target: 75, fraud: 1 },
];

export const auditLogs = [
  { id: "al1", action: "User Login", user: "admin@electwatch.gov", ip: "192.168.1.1", timestamp: "2026-02-19 09:00:00", status: "success" },
  { id: "al2", action: "Election Created", user: "admin@electwatch.gov", ip: "192.168.1.1", timestamp: "2026-02-19 09:05:32", status: "success" },
  { id: "al3", action: "Report Submitted", user: "citizen@electwatch.gov", ip: "203.45.12.87", timestamp: "2026-02-19 10:23:14", status: "success" },
  { id: "al4", action: "Failed Login Attempt", user: "unknown@test.com", ip: "45.32.100.12", timestamp: "2026-02-19 11:14:52", status: "failed" },
  { id: "al5", action: "User Blocked", user: "admin@electwatch.gov", ip: "192.168.1.1", timestamp: "2026-02-19 12:00:01", status: "success" },
  { id: "al6", action: "Report Verified", user: "observer@electwatch.gov", ip: "115.22.44.88", timestamp: "2026-02-19 13:30:45", status: "success" },
];
