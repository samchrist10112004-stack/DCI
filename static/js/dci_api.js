// DIRECTORATE OF CRIMINAL INVESTIGATION (DCI) REST API CLIENT WITH DUAL-MODE FALLBACK

class DCIAPI {
  constructor() {
    this.baseUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
      ? 'http://127.0.0.1:8000/api' 
      : 'https://dci-dsmz.onrender.com/api';
    this.tokenKey = "dci_auth_token";
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }

  async checkCallsign(callsign) {
    const cs = (callsign || "").trim().toUpperCase();

    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`${this.baseUrl}/check-callsign?callsign=${encodeURIComponent(cs)}`);
        if (res.ok) return await res.json();
      } catch (err) {
        console.warn("Server API offline for callsign check:", err);
      }
    }

    const localDetectives = JSON.parse(localStorage.getItem("dci_local_detectives") || "[]");
    const exists = localDetectives.some(d => d.callsign && d.callsign.toUpperCase() === cs);
    return { callsign: cs, available: !exists };
  }

  async register(data) {
    const callsign = (data.callsign || "").trim().toUpperCase();
    const displayName = (data.display_name || data.callsign || "").trim();
    const email = (data.email || "").trim().toLowerCase();
    const password = (data.password || "").trim();

    if (!callsign || !email || !password) {
      return { error: "Please provide callsign, email, and password." };
    }

    try {
      const res = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callsign,
          display_name: displayName,
          email,
          password,
          country: data.country || "Global Operations",
          style: data.style || "Analytical"
        })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.token && json.detective) {
          this.setToken(json.token);
          localStorage.setItem("dci_current_user", JSON.stringify(json.detective));

          const localDetectives = JSON.parse(localStorage.getItem("dci_local_detectives") || "[]");
          const existingIdx = localDetectives.findIndex(d => d.callsign && d.callsign.toUpperCase() === callsign);
          if (existingIdx >= 0) {
            localDetectives[existingIdx] = { ...json.detective, password: password, token: json.token };
          } else {
            localDetectives.push({ ...json.detective, password: password, token: json.token });
          }
          localStorage.setItem("dci_local_detectives", JSON.stringify(localDetectives));

          return json;
        }
      }
    } catch (err) {
      console.warn("Server API offline during registration:", err);
    }

    const localDetectives = JSON.parse(localStorage.getItem("dci_local_detectives") || "[]");
    if (localDetectives.some(d => d.callsign && d.callsign.toUpperCase() === callsign)) {
      return { error: "CALLSIGN ALREADY ASSIGNED TO ANOTHER DETECTIVE." };
    }
    if (localDetectives.some(d => d.email && d.email.toLowerCase() === email)) {
      return { error: "EMAIL ALREADY REGISTERED IN DCI DATABASE." };
    }

    const detId = `DCI-26-${Math.floor(100000 + Math.random() * 900000)}`;
    const token = `token_${Date.now()}`;
    const detective = {
      detective_id: detId,
      callsign: callsign,
      display_name: displayName,
      country: data.country || "Global Operations",
      style: data.style || "Analytical",
      rank: "CADET DETECTIVE",
      clearance_level: 1,
      xp: 0,
      reputation: "UNKNOWN",
      cases_solved: 0,
      cases_failed: 0,
      cases_completed_count: 0,
      wrongful_accusations: 0,
      evidence_accuracy: 100,
      email: email,
      password: password,
      token: token
    };

    localDetectives.push(detective);
    localStorage.setItem("dci_local_detectives", JSON.stringify(localDetectives));
    localStorage.setItem("dci_current_user", JSON.stringify(detective));
    this.setToken(token);

    return { message: "PERSONNEL RECORD CREATED", token, detective };
  }

  async login(credentials) {
    const loginId = (credentials.login_id || "").trim().toUpperCase();
    const password = (credentials.password || "").trim();

    if (!loginId || !password) {
      return { error: "Please enter both login ID and password." };
    }

    try {
      const res = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login_id: loginId, password: password })
      });
      if (res.ok) {
        const json = await res.json();
        if (json.token && json.detective) {
          this.setToken(json.token);
          localStorage.setItem("dci_current_user", JSON.stringify(json.detective));
          return json;
        }
      }
    } catch (err) {
      console.warn("Server API offline during login:", err);
    }

    let localDetectives = JSON.parse(localStorage.getItem("dci_local_detectives") || "[]");
    
    const staticDemoAccount = {
      detective_id: "DCI-26-999999",
      callsign: "DEMO-OFFICER",
      display_name: "Inspector Demo Officer",
      email: "demo.officer@dci.internal",
      password: "demo123",
      country: "Global Operations",
      style: "Analytical",
      rank: "SENIOR DETECTIVE",
      clearance_level: 4,
      xp: 4500,
      reputation: "EXEMPLARY",
      cases_solved: 2,
      cases_failed: 0,
      cases_completed_count: 2,
      wrongful_accusations: 0,
      evidence_accuracy: 98,
      token: "demo_static_token_9999"
    };

    if (!localDetectives.some(d => d.callsign === "DEMO-OFFICER")) {
      localDetectives.push(staticDemoAccount);
      localStorage.setItem("dci_local_detectives", JSON.stringify(localDetectives));
    }

    const match = localDetectives.find(d => {
      const matchCallsign = d.callsign && d.callsign.toUpperCase() === loginId;
      const matchId = d.detective_id && d.detective_id.toUpperCase() === loginId;
      const matchEmail = d.email && d.email.toUpperCase() === loginId;
      const matchPassword = d.password === password;
      return (matchCallsign || matchId || matchEmail) && matchPassword;
    });

    if (match) {
      const token = match.token || `token_${Date.now()}`;
      this.setToken(token);
      localStorage.setItem("dci_current_user", JSON.stringify(match));
      return { message: "AUTHENTICATION SUCCESSFUL", token, detective: match };
    }

    return { error: "AUTHENTICATION FAILED: INVALID CREDENTIALS" };
  }

  async getProfile() {
    const token = this.getToken();
    if (!token) return null;

    if (window.location.protocol !== 'file:') {
      try {
        const res = await fetch(`${this.baseUrl}/profile`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          return json.detective;
        }
      } catch (err) {
        console.warn("Server API offline, reading profile from localStorage fallback:", err);
      }
    }

    const stored = localStorage.getItem("dci_current_user");
    return stored ? JSON.parse(stored) : null;
  }

  // SOLVED CASE CAREER BOOK RECORDING ENGINE
  recordSolvedCase(caseId, score, endingTitle, xpEarned) {
    const profile = JSON.parse(localStorage.getItem("dci_current_user") || "{}");
    if (!profile || !profile.callsign) return;

    const solvedList = JSON.parse(localStorage.getItem(`dci_solved_cases_${profile.callsign}`) || "[]");
    const existingIdx = solvedList.findIndex(c => c.case_id === caseId);

    const titleMap = {
      "CASE-DCI-001": "Operation Blackwood: Secured Residence Homicide",
      "CASE-DCI-002": "Disappearance at St. Jude's Academy",
      "CASE-DCI-003": "The Obsidian Syndicate Embezzlement & Homicide"
    };

    const record = {
      case_id: caseId,
      case_title: titleMap[caseId] || "Classified DCI Case",
      score: score,
      status: "SOLVED",
      ending: endingTitle,
      xp_earned: xpEarned,
      solved_date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    };

    if (existingIdx >= 0) {
      solvedList[existingIdx] = record;
    } else {
      solvedList.push(record);
      profile.cases_solved = (profile.cases_solved || 0) + 1;
      profile.cases_completed_count = (profile.cases_completed_count || 0) + 1;
    }

    profile.xp = (profile.xp || 0) + xpEarned;
    localStorage.setItem(`dci_solved_cases_${profile.callsign}`, JSON.stringify(solvedList));
    localStorage.setItem("dci_current_user", JSON.stringify(profile));

    // Update localDetectives list
    const localDetectives = JSON.parse(localStorage.getItem("dci_local_detectives") || "[]");
    const detIdx = localDetectives.findIndex(d => d.callsign && d.callsign.toUpperCase() === profile.callsign.toUpperCase());
    if (detIdx >= 0) {
      localDetectives[detIdx] = profile;
      localStorage.setItem("dci_local_detectives", JSON.stringify(localDetectives));
    }
  }

  getSolvedCases() {
    const profile = JSON.parse(localStorage.getItem("dci_current_user") || "{}");
    if (!profile || !profile.callsign) return [];
    return JSON.parse(localStorage.getItem(`dci_solved_cases_${profile.callsign}`) || "[]");
  }

  async getCases() {
    const profile = await this.getProfile();
    const clearance = profile ? profile.clearance_level : 1;
    const solvedCases = this.getSolvedCases();

    const mockCases = [
      {
        case_id: "CASE-DCI-001",
        case_number: "DCI-26-001",
        title: "Operation Blackwood: Secured Residence Homicide",
        classification: "RESTRICTED",
        difficulty: "EXTREME",
        status: solvedCases.some(c => c.case_id === "CASE-DCI-001") ? "SOLVED" : "AVAILABLE",
        solved_info: solvedCases.find(c => c.case_id === "CASE-DCI-001"),
        required_clearance: 1,
        investigation_deadline_hours: 72,
        accessible: clearance >= 1,
        template: { summary: "Lord Arthur Pendelton murdered inside locked estate study. 8 suspects, 3 conspiracies." }
      },
      {
        case_id: "CASE-DCI-002",
        case_number: "DCI-26-002",
        title: "Disappearance at St. Jude's Academy",
        classification: "RESTRICTED",
        difficulty: "NORMAL",
        status: solvedCases.some(c => c.case_id === "CASE-DCI-002") ? "SOLVED" : "AVAILABLE",
        solved_info: solvedCases.find(c => c.case_id === "CASE-DCI-002"),
        required_clearance: 1,
        investigation_deadline_hours: 48,
        accessible: clearance >= 1,
        template: { summary: "Headmaster vanishes from boarding school grounds during midnight lockup." }
      },
      {
        case_id: "CASE-DCI-003",
        case_number: "DCI-26-003",
        title: "The Obsidian Syndicate Embezzlement & Homicide",
        classification: "RESTRICTED",
        difficulty: "HARD",
        status: solvedCases.some(c => c.case_id === "CASE-DCI-003") ? "SOLVED" : "AVAILABLE",
        solved_info: solvedCases.find(c => c.case_id === "CASE-DCI-003"),
        required_clearance: 1,
        investigation_deadline_hours: 72,
        accessible: clearance >= 1,
        template: { summary: "Financial auditor poisoned in penthouse suite during offshore banking audit." }
      }
    ];

    return { cases: mockCases, detective_clearance: clearance };
  }

  async getPromotionStatus() {
    const profile = await this.getProfile();
    if (!profile) return { eligible: false, message: "No profile" };

    const completed = profile.cases_completed_count || 0;
    const reqCases = 3;
    const modulo = completed % reqCases;
    const remaining = modulo !== 0 ? reqCases - modulo : (completed >= reqCases ? 0 : reqCases);
    const reviewEligible = (completed > 0 && completed % reqCases === 0);

    const solved = profile.cases_solved || 0;
    const failed = profile.cases_failed || 0;
    const total = Math.max(1, solved + failed);
    const successRate = Math.floor((solved / total) * 100);
    const accuracy = profile.evidence_accuracy || 100;
    const wrongful = profile.wrongful_accusations || 0;
    const xp = profile.xp || 0;

    const meetsMetrics = (successRate >= 60 && accuracy >= 60 && xp >= 500 && wrongful <= 1);
    const status = reviewEligible ? (meetsMetrics ? "APPROVED" : "DEFERRED") : "IN_PROGRESS";

    return {
      current_rank: profile.rank,
      current_clearance: profile.clearance_level,
      next_rank: profile.clearance_level === 1 ? "JUNIOR INVESTIGATOR" : "INVESTIGATING OFFICER",
      cases_completed: completed,
      required_cases_per_rank: reqCases,
      cases_remaining_for_review: remaining,
      review_eligible: reviewEligible,
      promotion_status: status,
      metrics: {
        xp: { current: xp, required: 500, pass: xp >= 500 },
        success_rate: { current: successRate, required: 60, pass: successRate >= 60 },
        evidence_accuracy: { current: accuracy, required: 60, pass: accuracy >= 60 },
        wrongful_accusations: { current: wrongful, max_allowed: 1, pass: wrongful <= 1 }
      }
    };
  }

  async applyPromotion() {
    const profile = await this.getProfile();
    if (profile) {
      const ranks = ["CADET DETECTIVE", "JUNIOR INVESTIGATOR", "INVESTIGATING OFFICER", "SENIOR DETECTIVE", "LEAD INVESTIGATOR", "SPECIAL INVESTIGATIONS OFFICER", "CHIEF INVESTIGATOR", "DIRECTOR OF INVESTIGATIONS"];
      const nextIdx = profile.clearance_level;
      if (nextIdx < ranks.length) {
        profile.rank = ranks[nextIdx];
        profile.clearance_level = nextIdx + 1;
        localStorage.setItem("dci_current_user", JSON.stringify(profile));
        return { message: "PROMOTION APPROVED BY COMMAND", new_rank: profile.rank, new_clearance_level: profile.clearance_level };
      }
    }
    return { error: "Already at maximum rank" };
  }
}

window.dciApi = new DCIAPI();
