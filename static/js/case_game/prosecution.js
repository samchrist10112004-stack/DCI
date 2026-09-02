// OPERATION BLACKWOOD & ST. JUDE'S ACADEMY: DYNAMIC PROSECUTION & RESOLUTION SCORING ENGINE

class ProsecutionEngine {
  constructor() {}

  render() {
    const container = document.getElementById('prosecution-form-container');
    if (!container) return;

    const isCase2 = (window.ACTIVE_CASE_ID === 'CASE-DCI-002');

    if (isCase2) {
      this.renderCase2Form(container);
    } else {
      this.renderCase1Form(container);
    }
  }

  renderCase1Form(container) {
    const caseData = window.CASE_DATA_001 || window.CASE_DATA;
    container.innerHTML = `
      <form id="prosecution-form" onsubmit="prosecutionEngine.submitCase1Prosecution(event)">
        <div class="prosecution-warning-box">
          <strong>WARNING: OFFICIAL INDICTMENT SUBMISSION — OPERATION BLACKWOOD</strong><br>
          Submitting this filing will formally issue arrest warrants and send the case to trial. Ensure your theory is backed by verified physical, digital, and timeline evidence. Wasting indictment powers on an innocent suspect will collapse the case!
        </div>

        <div class="form-grid-2" style="margin-top:16px;">
          <div class="form-group">
            <label>[1] ACCUSED PRIMARY KILLER</label>
            <select id="p-killer" required>
              <option value="">-- SELECT PRIMARY SUSPECT --</option>
              ${caseData.suspects.map(s => `<option value="${s.id}">${s.name} (${s.role})</option>`).join('')}
            </select>
          </div>

          <div class="form-group">
            <label>[2] ACCUSED ACCOMPLICE</label>
            <select id="p-accomplice" required>
              <option value="none">NO ACCOMPLICE</option>
              ${caseData.suspects.map(s => `<option value="${s.id}">${s.name} (${s.role})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-grid-2" style="margin-top:16px;">
          <div class="form-group">
            <label>[3] LETHAL MURDER METHOD</label>
            <select id="p-method" required>
              <option value="">-- SELECT MURDER METHOD --</option>
              <option value="pen_toxin">Synthetic Neurotoxin in Fountain Pen Cartridge</option>
              <option value="syringe_insulin">Overdose via Syringe Injection</option>
              <option value="suffocation">Manual Suffocation with Pillow</option>
              <option value="strychnine_coffee">Strychnine Poisoning in Coffee</option>
            </select>
          </div>

          <div class="form-group">
            <label>[4] ESTIMATED TIME OF DEATH</label>
            <select id="p-tod" required>
              <option value="">-- SELECT TOD WINDOW --</option>
              <option value="early">20:30 - 20:50</option>
              <option value="target">21:10 - 21:20 (Critical Window)</option>
              <option value="late">21:30 - 22:00</option>
            </select>
          </div>
        </div>

        <div class="form-grid-2" style="margin-top:16px;">
          <div class="form-group">
            <label>[5] IDENTIFIED PLANTED EVIDENCE</label>
            <select id="p-planted" required>
              <option value="">-- SELECT PLANTED EVIDENCE --</option>
              <option value="syringe_handkerchief">Medical Syringe (EVD-03) & Monogrammed Handkerchief (EVD-04)</option>
              <option value="pen">Montblanc Fountain Pen (EVD-01)</option>
              <option value="tape">Audio Recorder (EVD-07)</option>
            </select>
          </div>

          <div class="form-group">
            <label>[6] FALSE CONFESSION ASSESSMENT</label>
            <select id="p-confession" required>
              <option value="">-- ASSESS GABRIEL'S CONFESSION --</option>
              <option value="false_protective">FALSE CONFESSION (Protecting Evelyn Reed)</option>
              <option value="true_killer">GENUINE CONFESSION (Gabriel is Solitary Killer)</option>
              <option value="coerced">POLICE COERCION</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top:16px;">
          <label>[7] PROSECUTION THEORY SUMMARY & CONSPIRACY RECONSTRUCTION</label>
          <textarea id="p-theory" rows="4" placeholder="Detail how the killer gained access, why CCTV failed, and how the evidence chain proves guilt beyond reasonable doubt..." required></textarea>
        </div>

        <div style="margin-top:24px; text-align:right;">
          <button type="submit" class="btn-dci primary" style="padding:12px 24px; font-size:0.95rem;">SUBMIT INDICTMENT & ISSUE ARREST WARRANTS</button>
        </div>
      </form>
    `;
  }

  renderCase2Form(container) {
    const caseData = window.CASE_DATA_002 || window.CASE_DATA;
    container.innerHTML = `
      <form id="prosecution-form" onsubmit="prosecutionEngine.submitCase2Prosecution(event)">
        <div class="prosecution-warning-box" style="background:rgba(6,182,212,0.1); border-color:var(--accent-cyan); color:var(--text-primary);">
          <strong style="color:var(--accent-cyan);">OFFICIAL FINDINGS SUBMISSION — ST. JUDE'S ACADEMY DISAPPEARANCE</strong><br>
          Submit your final investigation report detailing what happened to Dr. Adrian Vale, how he exited the administrative wing during midnight lockdown, and which institutional conspiracy triggered his disappearance.
        </div>

        <div class="form-grid-2" style="margin-top:16px;">
          <div class="form-group">
            <label>[1] DISAPPEARANCE CLASSIFICATION</label>
            <select id="p2-type" required>
              <option value="">-- SELECT CLASSIFICATION --</option>
              <option value="voluntary_staged">VOLUNTARY STAGED DISAPPEARANCE (Exposing Endowment Fraud)</option>
              <option value="forced_abduction">FORCED ABDUCTION BY STAFF CONSPIRACY</option>
              <option value="voluntary_flight">VOLUNTARY FLIGHT FROM DEBT</option>
              <option value="homicide_concealed">CONCEALED HOMICIDE</option>
            </select>
          </div>

          <div class="form-group">
            <label>[2] PRIMARY ASSISTING ACCOMPLICE</label>
            <select id="p2-accomplice" required>
              <option value="">-- SELECT ACCOMPLICE --</option>
              ${caseData.suspects.map(s => `<option value="${s.id}">${s.name} (${s.role})</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-grid-2" style="margin-top:16px;">
          <div class="form-group">
            <label>[3] EXFILTRATION ROUTE FROM ADMIN WING</label>
            <select id="p2-route" required>
              <option value="">-- SELECT MOVEMENT ROUTE --</option>
              <option value="underground_tunnel">Chapel Underground Utility Tunnel -> Science Block</option>
              <option value="main_gate">Main Gate (Bribery)</option>
              <option value="rear_gate">Rear Service Gate</option>
              <option value="window_jump">Study Window to Courtyard</option>
            </select>
          </div>

          <div class="form-group">
            <label>[4] CRITICAL DIGITAL EVIDENCE IDENTIFIED</label>
            <select id="p2-digital" required>
              <option value="">-- SELECT CRITICAL DIGITAL PROOF --</option>
              <option value="ipad_wifi">Secondary iPad MAC Telemetry on Science Block Wi-Fi (23:53)</option>
              <option value="phone_call">Incoming Call from Victoria Harcourt (23:16)</option>
              <option value="deleted_draft">Encrypted Cloud Email Draft</option>
            </select>
          </div>
        </div>

        <div class="form-grid-2" style="margin-top:16px;">
          <div class="form-group">
            <label>[5] REASON FOR MIDNIGHT LOCKDOWN DRILL</label>
            <select id="p2-lockdown" required>
              <option value="">-- SELECT LOCKDOWN REASON --</option>
              <option value="preplanned_cover">Dr. Vale's Cover to Access Tunnel & Upload Audit Evidence</option>
              <option value="routine_drill">Routine Security Drill</option>
              <option value="security_threat">Perimeter Security Threat</option>
            </select>
          </div>

          <div class="form-group">
            <label>[6] INSTITUTIONAL MOTIVE UNCOVERED</label>
            <select id="p2-motive" required>
              <option value="">-- SELECT INSTITUTIONAL MOTIVE --</option>
              <option value="endowment_embezzlement">$350,000 Endowment Embezzlement by Trustee Harcourt</option>
              <option value="stolen_charter">Stolen 18th-Century Academy Charter</option>
              <option value="prescription_racket">Illegal Infirmary Prescription Racket</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top:16px;">
          <label>[7] DISAPPEARANCE RECONSTRUCTION & TIMELINE SUMMARY</label>
          <textarea id="p2-theory" rows="4" placeholder="Detail how Dr. Vale exited his study during lockdown, why the CCTV outage occurred, and how the evidence proves your findings..." required></textarea>
        </div>

        <div style="margin-top:24px; text-align:right;">
          <button type="submit" class="btn-dci primary" style="padding:12px 24px; font-size:0.95rem; background:var(--accent-blue); border-color:var(--accent-blue);">SUBMIT CASE 002 INVESTIGATION FINDINGS</button>
        </div>
      </form>
    `;
  }

  submitCase1Prosecution(e) {
    e.preventDefault();
    if (window.audioEngine) window.audioEngine.playStamp();

    const killer = document.getElementById('p-killer').value;
    const accomplice = document.getElementById('p-accomplice').value;
    const method = document.getElementById('p-method').value;
    const tod = document.getElementById('p-tod').value;
    const planted = document.getElementById('p-planted').value;
    const confession = document.getElementById('p-confession').value;

    let score = 0;
    const breakdown = [];

    if (killer === "vance") {
      score += 10;
      breakdown.push("+10 Correct Mastermind Killer (Marcus Vance)");
    } else {
      score -= 10;
      breakdown.push("-10 Accused Innocent Suspect!");
    }

    if (accomplice === "gabriel") {
      score += 10;
      breakdown.push("+10 Correct Secret Accomplice (Gabriel Moreau)");
    }

    if (method === "pen_toxin") {
      score += 10;
      breakdown.push("+10 Correct Murder Method (Neurotoxin Pen Cartridge)");
    }

    if (tod === "target") {
      score += 10;
      breakdown.push("+10 Correct Time of Death Window (21:10 - 21:20)");
    }

    if (planted === "syringe_handkerchief") {
      score += 10;
      breakdown.push("+10 Correctly Identified Planted Clues (Syringe & Handkerchief)");
    }

    if (confession === "false_protective") {
      score += 10;
      breakdown.push("+10 Correctly Identified False Confession Trap");
    }

    const evCount = (window.gameEngine && window.gameEngine.state) ? window.gameEngine.state.discoveredEvidence.length : 4;
    const evScore = Math.min(40, evCount * 4);
    score += evScore;
    breakdown.push(`+${evScore} Complete Evidence Chain (${evCount} Clues Recovered)`);

    if (score >= 60 && window.dciApi) {
      const endingName = score >= 90 ? "Ending 1: Perfect Prosecution (Master Investigator)" : "Ending 2: Correct Killer Convicted";
      const xpEarned = Math.floor(score * 15);
      window.dciApi.recordSolvedCase("CASE-DCI-001", score, endingName, xpEarned);
    }

    this.showVerdictModal(score, breakdown, killer, accomplice);
  }

  submitCase2Prosecution(e) {
    e.preventDefault();
    if (window.audioEngine) window.audioEngine.playStamp();

    const type = document.getElementById('p2-type').value;
    const accomplice = document.getElementById('p2-accomplice').value;
    const route = document.getElementById('p2-route').value;
    const digital = document.getElementById('p2-digital').value;
    const lockdown = document.getElementById('p2-lockdown').value;
    const motive = document.getElementById('p2-motive').value;

    let score = 0;
    const breakdown = [];

    if (type === "voluntary_staged") {
      score += 10;
      breakdown.push("+10 Correct Disappearance Classification (Voluntary Staged Disappearance)");
    } else {
      score -= 10;
      breakdown.push("-10 Incorrect Disappearance Classification!");
    }

    if (accomplice === "bell") {
      score += 10;
      breakdown.push("+10 Correct Subterranean Tunnel Accomplice (Thomas Bell)");
    }

    if (route === "underground_tunnel") {
      score += 10;
      breakdown.push("+10 Correct Exfiltration Route (Chapel Underground Utility Corridor)");
    }

    if (digital === "ipad_wifi") {
      score += 10;
      breakdown.push("+10 Correct Critical Digital Clue (Secondary iPad MAC Telemetry at 23:53)");
    }

    if (lockdown === "preplanned_cover") {
      score += 10;
      breakdown.push("+10 Correct Lockdown Purpose (Dr. Vale's Cover Strategy)");
    }

    if (motive === "endowment_embezzlement") {
      score += 10;
      breakdown.push("+10 Correct Institutional Motive ($350k Endowment Embezzlement)");
    }

    const evCount = (window.gameEngine && window.gameEngine.state) ? window.gameEngine.state.discoveredEvidence.length : 4;
    const evScore = Math.min(40, evCount * 4);
    score += evScore;
    breakdown.push(`+${evScore} Complete Evidence Chain (${evCount} Clues Recovered)`);

    if (score >= 60 && window.dciApi) {
      const endingName = score >= 90 ? "Ending 1: St. Jude's Fraud Exposed (Master Reconstruction)" : "Ending 2: Headmaster Disappearance Solved";
      const xpEarned = Math.floor(score * 15);
      window.dciApi.recordSolvedCase("CASE-DCI-002", score, endingName, xpEarned);
    }

    this.showCase2VerdictModal(score, breakdown, type);
  }

  showVerdictModal(score, breakdown, killer, accomplice) {
    let endingTitle = "";
    let endingText = "";
    const isSuccess = (score >= 60 && killer === "vance");

    if (score >= 90 && killer === "vance" && accomplice === "gabriel") {
      endingTitle = "ENDING 1: PERFECT PROSECUTION (MASTER INVESTIGATOR)";
      endingText = `Your master prosecution document dismantled Marcus Vance's legal team. CCTV Camera 3 drift (+4m) exposed Vance's alibi. Valet Moreau confessed to swapping the pen cartridge under Vance's orders. Lord Arthur's murder, the espionage theft by Evelyn Reed, and the financial fraud of Sterling & Victoria were all brought to justice!`;
    } else if (killer === "vance") {
      endingTitle = "ENDING 2: CORRECT KILLER, PARTIAL CONSPIRACY UNRAVELED";
      endingText = `Marcus Vance was convicted of murder, but due to gaps in your evidence chain regarding Gabriel Moreau and the security outage, key co-conspirators escaped prosecution. Score: ${score}/100.`;
    } else {
      endingTitle = "ENDING 7: WRONGFUL ARREST & PUBLIC SCANDAL";
      endingText = `Your indictment failed to establish proof beyond a reasonable doubt. The accused suspect was acquitted, causing a high-profile political scandal. You have been relieved of investigative duties! Score: ${score}/100.`;
    }

    const modal = document.getElementById('verdict-modal');
    const modalBody = document.getElementById('verdict-modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div style="text-align:center; margin-bottom:16px;">
        <span class="classified-stamp" style="font-size:1.4rem;">FINAL PROSECUTION VERDICT</span>
        <h2 style="color:var(--accent-amber); margin-top:10px;">SCORE: ${score} / 100</h2>
      </div>

      <h3 style="color:#fff; border-bottom:1px solid var(--border-color); padding-bottom:6px;">${endingTitle}</h3>
      <p style="color:var(--text-secondary); margin-top:10px; line-height:1.5;">${endingText}</p>

      <div style="margin-top:16px; background:#090d16; padding:12px; border:1px solid var(--border-color); border-radius:4px;">
        <h4 style="color:var(--accent-blue); font-size:0.8rem; margin-bottom:6px;">SCORING BREAKDOWN:</h4>
        <ul style="font-size:0.75rem; color:var(--text-muted); padding-left:18px;">
          ${breakdown.map(b => `<li style="margin-bottom:3px;">${b}</li>`).join('')}
        </ul>
      </div>

      ${isSuccess ? `
        <div style="margin-top:20px; text-align:center;">
          <button class="btn-dci primary" style="font-size:0.85rem; padding:10px 18px;" onclick="prosecutionEngine.showCourtOrderModal(${score})">
            📜 VIEW OFFICIAL HIGH COURT CONVICTION ORDER
          </button>
        </div>
      ` : ''}
    `;

    modal.classList.add('active');
  }

  showCase2VerdictModal(score, breakdown, type) {
    let endingTitle = "";
    let endingText = "";
    const isSuccess = (score >= 60 && type === "voluntary_staged");

    if (score >= 90 && type === "voluntary_staged") {
      endingTitle = "ENDING 1: ST. JUDE'S FRAUD EXPOSED (MASTER RECONSTRUCTION)";
      endingText = `Your investigation proved Dr. Adrian Vale was not abducted! He staged his disappearance during the lockdown drill to safely upload 45MB of audit proof exposing Board Trustee Victoria Harcourt's $350,000 embezzlement. Maintenance Supervisor Thomas Bell unlocked the Victorian utility corridor, enabling Vale to reach the Science Block Wi-Fi at 23:53 and escape safely. Trustee Harcourt was arrested, and Dr. Vale was exonerated!`;
    } else if (type === "voluntary_staged") {
      endingTitle = "ENDING 2: HEADMASTER LOCATION RESOLVED";
      endingText = `You correctly proved Dr. Vale staged his exit to expose institutional corruption, but gaps in your digital telemetry reconstruction left key board co-conspirators unindicted. Score: ${score}/100.`;
    } else {
      endingTitle = "ENDING 4: INCORRECT ABDUCTION THEORY (CASE FAILURE)";
      endingText = `Your report misclassified the disappearance as a forced abduction. While police searched for imaginary kidnappers, Trustee Harcourt erased the audit logs. Score: ${score}/100.`;
    }

    const modal = document.getElementById('verdict-modal');
    const modalBody = document.getElementById('verdict-modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div style="text-align:center; margin-bottom:16px;">
        <span class="classified-stamp" style="font-size:1.4rem; color:var(--accent-cyan); border-color:var(--accent-cyan);">CASE 002 INVESTIGATION RESOLUTION</span>
        <h2 style="color:var(--accent-amber); margin-top:10px;">SCORE: ${score} / 100</h2>
      </div>

      <h3 style="color:#fff; border-bottom:1px solid var(--border-color); padding-bottom:6px;">${endingTitle}</h3>
      <p style="color:var(--text-secondary); margin-top:10px; line-height:1.5;">${endingText}</p>

      <div style="margin-top:16px; background:#090d16; padding:12px; border:1px solid var(--border-color); border-radius:4px;">
        <h4 style="color:var(--accent-cyan); font-size:0.8rem; margin-bottom:6px;">SCORING BREAKDOWN:</h4>
        <ul style="font-size:0.75rem; color:var(--text-muted); padding-left:18px;">
          ${breakdown.map(b => `<li style="margin-bottom:3px;">${b}</li>`).join('')}
        </ul>
      </div>

      ${isSuccess ? `
        <div style="margin-top:20px; text-align:center;">
          <button class="btn-dci primary" style="font-size:0.85rem; padding:10px 18px; background:var(--accent-cyan); border-color:var(--accent-cyan);" onclick="prosecutionEngine.returnToHqWithSolvedStatus()">
            🏛️ RETURN TO DCI HQ COMMAND CENTER
          </button>
        </div>
      ` : ''}
    `;

    modal.classList.add('active');
  }

  showCourtOrderModal(score) {
    const modal = document.getElementById('modal-court-order');
    const body = document.getElementById('court-order-body');
    if (!modal || !body) return;

    const currentDet = (window.dciApi && typeof window.dciApi.getProfile === 'function')
      ? JSON.parse(localStorage.getItem("dci_current_user") || "{}")
      : { callsign: "RAVEN-17", detective_id: "DCI-26-884912" };

    body.innerHTML = `
      <div style="background:#090e1a; border:2px solid var(--accent-amber); border-radius:8px; padding:24px; font-family:var(--font-mono); color:#fff; position:relative; overflow:hidden; box-shadow:0 15px 40px rgba(0,0,0,0.9);">
        
        <div style="text-align:center; border-bottom:2px double var(--accent-amber); padding-bottom:14px; margin-bottom:18px;">
          <div style="font-size:0.7rem; color:var(--text-muted); letter-spacing:2px;">IN THE HIGH COURT OF JUSTICE — CROWN PROSECUTION SERVICE</div>
          <h2 style="color:var(--accent-amber); font-size:1.3rem; margin-top:4px;">OFFICIAL JUDICIAL WARRANT & CONVICTION ORDER</h2>
          <div style="font-size:0.75rem; color:var(--accent-red); margin-top:4px;">CASE REF: CR-2026-884-BLACKWOOD // DIRECTORATE ARCHIVES</div>
        </div>

        <div style="font-size:0.82rem; line-height:1.6; color:#e2e8f0; margin-bottom:20px;">
          <p style="margin-bottom:10px;">
            <strong>TO THE DIRECTORATE OF CRIMINAL INVESTIGATION & HER MAJESTY'S PRISON SERVICE:</strong>
          </p>
          <p style="margin-bottom:10px;">
            WHEREAS, Lead Investigator <strong>Detective ${currentDet.callsign || 'RAVEN-17'}</strong> (Badge ID: <strong>${currentDet.detective_id || 'DCI-26-884912'}</strong>) did present a prosecution indictment and evidence chain regarding the homicide of <strong>LORD ARTHUR PENDELTON</strong>;
          </p>
          <p style="margin-bottom:10px;">
            AND WHEREAS, the High Court of Justice has examined the verified physical evidence, including the neurotoxin nib cartridge (EVD-01), the CCTV clock desynchronization log (+4m drift) (EVD-02), and the extracted digital communications;
          </p>
          <p style="font-size:0.88rem; color:var(--accent-green); font-weight:bold; margin-top:14px; border-left:3px solid var(--accent-green); padding-left:10px;">
            IT IS HEREBY ORDERED AND ADJUDGED THAT:
          </p>
          <ol style="margin-left:20px; margin-top:8px; font-size:0.8rem; color:#cbd5e1; line-height:1.5;">
            <li><strong>DEFENDANT MARCUS VANCE</strong> is found <strong>GUILTY</strong> of First-Degree Murder, High Treason, and Industrial Espionage.<br><span style="color:var(--accent-red);">SENTENCE: IMPRISONMENT FOR LIFE WITHOUT PAROLE.</span></li>
            <li style="margin-top:6px;"><strong>DEFENDANT GABRIEL MOREAU</strong> is found <strong>GUILTY</strong> of Conspiracy to Commit Homicide and Evidence Sabotage.<br><span style="color:var(--accent-amber);">SENTENCE: 15 YEARS IMPRISONMENT AT HMP BELMARSH.</span></li>
          </ol>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-color); padding-top:14px;">
          <div>
            <div style="font-size:0.7rem; color:var(--text-muted);">PRESIDING HIGH COURT MAGISTRATE:</div>
            <div style="font-size:0.85rem; color:#fff; font-weight:bold;">Hon. Sir Reginald Vance-Smith, KBE</div>
            <div style="font-size:0.65rem; color:var(--accent-amber);">Lord Chief Justice of England and Wales</div>
          </div>
          <div style="text-align:right;">
            <span class="classified-stamp" style="color:var(--accent-green); border-color:var(--accent-green); font-size:0.85rem;">CONVICTION ORDERED // MAXIMUM SENTENCE</span>
            <div style="font-size:0.7rem; color:var(--accent-green); font-weight:bold; margin-top:4px;">+${score * 15} XP AWARDED TO DETECTIVE RECORD</div>
          </div>
        </div>

        <div style="margin-top:20px; text-align:center;">
          <button class="btn-dci primary" style="padding:10px 24px; font-size:0.9rem;" onclick="prosecutionEngine.returnToHqWithSolvedStatus()">
            🏛️ CLOSE COURT ORDER & RETURN TO DCI HQ
          </button>
        </div>

      </div>
    `;

    modal.classList.add('active');
  }

  returnToHqWithSolvedStatus() {
    const orderModal = document.getElementById('modal-court-order');
    const verdictModal = document.getElementById('verdict-modal');
    if (orderModal) orderModal.classList.remove('active');
    if (verdictModal) verdictModal.classList.remove('active');

    document.getElementById('case-game-overlay').style.display = 'none';
    document.getElementById('hq-dashboard-view').style.display = 'block';

    if (window.currentDetective && window.dciApi) {
      window.dciApi.getProfile().then(p => {
        if (p) {
          window.currentDetective = p;
          showHeadquartersDashboard(p);
        }
      });
    }
  }
}

window.prosecutionEngine = new ProsecutionEngine();
