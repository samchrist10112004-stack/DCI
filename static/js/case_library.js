// DIRECTORATE OF CRIMINAL INVESTIGATION (DCI) CASE LIBRARY MANAGER

class CaseLibrary {
  constructor() {
    this.cases = [];
    this.detectiveClearance = 1;
  }

  async loadAndRender() {
    const container = document.getElementById('case-library-container');
    if (!container) return;

    container.innerHTML = `<div style="font-family:var(--font-mono); color:var(--text-muted); padding:20px;">QUERYING DCI CASE REGISTRY DATABASE...</div>`;

    const data = await window.dciApi.getCases();
    if (!data || !data.cases) {
      container.innerHTML = `<div style="color:var(--accent-red); font-family:var(--font-mono);">ERROR LOADING CASE REGISTRY.</div>`;
      return;
    }

    this.cases = data.cases;
    this.detectiveClearance = data.detective_clearance || 1;
    this.render(container);
  }

  render(container) {
    container.innerHTML = `
      <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="font-family:var(--font-mono); color:#fff; font-size:1.1rem;">DCI CLASSIFIED CASE LIBRARY</h3>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Showing investigations accessible under your Clearance Level 0${this.detectiveClearance}.</p>
        </div>
        <span class="badge blue">ACTIVE CLEARANCE: L-0${this.detectiveClearance}</span>
      </div>

      <div class="cards-grid-4">
        ${this.cases.map(c => this.renderCaseCard(c)).join('')}
      </div>
    `;
  }

  renderCaseCard(c) {
    const isLocked = !c.accessible;
    const isSolved = (c.status === "SOLVED" && c.solved_info);

    if (isSolved) {
      return `
        <div class="dci-card" style="border:2px solid var(--accent-green); background:rgba(16, 185, 129, 0.04); box-shadow:0 0 20px rgba(16, 185, 129, 0.15);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="badge green">✅ SOLVED (${c.solved_info.score}/100)</span>
            <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted);">${c.case_number}</span>
          </div>

          <h3 style="font-family:var(--font-mono); color:#fff; font-size:1rem; margin-bottom:6px;">${c.title}</h3>
          <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4; min-height:42px;">
            <strong style="color:var(--accent-green);">VERDICT:</strong> ${c.solved_info.ending}<br>
            <span style="font-size:0.7rem; color:var(--text-muted);">Solved on ${c.solved_info.solved_date}</span>
          </p>

          <div style="margin-top:14px; padding-top:10px; border-top:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center; font-size:0.7rem; color:var(--text-muted);">
            <span>STATUS: <strong style="color:var(--accent-green);">CONVICTION ORDERED</strong></span>
            <span style="color:var(--accent-amber);">+${c.solved_info.xp_earned} XP</span>
          </div>

          <div style="margin-top:16px; display:flex; flex-direction:column; gap:8px;">
            <button class="btn-dci gold" style="width:100%; justify-content:center; font-size:0.75rem;" onclick="caseLibrary.startInvestigation('${c.case_id}')">
              📄 CASE ARCHIVES & CASE BOARD
            </button>
            <button class="btn-dci primary" style="width:100%; justify-content:center; font-size:0.75rem;" onclick="if(window.prosecutionEngine) window.prosecutionEngine.showCourtOrderModal(${c.solved_info.score})">
              📜 VIEW COURT ORDER
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="dci-card ${isLocked ? 'locked-card' : ''}" style="${isLocked ? 'opacity:0.6; border-color:#1e293b;' : ''}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="badge ${c.classification === 'RESTRICTED' ? 'blue' : c.classification === 'CONFIDENTIAL' ? 'amber' : 'red'}">${c.classification}</span>
          <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted);">${c.case_number}</span>
        </div>

        <h3 style="font-family:var(--font-mono); color:#fff; font-size:1rem; margin-bottom:6px;">${c.title}</h3>
        <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4; min-height:42px;">
          ${c.template ? c.template.summary : 'Classified Investigation.'}
        </p>

        <div style="margin-top:14px; padding-top:10px; border-top:1px solid #1e293b; display:flex; justify-content:space-between; align-items:center; font-size:0.7rem; color:var(--text-muted);">
          <span>DIFFICULTY: <strong style="color:var(--accent-red);">${c.difficulty}</strong></span>
          <span>DEADLINE: ${c.investigation_deadline_hours}H</span>
        </div>

        <div style="margin-top:16px;">
          ${isLocked ? 
            `<button class="btn-dci" style="width:100%; justify-content:center; cursor:not-allowed; opacity:0.6;" disabled>
              🔒 REQUIRES CLEARANCE LEVEL 0${c.required_clearance}
            </button>` : 
            `<button class="btn-dci primary" style="width:100%; justify-content:center;" onclick="caseLibrary.startInvestigation('${c.case_id}')">
              REQUEST CASE ASSIGNMENT
            </button>`
          }
        </div>
      </div>
    `;
  }

  startInvestigation(caseId) {
    if (window.audioEngine) window.audioEngine.playStamp();
    launchCaseAssignment(caseId);
  }
}

window.caseLibrary = new CaseLibrary();
