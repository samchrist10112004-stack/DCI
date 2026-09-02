// DIRECTORATE OF CRIMINAL INVESTIGATION (DCI) HEADQUARTERS COMMAND CENTER

function showHeadquartersDashboard(detective) {
  document.getElementById('landing-hero').style.display = 'none';
  document.getElementById('landing-features').style.display = 'none';
  document.getElementById('landing-ranks').style.display = 'none';

  const hqView = document.getElementById('hq-dashboard-view');
  if (hqView) hqView.style.display = 'block';

  const userBox = document.getElementById('nav-user-box');
  if (userBox) {
    userBox.innerHTML = `
      <span class="badge amber">${detective.rank}</span>
      <span style="font-family:var(--font-mono); color:#fff; font-size:0.85rem;">${detective.callsign}</span>
      <button class="btn-dci" onclick="handleLogout()" style="padding:4px 10px; font-size:0.75rem;">LOGOUT</button>
    `;
  }

  renderDetectiveIDCard(detective, 'hq-profile-id-card');
  renderCareerLedger(detective, 'hq-profile-id-card-full');

  const welcomeElem = document.getElementById('hq-welcome-banner');
  if (welcomeElem) {
    const identity = window.dciMail ? window.dciMail.getInvestigatorIdentity() : { email: `${detective.callsign.toLowerCase()}@dci.internal` };
    welcomeElem.innerHTML = `
      <h2 style="font-family:var(--font-mono); font-size:1.6rem; color:#fff;">WELCOME TO DCI HEADQUARTERS, DETECTIVE ${detective.callsign}.</h2>
      <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:4px;">
        PERMANENT ID: <span style="color:var(--accent-amber); font-weight:bold;">${detective.detective_id}</span> | 
        EMAIL: <span style="color:var(--accent-cyan); font-weight:bold;">${identity.email}</span> | 
        STATUS: <span class="badge green">ACTIVE</span> | 
        CLEARANCE: <span class="badge blue">LEVEL 0${detective.clearance_level}</span>
      </p>
    `;
  }

  renderFeaturedAssignmentCard();

  if (window.promotionEngine) {
    window.promotionEngine.renderProgressCard('hq-promotion-progress-container');
  }

  if (window.caseLibrary) {
    window.caseLibrary.loadAndRender();
  }
}

function renderDetectiveIDCard(detective, targetId) {
  const container = document.getElementById(targetId);
  if (!container) return;
  container.innerHTML = renderDetectiveIDCardHtml(detective);
}

function renderFeaturedAssignmentCard() {
  const container = document.getElementById('hq-featured-assignment-card');
  if (!container) return;

  const solvedCases = (window.dciApi && typeof window.dciApi.getSolvedCases === 'function')
    ? window.dciApi.getSolvedCases()
    : [];

  const solvedItem = solvedCases.find(c => c.case_id === 'CASE-DCI-001');

  if (solvedItem) {
    container.innerHTML = `
      <div class="dci-card" style="border:2px solid var(--accent-green); background:rgba(16, 185, 129, 0.05); box-shadow:0 0 25px rgba(16, 185, 129, 0.2);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="badge green" style="font-size:0.75rem; padding:4px 10px;">✅ SOLVED // CONVICTION ORDERED</span>
          <span class="badge amber">SCORE: ${solvedItem.score}/100</span>
        </div>
        <h2 style="font-family:var(--font-mono); color:#fff; font-size:1.4rem; margin:12px 0 6px;">OPERATION BLACKWOOD</h2>
        <p style="color:var(--text-secondary); font-size:0.88rem; line-height:1.5;">
          <strong>VERDICT RECORDED:</strong> ${solvedItem.ending}<br>
          <span style="font-size:0.78rem; color:var(--accent-green);">Judicial warrant executed against Marcus Vance & Gabriel Moreau. Solved on ${solvedItem.solved_date}.</span>
        </p>
        <div style="margin-top:20px; display:flex; gap:12px;">
          <button class="btn-dci gold" onclick="launchCaseAssignment('CASE-DCI-001')">📄 REVIEW CASE ARCHIVES & CASE BOARD</button>
          <button class="btn-dci primary" onclick="if(window.prosecutionEngine) window.prosecutionEngine.showCourtOrderModal(${solvedItem.score})">📜 VIEW HIGH COURT CONVICTION ORDER</button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="dci-card" style="border-color:var(--accent-red);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="badge red">RESTRICTED // HOMICIDE</span>
          <span class="badge amber">CASE ID: CASE-DCI-001</span>
        </div>
        <h2 style="font-family:var(--font-mono); color:#fff; font-size:1.4rem; margin:12px 0 6px;">OPERATION BLACKWOOD</h2>
        <p style="color:var(--text-secondary); font-size:0.88rem; line-height:1.5;">
          High-profile murder of Lord Arthur Pendelton inside secured Blackwood Manor. 8 suspects, 3 overlapping conspiracies, 72-hour investigation deadline.
        </p>
        <div style="margin-top:20px; display:flex; gap:12px;">
          <button class="btn-dci primary" onclick="launchCaseAssignment('CASE-DCI-001')">COMMENCE SOLO INVESTIGATION</button>
          <button class="btn-dci gold" onclick="twoPlayerRoom.createRoom('CASE-DCI-001')">CREATE JOINT ROOM (2-PLAYER)</button>
        </div>
      </div>
    `;
  }
}

