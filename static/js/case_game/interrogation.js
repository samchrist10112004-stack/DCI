// DCI PLATFORM: DYNAMIC HUMAN-BRAIN PSYCHOLOGICAL INTERROGATION ENGINE

class InterrogationEngine {
  constructor() {
    this.currentSuspectId = null;
    this.history = {};
    this.usedResponses = {};
    this.isThinking = false;
  }

  setSuspect(suspectId) {
    if (this.isThinking) return;
    this.currentSuspectId = suspectId;
    if (!this.history[suspectId]) {
      this.history[suspectId] = [];
    }
    if (!this.usedResponses[suspectId]) {
      this.usedResponses[suspectId] = new Set();
    }
    this.render();
  }

  render() {
    const chatLog = document.getElementById('interrogation-chat-log');
    const optionsContainer = document.getElementById('question-options-list');
    const suspectHeader = document.getElementById('interrogation-suspect-header');
    
    if (!chatLog || !optionsContainer) return;
    if (typeof window.CASE_DATA === 'undefined' || !window.CASE_DATA.suspects) return;

    if (!this.currentSuspectId || !window.CASE_DATA.suspects.some(s => s.id === this.currentSuspectId)) {
      this.currentSuspectId = window.CASE_DATA.suspects[0].id;
    }

    if (!this.history[this.currentSuspectId]) {
      this.history[this.currentSuspectId] = [];
    }
    if (!this.usedResponses[this.currentSuspectId]) {
      this.usedResponses[this.currentSuspectId] = new Set();
    }

    const suspect = window.CASE_DATA.suspects.find(s => s.id === this.currentSuspectId);
    if (!suspect) return;

    // Render Suspect Selector Roster & Psychological Defense Profile
    if (suspectHeader) {
      const stress = suspect.gauges ? suspect.gauges.stress : 50;
      let coopState = "COOPERATING";
      let coopColor = "var(--accent-green)";
      if (stress > 80) { coopState = "PANICKED / CORNERED"; coopColor = "var(--accent-red)"; }
      else if (stress > 50) { coopState = "DEFENSIVE / GUARDED"; coopColor = "var(--accent-amber)"; }
      if (suspect.lawyer) { coopState = "ATTORNEY RESTRICTED"; coopColor = "var(--accent-red)"; }

      suspectHeader.innerHTML = `
        <div style="font-size:0.7rem; color:var(--accent-amber); font-weight:bold; letter-spacing:1px; margin-bottom:8px;">SUSPECT SELECTION ROSTER:</div>
        <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:14px; max-height:180px; overflow-y:auto;">
          ${window.CASE_DATA.suspects.map(s => `
            <button class="btn-dci ${this.currentSuspectId === s.id ? 'primary' : ''}" style="width:100%; justify-content:space-between; font-size:0.75rem; text-align:left; padding:6px 10px;" ${this.isThinking ? 'disabled' : ''} onclick="window.interrogationEngine.setSuspect('${s.id}')">
              <span>👤 ${s.name}</span>
              <span class="badge blue">${s.role.split(' ')[0]}</span>
            </button>
          `).join('')}
        </div>

        <div style="border-top:1px solid var(--border-color); padding-top:10px; font-family:var(--font-mono);">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h4 style="color:#fff; font-size:0.95rem;">${suspect.name}</h4>
            <span class="badge red">${suspect.role}</span>
          </div>

          <div style="margin-top:8px; background:#05080e; border:1px solid var(--border-color); padding:8px; border-radius:4px; font-size:0.72rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-muted);">DEFENSE STATE:</span>
              <span style="color:${coopColor}; font-weight:bold;">${coopState}</span>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="color:var(--text-muted);">STRESS LEVEL:</span>
              <span style="color:var(--accent-red); font-weight:bold;">${stress}%</span>
            </div>
            <div style="height:4px; background:#1e293b; border-radius:2px; overflow-hidden;">
              <div style="height:100%; width:${stress}%; background:${stress > 70 ? 'var(--accent-red)' : 'var(--accent-amber)'};"></div>
            </div>
          </div>
        </div>
      `;
    }

    const logs = this.history[this.currentSuspectId];
    if (logs.length === 0) {
      chatLog.innerHTML = `<div class="chat-msg system">INTERROGATION SESSION INITIALIZED FOR ${suspect.name.toUpperCase()}. RECORDING TRANSCRIPT...</div>`;
    } else {
      chatLog.innerHTML = logs.map(msg => `
        <div class="chat-msg ${msg.type}">
          <div style="font-size:0.65rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase; display:flex; justify-content:space-between;">
            <span>${msg.sender}</span>
            ${msg.isAnomaly ? `<span style="color:var(--accent-red); font-weight:bold;">⚠️ LIE DETECTOR ANOMALY</span>` : ''}
          </div>
          <div style="font-size:0.85rem; line-height:1.4;">${msg.text}</div>
        </div>
      `).join('');
    }

    if (this.isThinking) {
      chatLog.innerHTML += `
        <div class="chat-msg system" id="thinking-indicator-msg" style="color:var(--accent-amber); font-style:italic;">
          ⏳ [${suspect.name.toUpperCase()} HESITATES & CALCULATES RESPONSE... 💬]
        </div>
      `;
    }

    chatLog.scrollTop = chatLog.scrollHeight;
    this.renderQuestions(suspect, optionsContainer);
  }

