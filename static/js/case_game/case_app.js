// DCI PLATFORM: DYNAMIC MULTI-CASE INITIALIZER & CONTROLLER

window.initOperationBlackwoodCase = function(caseId) {
  const selectedCaseId = caseId || "CASE-DCI-001";
  console.log(`Initializing Case File ${selectedCaseId} inside DCI Platform...`);

  window.ACTIVE_CASE_ID = selectedCaseId;

  if (selectedCaseId === "CASE-DCI-002" || selectedCaseId === "DCI-26-002") {
    window.CASE_DATA = window.CASE_DATA_002;
    if (window.gameEngine) {
      window.gameEngine.state.timeRemaining = 48;
      window.gameEngine.state.budget = 5000;
      window.gameEngine.state.discoveredEvidence = ["EVD2-01", "EVD2-02", "EVD2-03", "EVD2-04"];
      window.gameEngine.state.gameOver = false;
    }
  } else {
    window.CASE_DATA = window.CASE_DATA_001 || window.CASE_DATA;
    if (window.gameEngine) {
      window.gameEngine.state.timeRemaining = 72;
      window.gameEngine.state.budget = 5000;
      window.gameEngine.state.discoveredEvidence = ["EVD-01", "EVD-02", "EVD-03", "EVD-04"];
      window.gameEngine.state.gameOver = false;
    }
  }

  // Update Header UI
  updateCaseHeaderMeta(window.CASE_DATA);

  // Initialize Canvas Views
  window.caseBoard = new CaseBoardGraph('case-board-canvas');
  window.floorPlan = new FloorPlan('floorplan-canvas');

  if (window.gameEngine && window.gameEngine.subscribe) {
    window.gameEngine.subscribe(state => updateCaseHeaderUI(state));
  }

  // Render Views dynamically with active case dataset
  renderCaseBriefingView();
  renderCaseSuspectCards();
  renderCaseEvidenceLocker();
  if (window.timelineMatrix) window.timelineMatrix.render();
  if (window.forensicLab) window.forensicLab.render();
  if (window.prosecutionEngine) window.prosecutionEngine.render();
  if (window.interrogationEngine) window.interrogationEngine.render();

  document.querySelectorAll('.game-nav .nav-btn').forEach(btn => {
    btn.onclick = () => {
      const targetView = btn.dataset.view;
      if (targetView) {
        switchCaseView(targetView, btn);
      }
    };
  });

  document.querySelectorAll('.case-filter-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.case-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCaseEvidenceLocker(btn.dataset.category);
    };
  });
};

function updateCaseHeaderMeta(caseData) {
  if (!caseData || !caseData.meta) return;
  const stamp = document.querySelector('.case-badge .classified-stamp');
  const titleBox = document.querySelector('.case-title-box');
  
  if (stamp) stamp.textContent = `DCI // ${caseData.meta.title.toUpperCase()}`;
  if (titleBox) {
    titleBox.innerHTML = `
      <h1 style="margin:0;">CASE #${caseData.meta.case_number}: ${caseData.meta.title.toUpperCase()}</h1>
      <p style="margin:0;">TARGET: ${caseData.meta.victim.name.toUpperCase()} (${caseData.meta.victim.role.toUpperCase()})</p>
    `;
  }
}

function renderCaseBriefingView() {
  const briefingContainer = document.getElementById('view-briefing');
  if (!briefingContainer || typeof window.CASE_DATA === 'undefined') return;

  if (window.CASE_DATA.meta && window.CASE_DATA.meta.briefingHtml) {
    briefingContainer.innerHTML = `<div style="max-width:960px; margin:0 auto; padding:10px; font-family:var(--font-mono);">${window.CASE_DATA.meta.briefingHtml}</div>`;
  }
}

