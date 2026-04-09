const BASE_URL = "http://localhost:8080/api";

// Auth
export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

// Helper
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

// Elections
export async function fetchElections() {
  const res = await fetch(`${BASE_URL}/elections`);
  return res.json();
}

export async function fetchElectionById(id: number) {
  const res = await fetch(`${BASE_URL}/elections/${id}`);
  return res.json();
}

export async function createElection(election: any) {
  const res = await fetch(`${BASE_URL}/elections`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(election)
  });
  return res.json();
}

export async function updateElection(id: number, election: any) {
  const res = await fetch(`${BASE_URL}/elections/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(election)
  });
  return res.json();
}

export async function deleteElection(id: number) {
  const res = await fetch(`${BASE_URL}/elections/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  return res.json();
}

// Candidates
export async function fetchCandidates(electionId: number) {
  const res = await fetch(`${BASE_URL}/candidates/election/${electionId}`);
  return res.json();
}

export async function createCandidate(candidate: any) {
  const res = await fetch(`${BASE_URL}/candidates`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(candidate)
  });
  return res.json();
}

// Forum
export async function fetchForumPosts() {
  const res = await fetch(`${BASE_URL}/forum`);
  return res.json();
}

export async function createForumPost(post: any) {
  const res = await fetch(`${BASE_URL}/forum`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(post)
  });
  return res.json();
}

export async function likeForumPost(id: number) {
  const res = await fetch(`${BASE_URL}/forum/${id}/like`, {
    method: "PUT",
    headers: getAuthHeaders()
  });
  return res.json();
}
// ==================== REPORTS ====================
export async function fetchReports() {
  const res = await fetch(`${BASE_URL}/reports`);
  return res.json();
}

export async function createReport(report: any) {
  const res = await fetch(`${BASE_URL}/reports`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(report)
  });
  return res.json();
}

export async function updateReportStatus(id: number, status: string) {
  const res = await fetch(`${BASE_URL}/reports/${id}/status?status=${status}`, {
    method: "PUT",
    headers: getAuthHeaders()
  });
  return res.json();
}