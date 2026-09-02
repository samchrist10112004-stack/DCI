// DCI ORGANIZATIONAL MAILBOX DATASET & COMMUNICATION ARCHITECTURE
// CONTAINS GAMEPLAY-RELEVANT COMMUNICATIONS, CONTRADICTIONS, ATTACHMENTS & EVENT TRIGGERS

window.DCI_MAIL_DATA = {
  // 1. INITIAL CASE COMMUNICATIONS FOR CASE 001 (OPERATION BLACKWOOD)
  "CASE-DCI-001": [
    {
      id: "MSG-101",
      threadId: "TH-101",
      caseId: "CASE-DCI-001",
      sender: "Directorate Command",
      senderAddress: "director@dci.internal",
      senderDept: "Directorate Executive Office",
      recipient: "Current Lead Investigator",
      recipientAddress: "investigator@dci.internal",
      subject: "DIRECTIVE — CASE #DCI-26-001: Operation Blackwood Homicide",
      timestamp: "Today, 08:15",
      gameTime: 72,
      priority: "HIGH",
      clearanceRequired: 1,
      isRead: false,
      isStarred: true,
      category: "inbox",
      tag: "evidence",
      notes: "",
      body: `Investigator,

You are hereby assigned as Lead Officer on CASE #DCI-26-001 (The Homicide of Lord Arthur Pendelton, Minister of Defence Logistics).

The crime occurred inside a locked estate study at Blackwood Manor, Oxfordshire. The victim collapsed at 21:14 following a private cabinet dinner.

OPERATIONAL RESTRICTIONS:
1. Maintain strict security protocols regarding Defence Logistics Procurement files.
2. The suspect roster includes high-ranking Ministry official Marcus Vance and Board Trustee Lady Victoria Pendelton. Ensure all evidence collection is legally sound.
3. Your forensic budget is capped at $5,000. All testing must be routed through the Forensic Sciences Division.

Complete the timeline matrix and submit a 6-point indictment before the 72-hour investigation deadline expires.

Director V. Harrison
Directorate of Criminal Investigation`,
      attachment: {
        id: "ATT-101",
        fileName: "DCI_DIRECTIVE_BLACKWOOD_RESTRICTED.pdf",
        fileType: "PDF Document",
        fileSize: "1.4 MB",
        contentHtml: `
          <div style="font-family:var(--font-mono); color:#fff; padding:20px; background:#070b14; border:1px solid var(--accent-red);">
            <div style="text-align:center; border-bottom:2px double var(--accent-red); padding-bottom:12px; margin-bottom:16px;">
              <span class="classified-stamp" style="font-size:1.2rem;">DCI DIRECTIVE // TOP SECRET</span>
              <h2 style="color:var(--accent-amber); margin-top:6px;">EXECUTIVE INCIDENT SUMMARY: BLACKWOOD MANOR</h2>
            </div>
            <p><strong>VICTIM:</strong> Lord Arthur Pendelton (Age 58)</p>
            <p><strong>CAUSE OF DEATH:</strong> Acute Organophosphate Toxin Collapse</p>
            <p><strong>ESTIMATED TOD:</strong> 21:10 - 21:25</p>
            <p><strong>PRIMARY CONSPIRACY THREADS:</strong></p>
            <ul>
              <li><strong>Thread A:</strong> Defence procurement contract veto (Marcus Vance).</li>
              <li><strong>Thread B:</strong> Whistleblower document extraction (Evelyn Reed / Helena Rostova).</li>
              <li><strong>Thread C:</strong> Offshore slush fund embezzlement (Inspector Sterling & Lady Victoria).</li>
            </ul>
          </div>
        `
      }
    },
    {
      id: "MSG-102",
      threadId: "TH-102",
      caseId: "CASE-DCI-001",
      sender: "Forensic Sciences Division",
      senderAddress: "forensics@dci.internal",
      senderDept: "Forensic Sciences Division",
      recipient: "Lead Investigator",
      recipientAddress: "investigator@dci.internal",
      subject: "Preliminary Toxicology & Nib Micro-Puncture Report — Evidence #EVD-01",
      timestamp: "Today, 09:30",
      gameTime: 70,
      priority: "HIGH",
      clearanceRequired: 1,
      isRead: false,
      isStarred: false,
      category: "inbox",
      tag: "evidence",
      notes: "Ink cartridge contained VX-Derivative-9 neurotoxin.",
      body: `Investigator,

The preliminary laboratory analysis of the recovered Montblanc Meisterstück fountain pen (Evidence #EVD-01) is complete.

SUMMARY OF FINDINGS:
1. The standard black ink cartridge was emptied and refilled with a synthetic organophosphate neurotoxin identified as 'VX-Derivative-9'.
2. Micro-puncture testing on the nib grip confirms the toxin was delivered transdermally into the victim's right thumb when he signed the procurement document at approximately 21:12.
3. Full chromatography spectrum report attached.

Dr. Aris Thorne
Head of Chemical Forensics`,
      attachment: {
        id: "ATT-102",
        fileName: "FORENSICS_BLACKWOOD_TOXICOLOGY.pdf",
        fileType: "PDF Report",
        fileSize: "2.8 MB",
        contentHtml: `
          <div style="font-family:var(--font-mono); color:#fff; padding:20px; background:#070b14; border:1px solid var(--accent-amber);">
            <div style="border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:14px;">
              <span class="badge red">FORENSIC LAB REPORT #884-TOX</span>
              <h3 style="color:var(--accent-amber); margin-top:4px;">CHEMICAL & MASS SPECTROMETRY ANALYSIS</h3>
            </div>
            <p><strong>SAMPLE:</strong> Nib Ink & Cartridge Foil (EVD-01 / EVD-09)</p>
            <p><strong>TOXIN CLASSIFICATION:</strong> Organophosphate Neurotoxin (VX-Derivative-9)</p>
            <p><strong>LATENT PRINTS DETECTED:</strong> Primary prints match Gabriel Moreau (Valet). Partial secondary print matches Marcus Vance.</p>
            <p><strong>CONCLUSION:</strong> Toxin package was loaded into pen stationery kit prior to 21:00.</p>
          </div>
        `
      }
    },
    {
      id: "MSG-103",
      threadId: "TH-103",
      caseId: "CASE-DCI-001",
      sender: "Cyber Investigation Unit",
      senderAddress: "cyber@dci.internal",
      senderDept: "Cyber Investigation Unit",
      recipient: "Lead Investigator",
      recipientAddress: "investigator@dci.internal",
      subject: "CCTV Clock Audit & Desynchronization Discovery — Camera 3",
      timestamp: "Today, 11:15",
      gameTime: 68,
      priority: "CRITICAL",
      clearanceRequired: 2,
      isRead: false,
      isStarred: true,
      category: "inbox",
      tag: "contradiction",
      notes: "Camera 3 internal clock is fast by +4m 12s!",
      body: `Investigator,

Our digital telemetry team conducted an audit of the Blackwood Manor CCTV server logs (Evidence #EVD-02).

CRITICAL CONTRADICTION DISCOVERED:
Camera 3 (Conservatory Corridor) internal system clock was desynchronized by exactly +4 minutes and 12 seconds faster than absolute atomic time.

IMPLICATION:
When footage shows Marcus Vance walking past Camera 3 timestamped at 21:21, the ACTUAL real-world time was 21:17:00—the exact moment Lord Arthur collapsed in the study! Vance's alibi of being on the terrace during the murder is mathematically invalidated.

Full NTP synchronization log attached.

Cyber Technical Analyst K. Vance`,
      attachment: {
        id: "ATT-103",
        fileName: "CCTV_CLOCK_DRIFT_AUDIT.pdf",
        fileType: "PDF Document",
        fileSize: "1.9 MB",
        contentHtml: `
          <div style="font-family:var(--font-mono); color:#fff; padding:20px; background:#070b14; border:1px solid var(--accent-cyan);">
            <div style="border-bottom:1px solid var(--accent-cyan); padding-bottom:10px; margin-bottom:14px;">
              <span class="badge blue">CYBER FORENSICS AUDIT #CAM-884</span>
              <h3 style="color:var(--accent-cyan); margin-top:4px;">CCTV CAMERA 3 TIMESTAMP DRIFT ANALYSIS</h3>
            </div>
            <p><strong>SERVER LOG ID:</strong> CCTV-SERVER-BLACKWOOD-01</p>
            <p><strong>CAMERA 3 CLOCK DRIFT:</strong> +00:04:12 (FAST)</p>
            <p><strong>RAW LOG TIMESTAMP:</strong> 21:21:12</p>
            <p><strong>CORRECTED ATOMIC TIMESTAMP:</strong> 21:17:00</p>
            <p><strong>ANALYSIS:</strong> Suspect Marcus Vance was in study corridor at 21:17, contradicting physical alibi.</p>
          </div>
        `
      }
    }
  ],

  // 2. INITIAL CASE COMMUNICATIONS FOR CASE 002 (ST. JUDE'S ACADEMY DISAPPEARANCE)
  "CASE-DCI-002": [
    {
      id: "MSG-201",
      threadId: "TH-201",
      caseId: "CASE-DCI-002",
      sender: "Directorate Command",
      senderAddress: "director@dci.internal",
      senderDept: "Directorate Executive Office",
      recipient: "Assigned Investigator",
      recipientAddress: "investigator@dci.internal",
      subject: "INVESTIGATION DIRECTIVE — CASE DCI-26-002: St. Jude's Academy",
      timestamp: "Today, 00:30",
      gameTime: 48,
      priority: "CRITICAL",
      clearanceRequired: 1,
      isRead: false,
      isStarred: true,
      category: "inbox",
      tag: "evidence",
      notes: "48 game hours deadline. Headmaster Dr. Adrian Vale vanished during midnight lockup drill.",
      body: `Investigator,

You have been assigned to lead the restricted investigation into CASE #DCI-26-002: The Disappearance of Headmaster Dr. Adrian Vale from St. Jude's Academy.

KEY INCIDENT PARAMETERS:
1. Dr. Vale was last confirmed inside his administrative study at 23:47 during an overnight lockdown drill (began 23:00).
2. Disappearance officially reported at 00:17 after security found the office unlocked and empty.
3. External perimeter gates were locked; no vehicle or pedestrian exit was logged on main gate CCTV.
4. Personal mobile phone recovered on desk. Vehicle remains parked in faculty courtyard.

DEADLINE: 48 GAME HOURS.

Do not assume abduction. Do not assume all witnesses lying are involved in the disappearance. Reconstruct the sequence and uncover the institutional motive.

Director V. Harrison
Directorate of Criminal Investigation`,
      attachment: {
        id: "ATT-201",
        fileName: "DCI_DIRECTIVE_STJUDE_RESTRICTED.pdf",
        fileType: "PDF Document",
        fileSize: "1.6 MB",
        contentHtml: `
          <div style="font-family:var(--font-mono); color:#fff; padding:20px; background:#070b14; border:1px solid var(--accent-blue);">
            <div style="border-bottom:2px double var(--accent-blue); padding-bottom:12px; margin-bottom:16px;">
              <span class="classified-stamp" style="font-size:1.1rem; color:var(--accent-cyan); border-color:var(--accent-cyan);">RESTRICTED INVESTIGATION DOSSIER</span>
              <h2 style="color:var(--accent-amber); margin-top:6px;">CASE DCI-26-002 — ST. JUDE'S ACADEMY</h2>
            </div>
            <p><strong>MISSING PERSON:</strong> Dr. Adrian Vale (Age 54, Headmaster)</p>
            <p><strong>LAST SEEN:</strong> 23:47 (Administrative Wing Study)</p>
            <p><strong>REPORTED DISAPPEARANCE:</strong> 00:17</p>
            <p><strong>CORE PUZZLE:</strong> How did the Headmaster exit during a locked-down academy drill without main gate CCTV detection?</p>
          </div>
        `
      }
    },
    {
      id: "MSG-202",
      threadId: "TH-202",
      caseId: "CASE-DCI-002",
      sender: "Field Investigation Unit",
      senderAddress: "fieldunit@dci.internal",
      senderDept: "Field Investigation Unit",
      recipient: "Lead Investigator",
      recipientAddress: "investigator@dci.internal",
      subject: "CCTV Camera 4 Outage Log & Gate Telemetry — Evidence #EVD2-21",
      timestamp: "Today, 01:15",
      gameTime: 47,
      priority: "HIGH",
      clearanceRequired: 1,
      isRead: false,
      isStarred: false,
      category: "inbox",
      tag: "contradiction",
      notes: "Camera 4 outage at 23:29 (7m 08s) was manually toggled in Security Office!",
      body: `Investigator,

Field logs for the St. Jude's Academy security console have been compiled (Evidence #EVD2-21).

FINDINGS:
1. Main Perimeter Gate Camera 1 shows zero pedestrian or vehicle movement between 23:00 and 00:30.
2. CCTV Camera 4 in the Faculty Corridor suffered a 7-minute 08-second outage starting at 23:29:12.
3. Head of Security Marcus Reed claimed the blackout was caused by an automatic power surge. However, system logs reveal the power breaker was manually toggled inside the Security Office console.

Summary report attached.

Insp. J. Vance
Field Operations Command`,
      attachment: {
        id: "ATT-202",
        fileName: "CCTV_OUTAGE_FIELD_REPORT.pdf",
        fileType: "PDF Document",
        fileSize: "2.1 MB",
        contentHtml: `
          <div style="font-family:var(--font-mono); color:#fff; padding:20px; background:#070b14; border:1px solid var(--accent-amber);">
            <div style="border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:14px;">
              <span class="badge amber">FIELD REPORT #STJ-CCTV-04</span>
              <h3 style="color:var(--accent-amber); margin-top:4px;">CAMERA 4 OUTAGE AUDIT</h3>
            </div>
            <p><strong>BLACKOUT WINDOW:</strong> 23:29:12 - 23:36:20</p>
            <p><strong>TOGGLE LOCATION:</strong> Console Master Switch (Security Office)</p>
            <p><strong>SUSPECT CONFRONTS:</strong> Head of Security Reed admits disabling camera for student rendezvous (Arjun Mehta), but claims no knowledge of Headmaster Vale's movements.</p>
          </div>
        `
      }
    },
    {
      id: "MSG-203",
      threadId: "TH-203",
      caseId: "CASE-DCI-002",
      sender: "Cyber Intelligence Unit",
      senderAddress: "cyber@dci.internal",
      senderDept: "Cyber Intelligence Unit",
      recipient: "Lead Investigator",
      recipientAddress: "investigator@dci.internal",
      subject: "Wi-Fi Telemetry & Secondary Device Anomaly — Evidence #EVD2-15 / EVD2-18",
      timestamp: "Today, 02:40",
      gameTime: 45,
      priority: "CRITICAL",
      clearanceRequired: 2,
      isRead: false,
      isStarred: true,
      category: "inbox",
      tag: "contradiction",
      notes: "Primary phone stayed in study desk, but secondary iPad MAC pinged Science Block Wi-Fi at 23:53!",
      body: `Investigator,

We extracted campus Wi-Fi router packet logs (Evidence #EVD2-15) for Dr. Adrian Vale's devices.

CRITICAL DIGITAL CLUE DISCOVERED:
While Dr. Vale's primary mobile phone remained stationary inside his study desk drawer throughout the night, an encrypted backup iPad (MAC: 4A:88:C1, registered to Dr. Vale) connected to the Science Block Access Point at 23:53!

Packet telemetry confirms a 45MB cloud upload of scanned financial audit papers (Evidence #EVD2-18) was executed from the Science Block at 23:55.

This proves Dr. Vale was NOT inside his office at 23:53, but had already traversed campus to the Science Block!

Full Wi-Fi MAC telemetry log attached.

Cyber Technical Analyst S. Ross`,
      attachment: {
        id: "ATT-203",
        fileName: "WIFI_TELEMETRY_SCIENCE_BLOCK.pdf",
        fileType: "PDF Document",
        fileSize: "3.2 MB",
        contentHtml: `
          <div style="font-family:var(--font-mono); color:#fff; padding:20px; background:#070b14; border:1px solid var(--accent-cyan);">
            <div style="border-bottom:1px solid var(--accent-cyan); padding-bottom:10px; margin-bottom:14px;">
              <span class="badge blue">CYBER TELEMETRY #WIFI-STJ-88</span>
              <h3 style="color:var(--accent-cyan); margin-top:4px;">SECONDARY DEVICE PACKET LOG</h3>
            </div>
            <p><strong>PRIMARY PHONE MAC:</strong> 88:99:AA:BB (Stationary in Admin Wing Desk)</p>
            <p><strong>SECONDARY IPAD MAC:</strong> 4A:88:C1 (Connected to Science Block AP at 23:53)</p>
            <p><strong>DATA TRANSFER:</strong> 45MB encrypted upload to DCI Fraud Division cloud endpoint.</p>
            <p><strong>KEY INFERENCE:</strong> Disappearance was staged by Dr. Vale to safely deliver evidence exposing endowment embezzlement.</p>
          </div>
        `
      }
    },
    {
      id: "MSG-204",
      threadId: "TH-204",
      caseId: "CASE-DCI-002",
      sender: "Financial Intelligence Unit",
      senderAddress: "financial@dci.internal",
      senderDept: "Financial Intelligence Unit",
      recipient: "Lead Investigator",
      recipientAddress: "investigator@dci.internal",
      subject: "Endowment Fund Wire Audit — $350,000 Deficit — Evidence #EVD2-04 / EVD2-29",
      timestamp: "Today, 03:20",
      gameTime: 44,
      priority: "HIGH",
      clearanceRequired: 2,
      isRead: false,
      isStarred: false,
      category: "inbox",
      tag: "evidence",
      notes: "Trustee Victoria Harcourt authorized $350k offshore wire transfer.",
      body: `Investigator,

Financial Intelligence has reconstructed the torn audit document (Evidence #EVD2-04) recovered from the study wastebasket.

AUDIT SUMMARY:
1. An unauthorized wire transfer of $350,000 was executed from the St. Jude's Endowment Trust to an offshore account in Grand Cayman.
2. The transfer authorization form (Evidence #EVD2-29) bears the signature stamp of Board Trustee Victoria Harcourt.
3. Phone CDR records (Evidence #EVD2-14) show Trustee Harcourt called Dr. Vale at 23:16 (duration 4m 12s) demanding he halt the external audit.

Auditor M. Sterling
Financial Intelligence Division`,
      attachment: {
        id: "ATT-204",
        fileName: "ENDOWMENT_WIRE_AUDIT_REPORT.pdf",
        fileType: "PDF Document",
        fileSize: "2.4 MB",
        contentHtml: `
          <div style="font-family:var(--font-mono); color:#fff; padding:20px; background:#070b14; border:1px solid var(--accent-green);">
            <div style="border-bottom:1px solid var(--accent-green); padding-bottom:10px; margin-bottom:14px;">
              <span class="badge green">FINANCIAL AUDIT #FIU-STJ-350</span>
              <h3 style="color:var(--accent-green); margin-top:4px;">ENDOWMENT FUND DEFICIT REPORT</h3>
            </div>
            <p><strong>AMOUNT DISPLACED:</strong> $350,000.00 USD</p>
            <p><strong>BENEFICIARY ACCOUNT:</strong> Horizon Capital Offshore Holdings</p>
            <p><strong>AUTHORIZING TRUSTEE:</strong> Victoria Harcourt (Chairperson, Board of Trustees)</p>
          </div>
        `
      }
    },
    {
      id: "MSG-205",
      threadId: "TH-205",
      caseId: "CASE-DCI-002",
      sender: "Anonymous Source",
      senderAddress: "unknown.sender@external",
      senderDept: "External Encrypted Channel",
      recipient: "Lead Investigator",
      recipientAddress: "investigator@dci.internal",
      subject: "You are looking in the wrong place.",
      timestamp: "Today, 04:05",
      gameTime: 43,
      priority: "CRITICAL",
      clearanceRequired: 1,
      isRead: false,
      isStarred: true,
      category: "inbox",
      tag: "contradiction",
      notes: "Cryptic tip pointing toward Chapel cellar and Victorian steam tunnels.",
      body: `Investigator,

Do not waste time searching the main perimeter gates. The Headmaster did not leave St. Jude's in a car, nor was he dragged out by force.

Check the Victorian steam pipe tunnels beneath the Chapel cellar. Maintenance Supervisor Bell knows which key opens the iron hatch.

Look at where the Wi-Fi connects, not where the phone sits.

— A Friend of the Directorate`,
      attachment: null
    },
    {
      id: "MSG-206",
      threadId: "TH-206",
      caseId: "CASE-DCI-002",
      sender: "Internal Affairs Division",
      senderAddress: "internal.affairs@dci.internal",
      senderDept: "Internal Affairs Division",
      recipient: "Lead Investigator",
      recipientAddress: "investigator@dci.internal",
      subject: "🔒 ACCESS RESTRICTED — INTERNAL CLEARANCE LEVEL 03 REQUIREMENT",
      timestamp: "Today, 05:00",
      gameTime: 42,
      priority: "HIGH",
      clearanceRequired: 3, // Requires Clearance Level 3!
      isRead: false,
      isStarred: false,
      category: "restricted",
      tag: "restricted",
      notes: "Requires Clearance Level 3 promotion.",
      body: `🔒 RESTRICTED COMMUNICATION // CLEARANCE LEVEL 03 REQUIRED

Your current DCI clearance level does not permit access to this Internal Affairs investigative memo regarding Board Trustee Victoria Harcourt's ministerial connections.

Advance your detective rank to unlock restricted intelligence.`,
      attachment: null
    }
  ]
};