function switchCaseView(viewId, clickedBtn) {
  document.querySelectorAll('.game-view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.game-nav .nav-btn').forEach(b => b.classList.remove('active'));

  const activeView = document.getElementById(`view-${viewId}`);
  if (activeView) activeView.classList.add('active');
  if (clickedBtn) clickedBtn.classList.add('active');

  if (window.audioEngine) window.audioEngine.playClick();

  if (viewId === 'case-board' && window.caseBoard) {
    window.caseBoard.syncEvidenceNodes();
    window.caseBoard.initResize();
  } else if (viewId === 'floor-plan' && window.floorPlan) {
    window.floorPlan.initResize();
  } else if (viewId === 'interrogation' && window.interrogationEngine) {
    window.interrogationEngine.render();
  } else if (viewId === 'timeline' && window.timelineMatrix) {
    window.timelineMatrix.render();
  } else if (viewId === 'forensic-lab' && window.forensicLab) {
    window.forensicLab.render();
  } else if (viewId === 'prosecution' && window.prosecutionEngine) {
    window.prosecutionEngine.render();
  } else if (viewId === 'dci-mail' && window.dciMail) {
    window.dciMail.renderMailbox('view-dci-mail-container');
  }
}

function updateCaseHeaderUI(state) {
  const timeElem = document.getElementById('time-value');
  const budgetElem = document.getElementById('budget-value');
  
  if (timeElem) timeElem.textContent = `${state.timeRemaining}h 00m`;
  if (budgetElem) budgetElem.textContent = `$${state.budget}`;
}

function renderCaseSuspectCards() {
  const grid = document.getElementById('suspects-grid-container');
  if (!grid || typeof window.CASE_DATA === 'undefined') return;

  grid.innerHTML = window.CASE_DATA.suspects.map(suspect => `
    <div class="suspect-card" onclick="openSuspectInterrogation('${suspect.id}')">
      <div class="suspect-header">
        <div class="suspect-mugshot">👤</div>
        <div class="suspect-meta">
          <h3>${suspect.name}</h3>
          <p>${suspect.role}</p>
        </div>
      </div>

      <div class="suspect-status-pills">
        <span class="badge ${suspect.lawyer ? 'red' : 'blue'}">${suspect.lawyer ? 'ATTORNEY PRESENT' : 'COOPERATING'}</span>
        <span class="badge amber">SUSPECT</span>
      </div>

      <p style="font-size:0.75rem; color:var(--text-secondary); margin-top:10px; line-height:1.4;">
        ${suspect.summary}
      </p>

      <div class="suspect-gauges">
        <div class="gauge-item">
          CONFIDENCE: ${suspect.gauges.confidence}%
          <div class="gauge-bar"><div class="gauge-fill" style="width:${suspect.gauges.confidence}%;"></div></div>
        </div>
        <div class="gauge-item">
          STRESS: ${suspect.gauges.stress}%
          <div class="gauge-bar"><div class="gauge-fill" style="width:${suspect.gauges.stress}%; background:var(--accent-red);"></div></div>
        </div>
      </div>
    </div>
  `).join('');
}

function openSuspectInterrogation(suspectId) {
  const navBtn = document.querySelector(`.game-nav .nav-btn[data-view="interrogation"]`);
  switchCaseView("interrogation", navBtn);
  if (window.interrogationEngine) {
    window.interrogationEngine.setSuspect(suspectId);
  }
}

function renderCaseEvidenceLocker(filterCat = "ALL") {
  const grid = document.getElementById('evidence-grid-container');
  if (!grid || typeof window.CASE_DATA === 'undefined') return;

  const discoveredIds = (window.gameEngine && window.gameEngine.state) ? window.gameEngine.state.discoveredEvidence : [];
  const discoveredItems = window.CASE_DATA.evidenceCatalog.filter(e => discoveredIds.includes(e.id));
  const filtered = filterCat === "ALL" ? discoveredItems : discoveredItems.filter(e => e.category === filterCat);

  grid.innerHTML = filtered.map(ev => `
    <div class="evidence-card">
      <div class="evidence-card-header">
        <span class="badge red">${ev.category}</span>
        <span style="font-size:0.7rem; color:var(--text-muted); font-weight:bold;">${ev.id}</span>
      </div>
      <div class="evidence-title">${ev.name}</div>
      <div class="evidence-desc">${ev.description}</div>
      <div style="font-size:0.75rem; color:var(--accent-amber); margin-top:4px;">${ev.details}</div>
      <div class="evidence-footer">
        <span>Location: ${ev.location}</span>
        <span class="badge blue">RELIABILITY: CLASS ${ev.reliability}</span>
      </div>
    </div>
  `).join('');
}

function exitCaseToHQ() {
  document.getElementById('case-game-overlay').style.display = 'none';
  document.getElementById('hq-dashboard-view').style.display = 'block';
}