function renderCareerLedger(detective, targetElemId) {
  const container = document.getElementById(targetElemId);
  if (!container || !detective) return;

  const solvedCases = (window.dciApi && typeof window.dciApi.getSolvedCases === 'function')
    ? window.dciApi.getSolvedCases()
    : [];

  container.innerHTML = `
    <div style="margin-bottom:20px;">
      ${renderDetectiveIDCardHtml(detective)}
    </div>

    <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:8px; padding:20px; font-family:var(--font-mono);">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:14px;">
        <h3 style="color:#fff; font-size:1rem;">📖 DETECTIVE CAREER SERVICE BOOK</h3>
        <span class="badge green">TOTAL SOLVED: ${solvedCases.length}</span>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; font-size:0.8rem;">
        <div style="background:#05080e; border:1px solid var(--border-color); padding:10px; border-radius:4px;">
          <span style="color:var(--text-muted); font-size:0.7rem; display:block;">CAREER XP ACCUMULATED</span>
          <strong style="color:var(--accent-amber); font-size:1.1rem;">${detective.xp || 0} XP</strong>
        </div>
        <div style="background:#05080e; border:1px solid var(--border-color); padding:10px; border-radius:4px;">
          <span style="color:var(--text-muted); font-size:0.7rem; display:block;">CURRENT CLEARANCE RANK</span>
          <strong style="color:var(--accent-green); font-size:1.1rem;">L-0${detective.clearance_level} (${detective.rank})</strong>
        </div>
      </div>

      <h4 style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:10px;">SOLVED CASE HISTORY LEDGER:</h4>
      ${solvedCases.length > 0 ? solvedCases.map(c => `
        <div style="background:#090e1a; border:1px solid var(--accent-green); border-radius:6px; padding:14px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fff; font-size:0.9rem;">${c.case_id}: ${c.case_title}</strong>
            <span class="badge green">SOLVED (${c.score}/100)</span>
          </div>
          <p style="font-size:0.78rem; color:var(--text-secondary); margin-top:4px;">
            ${c.ending} | Date: ${c.solved_date}
          </p>
          <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.7rem; color:var(--accent-amber);">+${c.xp_earned} XP AWARDED</span>
            <button class="btn-dci gold" style="padding:2px 8px; font-size:0.7rem;" onclick="if(window.prosecutionEngine) window.prosecutionEngine.showCourtOrderModal(${c.score})">📜 VIEW COURT ORDER</button>
          </div>
        </div>
      `).join('') : '<p style="font-size:0.8rem; color:var(--text-muted);">No solved cases recorded yet. Complete an investigation to log your career progress.</p>'}
    </div>
  `;
}

function renderDetectiveIDCardHtml(detective) {
  const identity = window.dciMail ? window.dciMail.getInvestigatorIdentity() : { email: `${detective.callsign.toLowerCase()}@dci.internal` };
  return `
    <div class="id-card-wrap">
      <div class="id-card-header">
        <div>
          <span style="font-size:0.65rem; color:var(--accent-amber); letter-spacing:1px; display:block;">DIRECTORATE OF CRIMINAL INVESTIGATION</span>
          <span style="font-size:0.9rem; font-weight:bold; color:#fff;">OFFICIAL DETECTIVE BADGE</span>
        </div>
        <span class="badge red">CLEARANCE L-0${detective.clearance_level}</span>
      </div>

      <div class="id-card-body">
        <div class="id-photo-box" style="padding:0; overflow:hidden; background:transparent;">
          <img src="images/dci_official_logo.png" alt="DCI Emblem" style="width:100%; height:100%; object-fit:cover; border-radius:4px;">
        </div>
        <div class="id-details">
          <div>
            <div class="id-field-label">DETECTIVE CALLSIGN</div>
            <div class="id-field-value" style="color:var(--accent-amber); font-size:1rem;">${detective.callsign}</div>
          </div>
          <div>
            <div class="id-field-label">FULL NAME</div>
            <div class="id-field-value">${detective.display_name}</div>
          </div>
          <div>
            <div class="id-field-label">ORGANIZATIONAL EMAIL</div>
            <div class="id-field-value" style="color:var(--accent-cyan); font-size:0.75rem;">${identity.email}</div>
          </div>
          <div>
            <div class="id-field-label">PERMANENT ID</div>
            <div class="id-field-value">${detective.detective_id}</div>
          </div>
          <div>
            <div class="id-field-label">RANK & CLEARANCE</div>
            <div class="id-field-value">${detective.rank} (L-0${detective.clearance_level})</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleLogout() {
  window.dciApi.clearToken();
  window.currentDetective = null;
  location.reload();
}

function launchCaseAssignment(caseId) {
  document.getElementById('hq-dashboard-view').style.display = 'none';
  const caseContainer = document.getElementById('case-game-overlay');
  if (caseContainer) {
    caseContainer.style.display = 'block';
    if (window.initOperationBlackwoodCase) {
      window.initOperationBlackwoodCase(caseId);
    }
  }
}

function switchHqTab(tabId, clickedBtn) {
  document.querySelectorAll('.hq-nav-item').forEach(i => i.classList.remove('active'));
  if (clickedBtn) clickedBtn.classList.add('active');

  document.querySelectorAll('.hq-tab-content').forEach(c => c.style.display = 'none');
  const activeTab = document.getElementById(`hq-tab-${tabId}`);
  if (activeTab) {
    activeTab.style.display = 'block';
    if (tabId === 'mail' && window.dciMail) {
      window.dciMail.renderMailbox('hq-tab-mail-container');
    }
  }
}
