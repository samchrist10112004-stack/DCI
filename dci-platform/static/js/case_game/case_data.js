// OPERATION BLACKWOOD: MASTER CASE FILE DATASET & LORE Engine

const CASE_DATA = {
  meta: {
    case_id: "CASE-DCI-001",
    case_number: "DCI-26-001",
    title: "Operation Blackwood: Homicide Investigation",
    classification: "RESTRICTED",
    difficulty: "NORMAL",
    deadlineHours: 72,
    case_type: "HOMICIDE / POISONING",
    location: "BLACKWOOD MANOR ESTATE",
    victim: {
      name: "Lord Arthur Pendelton",
      age: 58,
      role: "Minister of Defence Logistics",
      status: "DECEASED",
      lastSeen: "21:00 (Study)",
      reportedMissing: "22:30",
      summary: "Minister of Energy & Defence Logistics. Found deceased inside his locked estate study at Blackwood Manor. Cause of death: acute organophosphate neurotoxin."
    }
  },

  caseInfo: {
    code: "884-BLACKWOOD",
    title: "The Homicide of Lord Arthur Pendelton",
    location: "Blackwood Manor Estate, Oxfordshire",
    victim: "Lord Arthur Pendelton (58)",
    occupation: "Minister of Energy & Defence Logistics",
    timeWindow: "20:30 - 22:00 (Estimated TOD: 21:10 - 21:25)",
    timeRemaining: 72,
    budget: 5000,
    pressures: {
      political: 25,
      media: 40,
      superior: 15
    }
  },

  victimSecrets: [
    "Blackmailing Dr. Alistair Finch over 3 patient deaths in unapproved clinical trials.",
    "Drafted a secret codicil removing step-son Julian Thorne and Lady Victoria from his estate will.",
    "Holding classified defense files ('Operation Blackwood Protocol') on an encrypted USB.",
    "Receiving regular offshore wire payments from Marcus Vance's shell company 'Aegis Systems'."
  ],

  suspects: [
    {
      id: "victoria",
      name: "Lady Victoria Pendelton",
      role: "Wife of Victim",
      summary: "High-society socialite with severe hidden gambling debts ($4.2M).",
      motive: "Impending financial ruin; feared being disinherited by Lord Arthur's secret second will.",
      opportunity: "Present in Dining Room and Master Suite between 20:45 and 21:30.",
      alibi: "Claims she was making telephone calls in her bedroom suite from 21:05 to 21:30.",
      secret: "Co-conspirator in offshore embezzlement scheme with Inspector Sterling (Conspiracy C).",
      lie: "Denies entering Lord Arthur's Study after 20:30. (Wi-Fi packet log proves her phone synced in study at 21:08).",
      incriminating: "Her bloodied monogrammed silk handkerchief recovered near Study doorway.",
      exonerating: "Handkerchief blood stain tested positive for animal blood and synthetic dye (Planted Evidence).",
      relationship: "Secret financial agreement with Inspector Sterling; bitter marital friction with victim.",
      gauges: { fear: 45, confidence: 70, stress: 60, guilt: 30, suspicion: 55 },
      lawyer: false
    },
    {
      id: "finch",
      name: "Dr. Alistair Finch",
      role: "Personal Physician",
      summary: "Prominent physician who managed Lord Arthur's chronic cardiovascular medication.",
      motive: "Lord Arthur was blackmailing him with evidence of illegal pharmaceutical trials.",
      opportunity: "Access to medical kit and victim's private study during pre-dinner consultation at 20:40.",
      alibi: "Claims he was in the Conservatory reviewing medical charts from 21:00 to 21:30.",
      secret: "Smuggled illegal cardiac stimulants into the estate.",
      lie: "Claims he had no syringes with him that evening.",
      incriminating: "Used medical syringe discovered in garden flowerbed near Study window.",
      exonerating: "Syringe residue contains insulin, not the neurotoxin that killed the victim.",
      relationship: "Physician and blackmail target of Lord Arthur; hostile relationship with Vance.",
      gauges: { fear: 75, confidence: 40, stress: 80, guilt: 20, suspicion: 70 },
      lawyer: false
    },
    {
      id: "vance",
      name: "Marcus Vance",
      role: "CEO of Vance Defence Systems",
      summary: "Ruthless defense contractor vying for the multi-billion pound Blackwood Grid Contract.",
      motive: "Lord Arthur was planning to veto Vance's defense contract due to corruption evidence.",
      opportunity: "Disappeared from the Dining Room between 21:05 and 21:22.",
      alibi: "Claims he was smoking on the Front Terrace from 21:05 to 21:25.",
      secret: "Mastermind of the Murder (Conspiracy A); paid Valet Gabriel Moreau to sabotage electrical panel.",
      lie: "Claims he never possessed synthetic neurotoxin compounds.",
      incriminating: "Deleted encrypted message on phone timestamped 21:18 reading: 'It is done. Pen replaced.'",
      exonerating: "CCTV Camera 3 footage shows him walking past corridor at 21:21 (BUT camera clock is fast by +4 minutes!).",
      relationship: "Secret financial backer of Lady Victoria's debts; business rival of victim.",
      gauges: { fear: 20, confidence: 90, stress: 30, guilt: 85, suspicion: 80 },
      lawyer: false
    },
    {
      id: "reed",
      name: "Evelyn Reed (Helena Rostova)",
      role: "Private Secretary",
      summary: "Efficient personal assistant to Lord Arthur. Discovered to be living under a stolen identity.",
      motive: "None for murder; seeking to leak classified corruption files to international press.",
      opportunity: "Access to Study key and encrypted filing safe.",
      alibi: "Claims she was in the Secretarial Office cataloging dinner guest correspondence.",
      secret: "Real identity is Helena Rostova, former intelligence whistleblower (Conspiracy B).",
      lie: "Denied accessing the safe on the night of the murder.",
      incriminating: "Her fingerprints found on the open safe dial in Lord Arthur's Study.",
      exonerating: "Safe access log shows safe opened at 21:35—20 minutes AFTER Lord Arthur's death.",
      relationship: "Protective relationship with Valet Gabriel Moreau; hated Marcus Vance.",
      gauges: { fear: 65, confidence: 60, stress: 70, guilt: 10, suspicion: 60 },
      lawyer: false
    },
    {
      id: "sterling",
      name: "Inspector Thomas Sterling",
      role: "Head of Estate Security",
      summary: "Former Met Detective hired to manage Blackwood Manor's high-tech security grid.",
      motive: "Lord Arthur discovered Sterling was taking bribes from organized crime syndicates.",
      opportunity: "Full physical and digital access to security control room and CCTV server.",
      alibi: "Claims he was in the Security Control Room monitoring feeds the entire night.",
      secret: "Manually triggered 6-minute CCTV outage at 21:10 to allow illegal cash delivery (Conspiracy C).",
      lie: "Stated CCTV outage was caused by a sudden storm lightning power surge.",
      incriminating: "Log files show manual admin override code 'ST-882' executed right before outage.",
      exonerating: "Physical door sensor proves Sterling remained inside Security Room during outage.",
      relationship: "Secret accomplice to Lady Victoria; bribed by Marcus Vance for security floor plans.",
      gauges: { fear: 50, confidence: 75, stress: 55, guilt: 40, suspicion: 65 },
      lawyer: false
    },
    {
      id: "julian",
      name: "Julian Thorne",
      role: "Estranged Step-Son",
      summary: "Disinherited step-son with a history of violent outbursts and heavy debts.",
      motive: "Desperate for inheritance money; enraged over being cut out of the family trust.",
      opportunity: "Unannounced arrival at Blackwood Manor at 20:50; spotted lurking near Library garden.",
      alibi: "Claims he stayed in his car in the outer driveway drinking alcohol.",
      secret: "Came to steal his mother's antique diamond ring to pay off debt sharks.",
      lie: "Claims he never entered the estate residence grounds.",
      incriminating: "Muddy size 9 boot prints matching his shoes found outside Study French doors.",
      exonerating: "Soil analysis reveals garden mud was tracked onto patio before 21:00 (before rain started).",
      relationship: "Son of Lady Victoria; deeply hostile toward Lord Arthur.",
      gauges: { fear: 80, confidence: 30, stress: 90, guilt: 15, suspicion: 85 },
      lawyer: false
    },
    {
      id: "chloe",
      name: "Chloe Bennett",
      role: "Investigative Journalist",
      summary: "Resourceful investigative reporter who secured a guest invitation under false pretenses.",
      motive: "Seeking to expose Lord Arthur's illegal defense kickbacks for a career-making story.",
      opportunity: "Left Drawing Room at 21:00 under pretense of using the restroom.",
      alibi: "Claims she was lost in the West Wing hallway trying to find a bathroom.",
      secret: "Planted a covert audio listening bug inside the Dining Room chandelier at 20:15.",
      lie: "Denied carrying electronic recording devices.",
      incriminating: "Audio recording file found on her phone containing victim's argument at 21:05.",
      exonerating: "Her audio tape records victim's final words at 21:14: 'Vance, this ink... what is this?'",
      relationship: "Aggressive antagonist to Lord Arthur and Marcus Vance.",
      gauges: { fear: 40, confidence: 80, stress: 45, guilt: 5, suspicion: 50 },
      lawyer: false
    },
    {
      id: "gabriel",
      name: "Gabriel Moreau",
      role: "Estate Valet / Butler",
      summary: "Quiet, meticulous veteran butler who served Lord Arthur for 12 years.",
      motive: "Believed Lord Arthur was going to ruin Evelyn Reed, whom Moreau secretly believed was his illegitimate daughter.",
      opportunity: "Served coffee and fountain pen stationery in Study at 21:00.",
      alibi: "Claims he was preparing late supper service in the Main Kitchen.",
      secret: "Direct accomplice to Marcus Vance; swapped victim's fountain pen cartridge for poisoned unit.",
      lie: "False Confession under interrogation: Claims he acted entirely alone out of personal grudge.",
      incriminating: "Empty pen cartridge packaging found hidden inside his staff locker.",
      exonerating: "His false confession breaks down under cross-examination (doesn't know chemical compound name).",
      relationship: "Protector of Evelyn Reed; blackmailed accomplice to Marcus Vance.",
      gauges: { fear: 85, confidence: 25, stress: 95, guilt: 90, suspicion: 75 },
      lawyer: false
    }
  ],

  evidenceCatalog: [
    {
      id: "EVD-01",
      name: "Victim's Custom Fountain Pen",
      category: "PHYSICAL",
      location: "Study Desk",
      description: "Montblanc Meisterstück pen. Nib shows trace residue of dark violet liquid ink.",
      reliability: "A",
      details: "Lab test shows ink cartridge filled with organophosphate compound 'VX-Derivative-9'. Delivered transdermally through micro-puncture in nib grip."
    },
    {
      id: "EVD-02",
      name: "CCTV Footages (Camera 1-4)",
      category: "DIGITAL",
      location: "Security Room Server",
      description: "Digital video files covering main halls and perimeter.",
      reliability: "C",
      details: "Camera 3 exhibits a +4 minute clock drift. Camera 2 went dark from 21:10 to 21:16 due to manual override."
    },
    {
      id: "EVD-03",
      name: "Medical Syringe in Garden",
      category: "PHYSICAL",
      location: "Rear Garden Patio",
      description: "2ml disposable syringe containing clear liquid residue.",
      reliability: "E",
      details: "Planted Evidence. Residue is insulin. Fingerprints on barrel belong to Dr. Finch, but barrel was wiped with solvent."
    },
    {
      id: "EVD-04",
      name: "Monogrammed Silk Handkerchief",
      category: "PHYSICAL",
      location: "Study Doorway",
      description: "Fine silk cloth bearing initials 'V.P.' with dark red stains.",
      reliability: "E",
      details: "Planted Evidence. Forensic analysis proves stains are synthetic theatrical blood mixed with bovine serum."
    },
    {
      id: "EVD-05",
      name: "Deleted WhatsApp Message (Vance's Phone)",
      category: "DIGITAL",
      location: "Digital Extraction",
      description: "Extracted from encrypted memory cache. Sent to unknown burner number at 21:18.",
      reliability: "A",
      details: "Message reads: 'It is done. Pen replaced. Cut power on signal.' Burner cell tower pings match valet Moreau's location."
    },
    {
      id: "EVD-06",
      name: "Offshore Bank Transfer Records",
      category: "FINANCIAL",
      location: "Victim's Laptop Cache",
      description: "$4.2M wire transfer from 'Cayman Horizon Ltd' to account controlled by Sterling & Victoria.",
      reliability: "B",
      details: "Unrelated Crime (Conspiracy C). Embezzlement slush fund for gambling debt repayment."
    },
    {
      id: "EVD-07",
      name: "Chloe's Secret Audio Tape",
      category: "DIGITAL",
      location: "Recorder in Chandelier",
      description: "High-sensitivity audio file recorded between 20:30 and 21:20.",
      reliability: "A",
      details: "At 21:14, victim is heard coughing violently: 'Vance... this ink... what did you touch?' followed by thud at 21:17."
    },
    {
      id: "EVD-08",
      name: "Fingerprints on Study Safe",
      category: "PHYSICAL",
      location: "Study Wall Safe",
      description: "Latent prints recovered from mechanical keypad dial.",
      reliability: "B",
      details: "Prints match Evelyn Reed. Digital safe log shows unlock timestamp of 21:35 (20 mins after murder)."
    },
    {
      id: "EVD-09",
      name: "Empty Pen Cartridge Foil Pack",
      category: "PHYSICAL",
      location: "Valet Quarters Locker",
      description: "Torn medical-grade foil packet labeled 'Toxin-X Cartridge Refill'.",
      reliability: "A",
      details: "Contains fingerprints belonging to Gabriel Moreau and partial thumbprint of Marcus Vance."
    },
    {
      id: "EVD-10",
      name: "Muddy Boot Prints (Size 9)",
      category: "PHYSICAL",
      location: "Study Terrace",
      description: "Soil impressions near French doors.",
      reliability: "C",
      details: "Matches Julian Thorne's footwear. Soil dryness indicates entry occurred at 20:55, prior to rainfall."
    }
  ],

  timelineEvents: [
    { time: "20:30", event: "Dinner party commences in Main Dining Room. All 8 suspects present.", location: "Main Dining Room", anomaly: false },
    { time: "20:40", event: "Dr. Finch conducts brief pre-dinner consultation with Lord Arthur in Study.", location: "Study", anomaly: false },
    { time: "20:50", event: "Julian Thorne arrives unannounced; seen arguing with security at gate.", location: "Main Gate", anomaly: false },
    { time: "21:00", event: "Lord Arthur retires to his Study. Valet Moreau brings coffee and pen refill set.", location: "Study", anomaly: false },
    { time: "21:05", event: "Chloe Bennett leaves Drawing Room under pretense of finding restroom.", location: "Drawing Room", anomaly: false },
    { time: "21:08", event: "Lady Victoria's phone syncs with Wi-Fi router in Study corridor.", location: "Study Corridor", anomaly: false },
    { time: "21:10", event: "CCTV Camera 2 outage begins (6-minute gap triggered by Inspector Sterling).", location: "Security Room", anomaly: true },
    { time: "21:12", event: "Lord Arthur signs document using poisoned Montblanc fountain pen.", location: "Study", anomaly: false },
    { time: "21:14", event: "Audio recording captures Lord Arthur's violent collapse and words to Vance.", location: "Study", anomaly: true },
    { time: "21:17", event: "Real-time Marcus Vance leaves West Wing (CCTV Camera 3 incorrectly logs 21:21 due to +4m drift).", location: "West Wing", anomaly: true },
    { time: "21:25", event: "Valet Moreau discovers Lord Arthur slumped over desk; raises alarm.", location: "Study", anomaly: false },
    { time: "21:35", event: "Evelyn Reed opens Study safe to retrieve 'Operation Blackwood' USB drive.", location: "Study", anomaly: false },
    { time: "22:00", event: "Police cordons established; Lead Investigator (Player) arrives on scene.", location: "Blackwood Manor", anomaly: false }
  ],

  floorPlanRooms: [
    { id: "study", name: "Lord Arthur's Study", status: "CRIME SCENE", items: ["EVD-01", "EVD-08"], cctv: "Cam 1 (Active)" },
    { id: "dining", name: "Main Dining Room", status: "SECURED", items: ["EVD-07"], cctv: "Cam 2 (Outage 21:10)" },
    { id: "security", name: "Security Control Room", status: "SECURED", items: ["EVD-02", "EVD-06"], cctv: "Cam 4 (Active)" },
    { id: "kitchen", name: "Main Kitchen", status: "CLEAR", items: [], cctv: "None" },
    { id: "valet_room", name: "Valet Quarters", status: "SEARCHED", items: ["EVD-09"], cctv: "None" },
    { id: "conservatory", name: "Conservatory", status: "CLEAR", items: [], cctv: "Cam 3 (+4m drift)" },
    { id: "garden", name: "Rear Garden Terrace", status: "SEARCHED", items: ["EVD-03", "EVD-10"], cctv: "Blind Spot" },
    { id: "master_bedroom", name: "Master Suite", status: "CLEAR", items: ["EVD-04"], cctv: "None" }
  ],

  forensicTests: [
    { id: "TEST-01", name: "Fountain Pen Ink Chromatography", cost: 800, timeHours: 4, itemRequired: "EVD-01", output: "Identifies synthetic neurotoxin 'VX-Derivative-9'. Fast-acting transdermal organophosphate." },
    { id: "TEST-02", name: "CCTV Clock Synchronization Audit", cost: 500, timeHours: 3, itemRequired: "EVD-02", output: "CRITICAL ANOMALY DETECTED: Camera 3 internal clock is fast by exactly +4 minutes 12 seconds." },
    { id: "TEST-03", name: "Syringe Residue & DNA Extraction", cost: 1000, timeHours: 6, itemRequired: "EVD-03", output: "Residue is standard insulin. Fingerprints wiped with isopropyl alcohol. Syringe was staged." },
    { id: "TEST-04", name: "Handkerchief Stain Spectrometry", cost: 600, timeHours: 3, itemRequired: "EVD-04", output: "Stain consists of food dye Red #40 and cellulose paste. Zero human blood present. Planted clue." },
    { id: "TEST-05", name: "Foil Pack Latent Print Recovery", cost: 1200, timeHours: 5, itemRequired: "EVD-09", output: "Definitive Match: Primary prints belong to Gabriel Moreau. Partial thumbprint matches Marcus Vance." }
  ]
};

window.CASE_DATA = CASE_DATA;
window.CASE_DATA_001 = CASE_DATA;
