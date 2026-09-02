// CASE 002 — DISAPPEARANCE AT ST. JUDE'S ACADEMY (DCI-26-002)
// INDEPENDENT DATA-DRIVEN INVESTIGATION DATASET

window.CASE_DATA_002 = {
  meta: {
    case_id: "CASE-DCI-002",
    case_number: "DCI-26-002",
    title: "Disappearance at St. Jude's Academy",
    classification: "RESTRICTED",
    difficulty: "NORMAL",
    deadlineHours: 48,
    case_type: "MISSING PERSON / DISAPPEARANCE",
    location: "ST. JUDE'S ACADEMY",
    victim: {
      name: "Dr. Adrian Vale",
      age: 54,
      role: "Headmaster, St. Jude's Academy",
      status: "MISSING",
      lastSeen: "23:47 (Administrative Wing)",
      reportedMissing: "00:17",
      summary: "A respected but demanding headmaster leading St. Jude's Academy for 11 years. Disappeared during a scheduled midnight lockdown drill. Office unlocked, vehicle and phone left behind."
    },
    briefingHtml: `
      <div style="background:var(--bg-card); border:2px solid var(--accent-blue); border-radius:8px; padding:24px; margin-bottom:24px; box-shadow:0 10px 30px rgba(0,0,0,0.6);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:14px; margin-bottom:18px;">
          <div>
            <span class="classified-stamp" style="font-size:1.1rem; color:var(--accent-cyan); border-color:var(--accent-cyan);">CLASSIFIED MISSING PERSON DOSSIER</span>
            <h1 style="color:#fff; font-size:1.6rem; margin-top:6px;">DCI-26-002 — DISAPPEARANCE AT ST. JUDE'S ACADEMY</h1>
          </div>
          <div style="text-align:right; font-size:0.75rem; color:var(--text-muted);">
            <div>CASE ID: <strong>CASE-DCI-002</strong></div>
            <div>DEADLINE: <strong style="color:var(--accent-amber);">48 GAME HOURS</strong></div>
            <div>SECURITY CLEARANCE: <strong style="color:var(--accent-blue);">LEVEL 01 RESTRICTED</strong></div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:100px 1fr; gap:20px; background:#05080e; border:1px solid var(--border-color); padding:16px; border-radius:6px; margin-bottom:20px;">
          <div style="background:#1e293b; border:1px solid var(--accent-blue); border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:3rem; color:var(--accent-cyan);">🕵️‍♂️</div>
          <div>
            <span style="font-size:0.7rem; color:var(--accent-amber);">THE MISSING PERSON</span>
            <h3 style="color:#fff; font-size:1.2rem; margin-top:2px;">Dr. Adrian Vale (Age 54)</h3>
            <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:4px; line-height:1.4;">
              Headmaster of St. Jude's Academy for 11 years. Last confirmed in the administrative wing at 23:47 during an overnight lockdown drill. Disappearance officially reported at 00:17. Office unlocked, personal phone recovered, vehicle parked on grounds. No exit recorded on main gate logs.
            </p>
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="color:var(--accent-amber); font-size:1rem; margin-bottom:8px; border-left:3px solid var(--accent-amber); padding-left:10px;">INCIDENT OVERVIEW & CASE BRIEFING</h3>
          <p style="font-size:0.85rem; color:var(--text-primary); line-height:1.6; margin-bottom:12px;">
            At 00:17 hours, Dr. Adrian Vale was reported missing after security personnel found his office empty during midnight lockup. St. Jude's Academy was under a restricted overnight movement lockdown (initiated at 23:00). All external perimeter gates were locked. No vehicle or pedestrian exit was logged. His mobile phone was recovered on his desk, yet network telemetry indicates a secondary device pinging from school Wi-Fi.
          </p>
          <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">
            Did Dr. Vale leave voluntarily? Was he abducted? Lured to an underground utility corridor? Or was the disappearance staged to conceal institutional embezzlement or confidential board audits? Reconstruct the sequence before the 48 game hours expire.
          </p>
        </div>

        <div style="margin-bottom:24px;">
          <h3 style="color:var(--accent-cyan); font-size:1rem; margin-bottom:12px; border-left:3px solid var(--accent-cyan); padding-left:10px;">PRIMARY INVESTIGATIVE THREADS</h3>
          
          <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px;">
            <div style="background:#090e1a; border:1px solid var(--border-color); padding:14px; border-radius:6px;">
              <div style="font-size:0.75rem; color:var(--accent-cyan); font-weight:bold; margin-bottom:4px;">THREAD 01 // CCTV OUTAGE & DRIFT</div>
              <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4;">
                Camera 4 in the faculty corridor suffered a 7-minute outage at 23:29. Head of Security claims an automated glitch.
              </p>
            </div>
            <div style="background:#090e1a; border:1px solid var(--border-color); padding:14px; border-radius:6px;">
              <div style="font-size:0.75rem; color:var(--accent-amber); font-weight:bold; margin-bottom:4px;">THREAD 02 // DIGITAL TELEMETRY</div>
              <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4;">
                Headmaster's phone remained in office, but an encrypted tablet authenticated on the Science Block Wi-Fi at 23:53.
              </p>
            </div>
            <div style="background:#090e1a; border:1px solid var(--border-color); padding:14px; border-radius:6px;">
              <div style="font-size:0.75rem; color:var(--accent-green); font-weight:bold; margin-bottom:4px;">THREAD 03 // UNDERGROUND ROUTE</div>
              <p style="font-size:0.78rem; color:var(--text-secondary); line-height:1.4;">
                An old Victorian maintenance tunnel runs beneath the Chapel to the Old Archive Room. Was it used during lockdown?
              </p>
            </div>
          </div>
        </div>

        <div style="display:flex; gap:14px; border-top:1px solid var(--border-color); padding-top:18px;">
          <button class="btn-dci primary" style="padding:12px 20px; font-size:0.85rem;" onclick="switchCaseView('case-board')">📌 OPEN INTERACTIVE CASE BOARD</button>
          <button class="btn-dci gold" style="padding:12px 20px; font-size:0.85rem;" onclick="switchCaseView('suspects')">👥 EXAMINE 8 SUSPECT DOSSIERS</button>
          <button class="btn-dci" style="padding:12px 20px; font-size:0.85rem;" onclick="switchCaseView('interrogation')">🎙️ INTERROGATE SUSPECTS</button>
        </div>
      </div>
    `
  },

  suspects: [
    {
      id: "shaw",
      name: "Eleanor Shaw",
      role: "Deputy Headmistress",
      summary: "Competent senior administrator. Professional friction with Dr. Vale regarding board audit policies.",
      lawyer: false,
      gauges: { confidence: 65, stress: 55 },
      publicStory: "I was inside the Faculty Lounge managing lockdown rosters until 23:30, then returned directly to my quarters.",
      secret: "Secretly investigating unauthorized wire transfers from school endowment accounts.",
      lies: ["Denies entering the Administrative Wing after 23:00."],
      responses: {
        greeting: "Detective, Dr. Vale's disappearance is deeply concerning for St. Jude's reputation. Ask your questions quickly.",
        alibi: "I was reviewing dorm inspection logs in the Faculty Lounge. I did not enter the Headmaster's wing after 23:00.",
        lockdown: "The midnight lockdown drill was ordered personally by Dr. Vale three days ago. It was supposed to be a routine security exercise.",
        confront_admin: "Alright... I did step into the admin corridor at 23:15, but only to drop off confidential financial audit papers under his door!"
      }
    },
    {
      id: "reed",
      name: "Marcus Reed",
      role: "Head of Security (Age 47)",
      summary: "Former police sergeant in charge of academy CCTV and perimeter gate locks.",
      lawyer: false,
      gauges: { confidence: 75, stress: 60 },
      publicStory: "Monitored lockdown from the Security Office. All gate locks engaged automatically at 23:00.",
      secret: "Disabled Camera 4 in the Faculty Corridor at 23:29 to allow a student contraband delivery.",
      lies: ["Claims Camera 4 outage was caused by a power surge."],
      responses: {
        greeting: "Security protocol was followed to the letter, Officer. No one passed the main gate.",
        alibi: "I was at the master console in the Security Office from 22:50 until the alarm sounded at 00:17.",
        cctv: "Camera 4 cut out for 7 minutes due to an old breaker tripping. It happens with these vintage academy buildings.",
        confront_camera: "Fine! I shut off Camera 4 because Prefect Mehta paid me $200 to look the other way while he met a friend. It had nothing to do with Dr. Vale!"
      }
    },
    {
      id: "mercer",
      name: "Daniel Mercer",
      role: "Senior History Teacher",
      summary: "Vocal critic of Dr. Vale's administrative reforms and disciplinary policy.",
      lawyer: false,
      gauges: { confidence: 50, stress: 70 },
      publicStory: "Spent the evening grading essays in his staff apartment.",
      secret: "Had a heated private argument with Dr. Vale in the study at 22:45 regarding a stolen historical manuscript.",
      lies: ["Claims he had no private contact with Dr. Vale after the 22:30 staff meeting."],
      responses: {
        greeting: "Dr. Vale and I had our differences, but I am a teacher, not a conspirator.",
        alibi: "After the staff meeting ended at 22:48, I walked straight back to my apartment in the East Faculty Block.",
        meeting: "We discussed normal curriculum matters during the main staff meeting. Nothing private.",
        confront_meeting: "Yes, I confronted him at 22:53! He accused me of taking an 18th-century school charter from the Old Archive Room. I stormed out at 23:05!"
      }
    },
    {
      id: "sen",
      name: "Dr. Mira Sen",
      role: "School Physician",
      summary: "Oversees the academy infirmary and restricted medical inventory.",
      lawyer: false,
      gauges: { confidence: 60, stress: 45 },
      publicStory: "Was in the Medical Wing preparing monthly student health reports.",
      secret: "Altered a medical prescription record to cover up Dr. Vale's severe insomnia medication intake.",
      lies: ["Claims Dr. Vale was in peak physical health and took no prescription drugs."],
      responses: {
        greeting: "Medical records are strictly confidential, Detective. How can the infirmary assist your inquiry?",
        alibi: "I was filing medical logs in the infirmary clinic until midnight.",
        medical: "Dr. Vale had regular physical checkups. He was in excellent health for a man of 54.",
        confront_meds: "Dr. Vale was suffering from severe panic attacks and insomniac delirium. I prescribed a mild sedative under an alias to protect his standing."
      }
    },
    {
      id: "mehta",
      name: "Arjun Mehta",
      role: "Senior Student / Prefect (Age 17)",
      summary: "Senior prefect with master keycard access to dorm corridors.",
      lawyer: false,
      gauges: { confidence: 40, stress: 80 },
      publicStory: "Remained inside the Senior Dormitory throughout the lockdown drill.",
      secret: "Slipped out during lockdown to meet a junior student behind the Science Block.",
      lies: ["Claims he never left his dorm room after 23:00."],
      responses: {
        greeting: "I didn't break any rules, sir! I was in my room all night!",
        alibi: "I was studying for A-Levels in Dorm Room 4B from 22:30 onward.",
        lockdown: "Prefects are supposed to enforce lockdown, but I stayed inside like everyone else.",
        confront_lockdown: "Okay, don't tell the Headmistress! I slipped out at 23:25 to meet Maya by the Science Block. But while walking back, I saw someone near the Chapel entrance!"
      }
    },
    {
      id: "bell",
      name: "Thomas Bell",
      role: "Maintenance Supervisor",
      summary: "Employed at St. Jude's for 22 years. Possesses comprehensive knowledge of academy infrastructure.",
      lawyer: false,
      gauges: { confidence: 70, stress: 50 },
      publicStory: "Was servicing the heating boilers in the basement until 23:45.",
      secret: "Maintains an unrecorded key to the Victorian utility tunnel connecting the Chapel to the Old Archive Room.",
      lies: ["Claims all underground passages were bricked up in 1994."],
      responses: {
        greeting: "These old buildings have a lot of secrets, Detective. Heating pipes, leaky roofs, rusty locks.",
        alibi: "I was bleeding the radiators in the main boiler room from 23:00 to 23:45.",
        passage: "The old steam tunnels? Sealed off decades ago with solid concrete, mate. Nobody goes down there.",
        confront_passage: "Alright, the tunnel behind the Chapel cellar is still open! Dr. Vale asked me to unlock it two weeks ago so he could store old files in the Archive Room."
      }
    },
    {
      id: "harcourt",
      name: "Victoria Harcourt",
      role: "School Board Trustee",
      summary: "Wealthy benefactor and chairperson of the St. Jude's Endowment Trust.",
      lawyer: false,
      gauges: { confidence: 85, stress: 35 },
      publicStory: "Was at her private residence in London during the disappearance.",
      secret: "Threatened Dr. Vale with dismissal over an unrecorded $350,000 endowment deficit.",
      lies: ["Claims she had no disagreements or contact with Dr. Vale that evening."],
      responses: {
        greeting: "St. Jude's is a prestigious institution, Detective. Ensure your investigation is discreet.",
        alibi: "I was in London attending a gallery opening. My chauffeur can verify my timeline.",
        dispute: "Dr. Vale and I shared a vision for the academy's expansion. We had zero financial friction.",
        confront_wire: "Dr. Vale uncovered an accounting discrepancy in the endowment fund. I spoke to him by phone at 23:16 to demand a full audit before the board meeting!"
      }
    },
    {
      id: "price",
      name: "Samuel Price",
      role: "Senior Housemaster",
      summary: "Respected faculty member residing in the Senior Dormitory wing.",
      lawyer: false,
      gauges: { confidence: 60, stress: 65 },
      publicStory: "Conducted dormitory bed checks at 23:00 and remained in his quarters.",
      secret: "Discovered an encrypted USB drive hidden inside Dr. Vale's desk drawer two days prior.",
      lies: ["Claims Dr. Vale showed no unusual behavior or distress prior to his disappearance."],
      responses: {
        greeting: "The boys are shaken by this, Detective. We hope Dr. Vale is found unharmed.",
        alibi: "I completed the Senior Dormitory bed checks at 23:05 and spent the night reading in my study.",
        behavior: "Adrian was his usual disciplined self during the staff meeting.",
        confront_behavior: "Adrian was terrified! He told me someone was tracking his digital communications and that he had prepared an emergency contingency plan."
      }
    }
  ],

  evidenceCatalog: [
    { id: "EVD2-01", name: "Pushed-Back Office Chair", category: "PHYSICAL", location: "Headmaster's Office", description: "Desk chair pushed backward sharply, indicating a sudden exit or unexpected visitor.", details: "No signs of physical struggle or bloodstains on carpet.", reliability: 1 },
    { id: "EVD2-02", name: "Half-Finished Chamomile Tea", category: "PHYSICAL", location: "Headmaster's Desk", description: "Porcelain cup containing warm chamomile tea.", details: "Forensic test reveals trace amounts of mild prescription sedative.", reliability: 1 },
    { id: "EVD2-03", name: "Open Leather Notebook", category: "DOCUMENTS", location: "Headmaster's Study", description: "Notebook open to entry dated Nov 14.", details: "Notes state: 'Lockdown protocol verified. Archive transfer at 23:40.'", reliability: 1 },
    { id: "EVD2-04", name: "Torn Financial Audit Sheet", category: "DOCUMENTS", location: "Wastebasket", description: "Shredded document pieces recovered from study wastebasket.", details: "Shows unauthorized $350,000 wire transfer from Endowment Fund.", reliability: 1 },
    { id: "EVD2-05", name: "Muddy Boot Impression", category: "PHYSICAL", location: "Chapel Exterior", description: "Partial boot print matching heavy work boots near Chapel side door.", details: "Matches soil composition from Maintenance Yard.", reliability: 2 },
    { id: "EVD2-06", name: "Electronic Door Keycard Log", category: "DIGITAL", location: "Admin Wing Door", description: "Keycard reader log for Administrative Corridor.", details: "Access logged by Master Pass #04 (Shaw) at 23:15 and Security Pass #01 at 23:41.", reliability: 1 },
    { id: "EVD2-07", name: "Displaced Brass Paperweight", category: "PHYSICAL", location: "Headmaster's Desk", description: "Heavy brass school seal paperweight knocked onto carpet.", details: "Fingerprints match Daniel Mercer (Senior History Teacher).", reliability: 1 },
    { id: "EVD2-08", name: "Synthetic Fabric Fibre", category: "PHYSICAL", location: "Chapel Cellar Door", description: "Dark blue polyester fibre caught on iron door latch.", details: "Matches standard school prefect uniform blazer.", reliability: 2 },
    { id: "EVD2-09", name: "Partial Fingerprint on Deadbolt", category: "PHYSICAL", location: "Admin Exit Door", description: "Latent print on inner thumb-latch of emergency exit.", details: "Identified as Dr. Adrian Vale (Headmaster).", reliability: 1 },
    { id: "EVD2-10", name: "Handwritten Note in Pocket", category: "DOCUMENTS", location: "Faculty Mailbox", description: "Unsigned note addressed to Dr. Vale.", details: "Reads: 'The board will not cover for you again. Meet me at 23:30.'", reliability: 1 },
    { id: "EVD2-11", name: "Broken Wax Seal", category: "DOCUMENTS", location: "Old Archive Room", description: "Broken red seal on historic deed chest.", details: "Chest contains 18th-century academy charter documents.", reliability: 2 },
    { id: "EVD2-12", name: "Maintenance Wrench", category: "PHYSICAL", location: "Utility Corridor", description: "12-inch steel pipe wrench left on utility pipe casing.", details: "Tool belonging to Thomas Bell.", reliability: 2 },
    { id: "EVD2-13", name: "School Master Keycard #09", category: "DIGITAL", location: "Science Block Desk", description: "Spare master keycard assigned to Headmaster.", details: "Used to open Science Block side entrance at 23:51.", reliability: 1 },

    // Digital Records
    { id: "EVD2-14", name: "Headmaster's Phone Call Logs", category: "DIGITAL", location: "Recovered Phone", description: "CDR logs from Dr. Vale's iPhone.", details: "Incoming call from Victoria Harcourt at 23:16 (duration 4m 12s). Outgoing call to unknown mobile at 23:53.", reliability: 1 },
    { id: "EVD2-15", name: "Wi-Fi Telemetry Connection Log", category: "DIGITAL", location: "Academy Router", description: "MAC address connection logs for campus Wi-Fi network.", details: "Dr. Vale's primary phone stationary in Admin Wing. Encrypted iPad (MAC: 4A:88:C1) connected to Science Block AP at 23:53.", reliability: 1 },
    { id: "EVD2-16", name: "Bluetooth Handshake Record", category: "DIGITAL", location: "Admin Access Point", description: "Short-range Bluetooth device pairing event.", details: "Paired with smart lock on Chapel Cellar Door at 23:42.", reliability: 1 },
    { id: "EVD2-17", name: "Encrypted Email Draft", category: "DIGITAL", location: "Mail Server", description: "Unsent email draft on Dr. Vale's cloud account.", details: "Subject: 'Resignation & Audit Disclosure'. Addressed to DCI Fraud Division.", reliability: 1 },
    { id: "EVD2-18", name: "Secondary Device Network Ping", category: "DIGITAL", location: "Science Block Wi-Fi", description: "Encrypted data packet sent from Science Block access point at 23:55.", details: "Uploaded 45MB of scanned financial files to secure cloud server.", reliability: 1 },

    // CCTV Records
    { id: "EVD2-19", name: "Main Gate Camera Log", category: "DIGITAL", location: "Security Vault", description: "24/7 Video feed of academy front entrance.", details: "Gate locked at 23:00. No vehicle or pedestrian exit recorded between 23:00 and 00:30.", reliability: 1 },
    { id: "EVD2-20", name: "Admin Corridor CCTV Feed", category: "DIGITAL", location: "Camera 1", description: "Coverage of Headmaster's office corridor.", details: "Dr. Vale enters office at 22:53. Mercer exits at 23:05. Shaw drops papers under door at 23:15. Ambiguous dark figure enters at 23:41.", reliability: 1 },
    { id: "EVD2-21", name: "Camera 4 Outage Log", category: "DIGITAL", location: "Faculty Corridor", description: "System log for CCTV Camera 4.", details: "Signal lost at 23:29:12, restored at 23:36:04 (7m 08s outage). Manual power switch toggled in Security Office.", reliability: 1 },
    { id: "EVD2-22", name: "Reflection in Trophy Case", category: "DIGITAL", location: "Courtyard Camera", description: "Enhanced frame from Courtyard CCTV at 23:45.", details: "Glass reflection shows a person carrying a black duffel bag entering Chapel side door.", reliability: 2 },
    { id: "EVD2-23", name: "Rear Service Gate Camera", category: "DIGITAL", location: "Service Gate", description: "Infrared camera monitoring delivery gate.", details: "Gate remained padlocked. No breaches detected.", reliability: 1 },
    { id: "EVD2-24", name: "Courtyard Shadow Silhouette", category: "DIGITAL", location: "Courtyard Camera", description: "Frame captured at 00:02.", details: "Shows silhouette moving toward Maintenance Building.", reliability: 2 },

    // Documents & Financial
    { id: "EVD2-25", name: "Lockdown Protocol Drill Order", category: "FINANCIAL", location: "Headmaster's Desk", description: "Official directive signed by Dr. Vale ordering 23:00 lockdown drill.", details: "Issued 3 days prior. Specified strict dorm confinement.", reliability: 1 },
    { id: "EVD2-26", name: "Security Maintenance Report", category: "DOCUMENTS", location: "Security Office", description: "Log of recent repair work on campus alarm sensors.", details: "Chapel cellar motion sensor flagged as 'deactivated for renovation'.", reliability: 1 },
    { id: "EVD2-27", name: "Staff Duty Roster", category: "DOCUMENTS", location: "Faculty Lounge", description: "Duty assignments for overnight lockdown drill.", details: "Shaw assigned to Faculty Lounge; Reed on console; Price on dorm duty.", reliability: 1 },
    { id: "EVD2-28", name: "Victorian Utility Tunnel Blueprint", category: "DOCUMENTS", location: "Old Archive Room", description: "1894 architectural schematic of St. Jude's grounds.", details: "Shows subterranean passage connecting Chapel Cellar, Maintenance Shop, and Old Archive Room.", reliability: 1 },
    { id: "EVD2-29", name: "Endowment Wire Transfer Order", category: "FINANCIAL", location: "Trustee Records", description: "Bank authorization form for $350,000 transfer.", details: "Authorized using Trustee Harcourt's signature stamp to an offshore account.", reliability: 1 }
  ],

  timelineEvents: [
    { time: "22:30", event: "Headmaster Dr. Adrian Vale convenes mandatory staff meeting in Faculty Lounge.", location: "Faculty Lounge", verified: true, anomaly: false },
    { time: "22:48", event: "Staff meeting adjourns. Faculty members return to respective wings.", location: "Faculty Lounge", verified: true, anomaly: false },
    { time: "22:53", event: "Dr. Vale returns to Administrative Wing and unlocks study door.", location: "Admin Wing", verified: true, anomaly: false },
    { time: "22:55", event: "Daniel Mercer enters Headmaster's study; heated argument ensues regarding missing charter.", location: "Headmaster Office", verified: true, anomaly: false },
    { time: "23:00", event: "Scheduled midnight lockdown drill commences; external gates locked automatically.", location: "Campus Wide", verified: true, anomaly: false },
    { time: "23:05", event: "Daniel Mercer exits study sharply, knocking over brass paperweight.", location: "Admin Corridor", verified: true, anomaly: false },
    { time: "23:08", event: "Security console logs normal operation across all 16 CCTV channels.", location: "Security Office", verified: true, anomaly: false },
    { time: "23:15", event: "Eleanor Shaw enters admin corridor and slips audit document under Headmaster's door.", location: "Admin Corridor", verified: true, anomaly: false },
    { time: "23:16", event: "Dr. Vale receives phone call from Board Trustee Victoria Harcourt (4m 12s duration).", location: "Headmaster Office", verified: true, anomaly: false },
    { time: "23:21", event: "Staff member observes light active beneath Headmaster's office door.", location: "Admin Corridor", verified: true, anomaly: false },
    { time: "23:25", event: "Prefect Arjun Mehta slips out of Senior Dormitory to meet student near Science Block.", location: "Senior Dorm", verified: true, anomaly: false },
    { time: "23:29", event: "CCTV Camera 4 experiences 7-minute outage (manually toggled at console).", location: "Faculty Corridor", verified: true, anomaly: true },
    { time: "23:34", event: "Student reports hearing muffled argument near Chapel courtyard entrance.", location: "Courtyard", verified: false, anomaly: false },
    { time: "23:41", event: "Security card reader logs Master Pass #01 access to Chapel Cellar door.", location: "Chapel Cellar", verified: true, anomaly: true },
    { time: "23:42", event: "Dr. Vale's phone pairs via Bluetooth with Chapel Cellar smart lock.", location: "Chapel Cellar", verified: true, anomaly: false },
    { time: "23:47", event: "Dr. Vale last independently confirmed in Admin Wing preparing duffel bag.", location: "Admin Wing", verified: true, anomaly: false },
    { time: "23:51", event: "Spare Keycard #09 unlocks Science Block side entrance.", location: "Science Block", verified: true, anomaly: false },
    { time: "23:53", event: "Encrypted iPad connects to Science Block Wi-Fi and initiates cloud upload.", location: "Science Block", verified: true, anomaly: true },
    { time: "00:02", event: "Courtyard camera records ambiguous silhouette moving toward Maintenance Building.", location: "Courtyard", verified: false, anomaly: false },
    { time: "00:08", event: "Security Officer performs routine corridor check; office light still on.", location: "Admin Wing", verified: true, anomaly: false },
    { time: "00:12", event: "Security Officer opens Headmaster's office door; room is completely empty.", location: "Headmaster Office", verified: true, anomaly: false },
    { time: "00:17", event: "Disappearance of Dr. Adrian Vale officially reported to DCI Operations.", location: "Security Office", verified: true, anomaly: false }
  ],

  locations: [
    { id: "loc-01", name: "Main Gate", type: "PERIMETER", summary: "Automated iron gates monitored by Camera 1. Locked at 23:00." },
    { id: "loc-02", name: "Security Office", type: "SECURITY", summary: "Master CCTV console, gate controls, and access log servers." },
    { id: "loc-03", name: "Administrative Wing", type: "ADMIN", summary: "Contains Headmaster's office, deputy office, and main record vault." },
    { id: "loc-04", name: "Headmaster's Office", type: "CRIME SCENE", summary: "Primary disappearance site. Phone recovered on desk, chair pushed back, tea warm." },
    { id: "loc-05", name: "Headmaster's Residence", type: "PRIVATE", summary: "Private quarters located on north campus." },
    { id: "loc-06", name: "Faculty Corridor", type: "ACADEMIC", summary: "Connects staff offices. Location of Camera 4 blackout." },
    { id: "loc-07", name: "Senior Dormitory", type: "RESIDENTIAL", summary: "Quarters for senior students and Housemaster Price." },
    { id: "loc-08", name: "Junior Dormitory", type: "RESIDENTIAL", summary: "Quarters for junior students." },
    { id: "loc-09", name: "Dining Hall", type: "COMMON", summary: "Large central hall used for meals and general assemblies." },
    { id: "loc-10", name: "Library", type: "ACADEMIC", summary: "Multi-level historical library." },
    { id: "loc-11", name: "Science Block", type: "LABORATORY", summary: "Location where secondary iPad connected to Wi-Fi at 23:53." },
    { id: "loc-12", name: "Chapel", type: "HISTORIC", summary: "Victorian chapel. Side cellar door leads to underground utility route." },
    { id: "loc-13", name: "Courtyard", type: "GROUNDS", summary: "Central stone quadrangle." },
    { id: "loc-14", name: "Sports Ground", type: "GROUNDS", summary: "Athletic fields bordering outer woods." },
    { id: "loc-15", name: "Maintenance Building", type: "SERVICE", summary: "Boiler room and tools workshop managed by Thomas Bell." },
    { id: "loc-16", name: "Rear Service Gate", type: "PERIMETER", summary: "Padlocked delivery entrance." },
    { id: "loc-17", name: "Underground Utility Corridor", type: "SUBTERRANEAN", summary: "1894 steam pipe tunnel connecting Chapel Cellar and Maintenance Building." },
    { id: "loc-18", name: "Old Archive Room", type: "HISTORIC", summary: "Sealed storage vault containing historic academy charters and financial records." }
  ],

  forensicTests: [
    { id: "TST2-01", name: "Tea Sedative Chromatography", cost: 500, timeHours: 4, itemRequired: "EVD2-02", result: "POSITIVE: High concentration of Zolpidem (prescription sleep aid)." },
    { id: "TST2-02", name: "Fingerprint Analysis on Paperweight", cost: 400, timeHours: 4, itemRequired: "EVD2-07", result: "IDENTIFIED: Daniel Mercer (Senior History Teacher)." },
    { id: "TST2-03", name: "Fibre Mass Spectrometry", cost: 600, timeHours: 4, itemRequired: "EVD2-08", result: "MATCH: Standard Senior Prefect Blazer polyester blend." },
    { id: "TST2-04", name: "Torn Audit Document Reconstruction", cost: 750, timeHours: 4, itemRequired: "EVD2-04", result: "RECONSTRUCTED: Shows $350,000 transfer signed by Trustee Harcourt." },
    { id: "TST2-05", name: "Secondary iPad MAC Address Telemetry", cost: 800, timeHours: 3, itemRequired: "EVD2-15", result: "OWNER VERIFIED: Registered to Dr. Adrian Vale (Personal Backup Tablet)." }
  ],

  // HIDDEN CASE SOLUTION & SCORING RULESET
  solution: {
    disappearanceType: "voluntary_staged", // Dr. Vale staged his disappearance to expose endowment fraud
    mastermind: "vale_self",
    accomplices: ["bell"], // Thomas Bell unlocked the subterranean passage
    method: "underground_tunnel", // Moved via Chapel Cellar -> Utility Corridor -> Science Block
    keyLies: ["shaw_admin", "reed_camera", "harcourt_wire", "mehta_dorm"],
    summary: "Dr. Adrian Vale discovered that Trustee Victoria Harcourt embezzled $350,000 from the endowment fund. Knowing Harcourt would silence him or destroy evidence, Dr. Vale staged his midnight disappearance during the lockdown. He left his primary phone in his study, took his backup iPad and duffel bag through the Chapel underground utility tunnel (unlocked by Thomas Bell), accessed the Science Block at 23:53 to upload evidence to DCI, and exited through the unmonitored Maintenance Service hatch into the woods!"
  }
};