  renderQuestions(suspect, container) {
    if (suspect.lawyer) {
      container.innerHTML = `
        <div class="chat-msg bluff-warning">
          WARNING: Suspect's legal counsel has instructed them not to answer further direct inquiries. You must rely on forensic laboratory evidence.
        </div>
      `;
      return;
    }

    const prebuiltQuestions = this.generateQuestionsForSuspect(suspect);
    const discoveredIds = (window.gameEngine && window.gameEngine.state) ? window.gameEngine.state.discoveredEvidence : [];
    const evCatalog = typeof window.CASE_DATA !== 'undefined' ? window.CASE_DATA.evidenceCatalog.filter(e => discoveredIds.includes(e.id)) : [];

    container.innerHTML = `
      <!-- CUSTOM FREE-TEXT INTERROGATION LINE INPUT -->
      <div style="background:#05080e; border:1px solid var(--accent-blue); padding:10px; border-radius:6px; margin-bottom:12px;">
        <div style="font-size:0.7rem; color:var(--accent-cyan); font-weight:bold; margin-bottom:6px;">💬 TYPE CUSTOM INTERROGATION QUESTION OR CONFRONTATION:</div>
        <div style="display:flex; gap:8px;">
          <input type="text" id="custom-question-input" placeholder="${this.isThinking ? 'Suspect is responding...' : 'Type custom question or confrontation...'}" ${this.isThinking ? 'disabled' : ''} style="flex:1; background:#0b1120; border:1px solid var(--border-light); color:#fff; padding:8px 12px; border-radius:4px; font-family:var(--font-mono); font-size:0.8rem;" onkeydown="if(event.key==='Enter') window.interrogationEngine.submitCustomQuestion()">
          <select id="custom-evidence-attach" ${this.isThinking ? 'disabled' : ''} style="background:#0b1120; border:1px solid var(--border-light); color:var(--accent-amber); padding:8px; border-radius:4px; font-family:var(--font-mono); font-size:0.75rem;">
            <option value="">-- Attach Evidence --</option>
            ${evCatalog.map(e => `<option value="${e.id}">📎 ${e.name}</option>`).join('')}
          </select>
          <button class="btn-dci primary" ${this.isThinking ? 'disabled' : ''} style="font-size:0.78rem; padding:8px 14px;" onclick="window.interrogationEngine.submitCustomQuestion()">
            ${this.isThinking ? 'THINKING...' : 'ASK QUESTION'}
          </button>
        </div>
      </div>

      <!-- PRE-BUILT TACTICAL INTERROGATION BUTTONS -->
      <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:6px;">TACTICAL INTERROGATION PRESETS:</div>
      <div style="display:flex; flex-direction:column; gap:6px; max-height:140px; overflow-y:auto;">
        ${prebuiltQuestions.map((q, idx) => `
          <button class="q-option-btn ${q.isBluff ? 'bluff' : ''}" ${this.isThinking ? 'disabled' : ''} onclick="window.interrogationEngine.askPrebuiltQuestion(${idx})">
            <span>${q.text}</span>
            <span class="badge ${q.isBluff ? 'amber' : 'blue'}">${q.isBluff ? 'BLUFF' : 'TACTICAL'}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  generateQuestionsForSuspect(suspect) {
    const qList = [];

    qList.push({
      text: `\"State your exact movements during the midnight lockdown drill.\"`,
      type: "timeline",
      isBluff: false,
      response: suspect.publicStory || suspect.alibi || "I was in my assigned area."
    });

    if (suspect.responses && suspect.responses.lockdown) {
      qList.push({
        text: `\"Why was the midnight lockdown drill ordered for tonight?\"`,
        type: "lockdown",
        isBluff: false,
        response: suspect.responses.lockdown
      });
    }

    if (suspect.secret) {
      qList.push({
        text: `\"Are you concealing any private actions or unrecorded meetings from tonight?\"`,
        type: "secret",
        isBluff: false,
        response: `\"I am an honorable professional. I have nothing to hide from the Directorate!\"`
      });
    }

    qList.push({
      text: `[BLUFF TACTIC] \"We recovered your digital log traces matching the critical anomaly. Confess now!\"`,
      type: "bluff_prints",
      isBluff: true
    });

    return qList;
  }

  askPrebuiltQuestion(qIdx) {
    if (this.isThinking) return;

    const suspect = (typeof window.CASE_DATA !== 'undefined' && window.CASE_DATA.suspects)
      ? window.CASE_DATA.suspects.find(s => s.id === this.currentSuspectId)
      : null;
    if (!suspect) return;

    const questions = this.generateQuestionsForSuspect(suspect);
    const q = questions[qIdx];
    if (!q) return;

    this.history[this.currentSuspectId].push({
      sender: "INVESTIGATOR",
      type: "investigator",
      text: q.text
    });

    this.isThinking = true;
    this.render();

    const delay = 1500 + Math.floor(Math.random() * 700);

    setTimeout(() => {
      if (q.isBluff) {
        this.processBluff(suspect, q);
      } else {
        this.history[this.currentSuspectId].push({
          sender: suspect.name.toUpperCase(),
          type: "suspect",
          text: q.response
        });

        if (suspect.gauges) suspect.gauges.stress = Math.min(100, (suspect.gauges.stress || 50) + 5);
      }

      if (window.gameEngine && window.gameEngine.consumeTime) {
        window.gameEngine.consumeTime(1, "Suspect Interrogation (-1 Game Hr)");
      }

      this.isThinking = false;
      this.render();
    }, delay);
  }

  submitCustomQuestion() {
    if (this.isThinking) return;

    const input = document.getElementById('custom-question-input');
    const attachSelect = document.getElementById('custom-evidence-attach');
    if (!input) return;

    const userText = input.value.trim();
    if (!userText) return;

    const attachedEvId = attachSelect ? attachSelect.value : "";
    let attachLabel = "";
    if (attachedEvId && typeof window.CASE_DATA !== 'undefined') {
      const item = window.CASE_DATA.evidenceCatalog.find(e => e.id === attachedEvId);
      if (item) attachLabel = ` [ATTACHED EVIDENCE: ${item.name}]`;
    }

    const suspect = (typeof window.CASE_DATA !== 'undefined' && window.CASE_DATA.suspects)
      ? window.CASE_DATA.suspects.find(s => s.id === this.currentSuspectId)
      : null;
    if (!suspect) return;

    this.history[this.currentSuspectId].push({
      sender: "INVESTIGATOR (CUSTOM LINE)",
      type: "investigator",
      text: `\"${userText}\"${attachLabel}`
    });

    input.value = '';
    this.isThinking = true;
    this.render();

    const delay = 1500 + Math.floor(Math.random() * 700);

    setTimeout(() => {
      const responseData = this.generateBrainResponse(suspect, userText, attachedEvId);
      
      this.history[this.currentSuspectId].push({
        sender: suspect.name.toUpperCase(),
        type: "suspect",
        text: responseData.text,
        isAnomaly: responseData.isAnomaly
      });

      if (suspect.gauges) {
        suspect.gauges.stress = Math.min(100, (suspect.gauges.stress || 50) + responseData.stressIncrease);
      }

      if (window.gameEngine && window.gameEngine.consumeTime) {
        window.gameEngine.consumeTime(1, "Custom Interrogation Inquiry (-1 Game Hr)");
      }
      if (window.audioEngine) window.audioEngine.playClick();

      this.isThinking = false;
      this.render();
    }, delay);
  }

  generateBrainResponse(suspect, userText, attachedEvId) {
    const txt = userText.toLowerCase().trim();
    if (!this.usedResponses[suspect.id]) {
      this.usedResponses[suspect.id] = new Set();
    }
    const used = this.usedResponses[suspect.id];

    let responseText = "";
    let isAnomaly = false;
    let stressIncrease = 5;

    // Check custom suspect responses if available
    if (suspect.responses) {
      if (txt.includes("meeting") && suspect.responses.meeting) {
        return { text: suspect.responses.meeting, isAnomaly: false, stressIncrease: 10 };
      }
      if (txt.includes("lockdown") && suspect.responses.lockdown) {
        return { text: suspect.responses.lockdown, isAnomaly: false, stressIncrease: 8 };
      }
      if (txt.includes("camera") || txt.includes("cctv")) {
        if (suspect.responses.cctv) return { text: suspect.responses.cctv, isAnomaly: false, stressIncrease: 12 };
        if (suspect.responses.confront_camera) return { text: suspect.responses.confront_camera, isAnomaly: true, stressIncrease: 20 };
      }
      if (txt.includes("passage") || txt.includes("tunnel")) {
        if (suspect.responses.passage) return { text: suspect.responses.passage, isAnomaly: false, stressIncrease: 15 };
        if (suspect.responses.confront_passage) return { text: suspect.responses.confront_passage, isAnomaly: true, stressIncrease: 22 };
      }
      if (txt.includes("medication") || txt.includes("drug") || txt.includes("infirmary")) {
        if (suspect.responses.medical) return { text: suspect.responses.medical, isAnomaly: false, stressIncrease: 12 };
        if (suspect.responses.confront_meds) return { text: suspect.responses.confront_meds, isAnomaly: true, stressIncrease: 20 };
      }
    }

    if (txt.includes("hello") || txt.includes("hi") || txt.includes("greeting")) {
      responseText = suspect.responses ? (suspect.responses.greeting || suspect.publicStory) : `\"Hello Detective. I am cooperating fully.\"`;
    } else if (txt.includes("you did it") || txt.includes("guilty") || txt.includes("abducted") || txt.includes("kidnapped")) {
      responseText = `*(Defensive posture)* \"That is a baseless accusation! I had nothing to do with Dr. Vale's disappearance! Show me hard proof!\"`;
      stressIncrease = 18;
      isAnomaly = true;
    } else if (attachedEvId) {
      responseText = `*(Examines attached evidence item ${attachedEvId})* \"I recognize this clue, but it does not prove any wrongdoing on my part, Detective.\"`;
      stressIncrease = 12;
    } else {
      responseText = suspect.publicStory || `\"I have given you my official statement. I was in my designated area during the lockdown.\"`;
    }

    return { text: responseText, isAnomaly, stressIncrease };
  }

  processBluff(suspect, q) {
    const conf = (suspect.gauges && suspect.gauges.confidence !== undefined) ? suspect.gauges.confidence : 60;
    const bluffSuccess = (Math.random() * 100) > conf;

    if (bluffSuccess) {
      this.history[this.currentSuspectId].push({
        sender: suspect.name.toUpperCase(),
        type: "suspect",
        text: `*(Visibly shakes and stammers)* \"Wait... how did you find that?! I... I didn't mean to break protocol! But I know more than I initially let on!\"`,
        isAnomaly: true
      });
      if (suspect.gauges) {
        suspect.gauges.stress = 95;
      }
      if (window.audioEngine) window.audioEngine.playStamp();
    } else {
      this.history[this.currentSuspectId].push({
        sender: "SYSTEM ALERT",
        type: "bluff-warning",
        text: `BLUFF FAILED! ${suspect.name} detected your fabricated bluff. Legal counsel intervened.`
      });
      suspect.lawyer = true;
      if (window.audioEngine) window.audioEngine.playBuzzer();
    }
  }
}

window.interrogationEngine = new InterrogationEngine();
