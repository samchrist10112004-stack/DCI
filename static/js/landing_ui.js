// DIRECTORATE OF CRIMINAL INVESTIGATION (DCI) LANDING UI ENGINE

document.addEventListener('DOMContentLoaded', () => {
  initTerminalTypewriter();
  initCallsignValidator();
  initRanksAccordion();
});

function initTerminalTypewriter() {
  const terminalElem = document.getElementById('terminal-animated-text');
  if (!terminalElem) return;

  const statusMessages = [
    "CONNECTION ESTABLISHED // DCI SECURE NODE 09",
    "ENCRYPTION PROTOCOL: ACTIVE (256-BIT)",
    "INVESTIGATIVE NETWORK: ONLINE",
    "AUTHORIZATION LEVEL 01 REQUIRED"
  ];

  let msgIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentMsg = statusMessages[msgIdx];
    if (isDeleting) {
      terminalElem.textContent = currentMsg.substring(0, charIdx--);
    } else {
      terminalElem.textContent = currentMsg.substring(0, charIdx++);
    }

    let delay = isDeleting ? 30 : 60;
    if (!isDeleting && charIdx === currentMsg.length + 1) {
      delay = 2500;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      msgIdx = (msgIdx + 1) % statusMessages.length;
      delay = 500;
    }

    setTimeout(type, delay);
  }

  type();
}

function initCallsignValidator() {
  const input = document.getElementById('reg-callsign');
  const msgElem = document.getElementById('callsign-status-msg');
  if (!input || !msgElem) return;

  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const val = input.value.trim().toUpperCase();
    input.value = val;

    if (val.length < 3) {
      msgElem.textContent = "Callsign must be at least 3 alphanumeric characters.";
      msgElem.className = "callsign-status-msg";
      return;
    }

    msgElem.textContent = "CHECKING DCI DATABASE REPOSITORY...";
    msgElem.className = "callsign-status-msg";

    timer = setTimeout(async () => {
      const res = await window.dciApi.checkCallsign(val);
      if (res && res.available) {
        msgElem.textContent = "✓ CALLSIGN AVAILABLE. ASSIGNMENT GRANTED.";
        msgElem.className = "callsign-status-msg available";
      } else {
        msgElem.textContent = "✖ CALLSIGN ALREADY ASSIGNED TO ANOTHER DETECTIVE.";
        msgElem.className = "callsign-status-msg taken";
      }
    }, 300);
  });
}

function initRanksAccordion() {
  const ranksContainer = document.getElementById('ranks-accordion-container');
  if (!ranksContainer) return;

  const ranksData = [
    { rank: "CADET DETECTIVE", level: 1, xp: "0 XP", unlocks: "Basic evidence collection, Witness interviews, Crime-scene inspection" },
    { rank: "JUNIOR INVESTIGATOR", level: 2, xp: "1,000 XP", unlocks: "Digital records extraction, Basic forensic laboratory requests, Expanded suspect interviews" },
    { rank: "INVESTIGATING OFFICER", level: 3, xp: "3,000 XP", unlocks: "Financial wire audit records, Advanced interrogation tactics, CCTV timeline analysis" },
    { rank: "SENIOR DETECTIVE", level: 4, xp: "7,500 XP", unlocks: "Advanced forensic spectrometry, Multi-suspect conspiracy analysis, Mobile cell-tower pings" },
    { rank: "LEAD INVESTIGATOR", level: 5, xp: "15,000 XP", unlocks: "High-profile case management, Evidence reconstruction simulator, Shared investigation team rooms" },
    { rank: "SPECIAL INVESTIGATIONS OFFICER", level: 6, xp: "30,000 XP", unlocks: "Restricted intelligence files, Deep-state document decryptors, Wiretap authority" },
    { rank: "CHIEF INVESTIGATOR", level: 7, xp: "60,000 XP", unlocks: "Top Secret black cases, Tactical subpoena authority, Direct forensic priority" },
    { rank: "DIRECTOR OF INVESTIGATIONS", level: 8, xp: "120,000 XP", unlocks: "Unlimited clearance (L-08 BLACK), Agency oversight, Command of all classified operations" }
  ];

  ranksContainer.innerHTML = ranksData.map(r => `
    <div class="rank-item">
      <div class="rank-left">
        <div class="rank-badge-box">L-0${r.level}</div>
        <div class="rank-name">
          <h4>${r.rank}</h4>
          <p>Unlocks: ${r.unlocks}</p>
        </div>
      </div>
      <div class="rank-right">
        <span class="badge amber">REQ: ${r.xp}</span>
        <span class="badge blue">CLEARANCE L-0${r.level}</span>
      </div>
    </div>
  `).join('');
}
