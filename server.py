#!/usr/bin/env python3
import http.server
import socketserver
import json
import sqlite3
import hashlib
import secrets
import os
import urllib.parse
import urllib.request
from datetime import datetime

PORT = int(os.environ.get("PORT", 8000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
DB_FILE = os.path.join(BASE_DIR, "dci_database.db")

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def generate_detective_id():
    return f"DCI-26-{secrets.randbelow(899999) + 100000}"

def generate_room_code():
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    return "KLR-" + "".join(secrets.choice(chars) for _ in range(4))

GOOGLE_SHEET_WEBHOOK_URL = os.environ.get("GOOGLE_SHEET_WEBHOOK_URL", "")

def sync_to_google_sheet(det_data):
    if not GOOGLE_SHEET_WEBHOOK_URL:
        return
    try:
        payload = json.dumps({
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "detective_id": det_data.get("detective_id"),
            "callsign": det_data.get("callsign"),
            "display_name": det_data.get("display_name"),
            "email": det_data.get("email"),
            "internal_email": f"{det_data.get('callsign', 'detective').lower()}@dci.internal",
            "rank": det_data.get("rank", "CADET DETECTIVE"),
            "clearance_level": f"LEVEL 0{det_data.get('clearance_level', 1)}",
            "country": det_data.get("country", "Global Operations"),
            "style": det_data.get("style", "Analytical")
        }).encode('utf-8')

        req = urllib.request.Request(
            GOOGLE_SHEET_WEBHOOK_URL,
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        urllib.request.urlopen(req, timeout=3)
        print(f"[GOOGLE SHEET SYNC] Logged new detective {det_data.get('callsign')}")
    except Exception as e:
        print(f"[GOOGLE SHEET SYNC NOTICE] {e}")

DATABASE_URL = os.environ.get("DATABASE_URL", "")

class DBWrapper:
    def __init__(self):
        self.is_postgres = False
        if DATABASE_URL and ("postgres://" in DATABASE_URL or "postgresql://" in DATABASE_URL):
            try:
                import psycopg2
                clean_url = DATABASE_URL.split("?")[0]
                self.conn = psycopg2.connect(clean_url)
                self.conn.autocommit = True
                self.is_postgres = True
            except Exception as e:
                print(f"[DB WARN] Postgres connect failed, fallback SQLite: {e}")
                self.conn = sqlite3.connect(DB_FILE)
        else:
            self.conn = sqlite3.connect(DB_FILE)

    def execute(self, query, params=()):
        cursor = self.conn.cursor()
        q = query
        if self.is_postgres:
            q = q.replace("AUTOINCREMENT", "")
            q = q.replace("INTEGER PRIMARY KEY", "SERIAL PRIMARY KEY")
            q = q.replace("?", "%s")
        cursor.execute(q, params)
        return cursor

    def executemany(self, query, params_list):
        cursor = self.conn.cursor()
        q = query
        if self.is_postgres:
            q = q.replace("?", "%s")
        cursor.executemany(q, params_list)
        return cursor

    def commit(self):
        if not self.is_postgres:
            try:
                self.conn.commit()
            except Exception:
                pass

    def close(self):
        try:
            self.conn.close()
        except Exception:
            pass

def get_db():
    return DBWrapper()

def init_db():
    db = get_db()
    conn = db.conn
    cursor = db.conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            token TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS detectives (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            detective_id TEXT UNIQUE NOT NULL,
            callsign TEXT UNIQUE NOT NULL,
            display_name TEXT NOT NULL,
            country TEXT,
            style TEXT,
            rank TEXT DEFAULT 'CADET DETECTIVE',
            clearance_level INTEGER DEFAULT 1,
            xp INTEGER DEFAULT 0,
            reputation TEXT DEFAULT 'UNKNOWN',
            cases_solved INTEGER DEFAULT 0,
            cases_failed INTEGER DEFAULT 0,
            cases_completed_count INTEGER DEFAULT 0,
            wrongful_accusations INTEGER DEFAULT 0,
            evidence_accuracy INTEGER DEFAULT 100,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    try:
        cursor.execute("ALTER TABLE detectives ADD COLUMN cases_completed_count INTEGER DEFAULT 0")
    except Exception:
        pass


    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_id TEXT UNIQUE NOT NULL,
            case_number TEXT NOT NULL,
            title TEXT NOT NULL,
            classification TEXT NOT NULL,
            difficulty TEXT DEFAULT 'EXTREME',
            status TEXT DEFAULT 'AVAILABLE',
            required_clearance INTEGER DEFAULT 1,
            investigation_deadline_hours INTEGER DEFAULT 72,
            case_version TEXT DEFAULT '1.0',
            template_json TEXT NOT NULL,
            hidden_solution_json TEXT NOT NULL
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS case_rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id TEXT UNIQUE NOT NULL,
            room_code TEXT UNIQUE NOT NULL,
            case_id TEXT NOT NULL,
            host_detective_id TEXT NOT NULL,
            partner_detective_id TEXT,
            status TEXT DEFAULT 'WAITING',
            max_players INTEGER DEFAULT 2,
            current_game_time INTEGER DEFAULT 0,
            deadline_game_time INTEGER DEFAULT 4320,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            started_at TIMESTAMP,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS room_members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id TEXT NOT NULL,
            detective_id TEXT NOT NULL,
            role TEXT NOT NULL,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            connection_status TEXT DEFAULT 'ONLINE',
            UNIQUE(room_id, detective_id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS room_state (
            room_id TEXT PRIMARY KEY,
            discovered_evidence_json TEXT DEFAULT '[]',
            investigated_locations_json TEXT DEFAULT '[]',
            suspect_knowledge_json TEXT DEFAULT '{}',
            interrogation_history_json TEXT DEFAULT '{}',
            timeline_discoveries_json TEXT DEFAULT '[]',
            hypotheses_json TEXT DEFAULT '[]',
            private_notes_json TEXT DEFAULT '{}',
            shared_notes_json TEXT DEFAULT '[]',
            forensic_results_json TEXT DEFAULT '[]',
            actions_log_json TEXT DEFAULT '[]',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS investigation_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id TEXT NOT NULL,
            detective_id TEXT NOT NULL,
            event_type TEXT NOT NULL,
            event_data_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS detective_case_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            detective_id TEXT NOT NULL,
            case_id TEXT NOT NULL,
            room_id TEXT NOT NULL,
            outcome TEXT NOT NULL,
            score INTEGER NOT NULL,
            wrongful_accusation INTEGER DEFAULT 0,
            time_spent_minutes INTEGER DEFAULT 0,
            evidence_accuracy INTEGER DEFAULT 100,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS rank_promotion_rules (
            rank_level INTEGER PRIMARY KEY,
            rank_name TEXT NOT NULL,
            next_rank_name TEXT,
            required_cases_count INTEGER DEFAULT 3,
            minimum_success_rate INTEGER DEFAULT 60,
            minimum_evidence_accuracy INTEGER DEFAULT 60,
            minimum_xp INTEGER DEFAULT 500,
            max_wrongful_accusations INTEGER DEFAULT 1
        )
    ''')

    # Pre-seed Permanent Static Accounts if they don't exist
    static_accounts = [
        ('DEMO-OFFICER', 'Inspector Demo Officer', 'demo.officer@dci.internal', 'demo123', 'DCI-26-999999', 'SENIOR DETECTIVE', 4, 4500),
        ('ALEX', 'Alex Officer', 'alex@dci.internal', 'alex123', 'DCI-26-104224', 'CADET DETECTIVE', 1, 0),
        ('KRISHNA', 'Krishna Dabhi', 'krishna@dci.internal', '123456', 'DCI-26-684065', 'CADET DETECTIVE', 1, 0),
        ('KKK', 'Inspector KKK', 'kkk@dci.internal', '123456', 'DCI-26-180733', 'CADET DETECTIVE', 1, 0)
    ]
    for cs, name, em, pwd, det_id, rk, cl, xp in static_accounts:
        cursor.execute("SELECT id FROM detectives WHERE UPPER(callsign) = ? OR detective_id = ?", (cs, det_id))
        if not cursor.fetchone():
            p_hash = hash_password(pwd)
            t_tok = f"token_{cs.lower()}_123"
            cursor.execute("INSERT INTO users (email, password_hash, token) VALUES (?, ?, ?)", (em, p_hash, t_tok))
            u_id = cursor.lastrowid
            cursor.execute('''
                INSERT INTO detectives (user_id, detective_id, callsign, display_name, country, style, rank, clearance_level, xp, reputation)
                VALUES (?, ?, ?, ?, 'Global Operations', 'Analytical', ?, ?, ?, 'EXEMPLARY')
            ''', (u_id, det_id, cs, name, rk, cl, xp))

    # Seed Promotion Rules if empty
    cursor.execute("SELECT COUNT(*) FROM rank_promotion_rules")
    if cursor.fetchone()[0] == 0:
        rules = [
            (1, 'CADET DETECTIVE', 'JUNIOR INVESTIGATOR', 3, 60, 60, 500, 1),
            (2, 'JUNIOR INVESTIGATOR', 'INVESTIGATING OFFICER', 3, 65, 65, 1500, 1),
            (3, 'INVESTIGATING OFFICER', 'SENIOR DETECTIVE', 3, 70, 70, 3500, 1),
            (4, 'SENIOR DETECTIVE', 'LEAD INVESTIGATOR', 3, 75, 75, 7500, 0),
            (5, 'LEAD INVESTIGATOR', 'SPECIAL INVESTIGATIONS OFFICER', 3, 80, 80, 15000, 0),
            (6, 'SPECIAL INVESTIGATIONS OFFICER', 'CHIEF INVESTIGATOR', 3, 85, 85, 30000, 0),
            (7, 'CHIEF INVESTIGATOR', 'DIRECTOR OF INVESTIGATIONS', 3, 90, 90, 60000, 0),
            (8, 'DIRECTOR OF INVESTIGATIONS', None, 99, 95, 95, 120000, 0)
        ]
        cursor.executemany("INSERT INTO rank_promotion_rules VALUES (?,?,?,?,?,?,?,?)", rules)

    # Seed Cases if empty
    cursor.execute("SELECT COUNT(*) FROM cases")
    if cursor.fetchone()[0] == 0:
        seed_case_templates(cursor)

    conn.commit()
    conn.close()

def seed_case_templates(cursor):
    cases = [
        {
            "case_id": "CASE-DCI-001",
            "case_number": "DCI-26-001",
            "title": "Operation Blackwood: Secured Residence Homicide",
            "classification": "RESTRICTED",
            "difficulty": "EXTREME",
            "required_clearance": 1,
            "investigation_deadline_hours": 72,
            "template_json": json.dumps({
                "summary": "Lord Arthur Pendelton murdered inside locked estate study. 8 suspects, 3 conspiracies.",
                "victim": "Lord Arthur Pendelton (Minister of Energy)",
                "location": "Blackwood Manor Estate, Oxfordshire",
                "suspects_count": 8,
                "initial_evidence": ["EVD-01", "EVD-02", "EVD-03", "EVD-04"]
            }),
            "hidden_solution_json": json.dumps({
                "killer_id": "vance",
                "accomplice_id": "gabriel",
                "motive": "Defense Contract Veto & Corruption Exposure",
                "murder_method": "Synthetic Organophosphate Neurotoxin Pen Cartridge",
                "murder_location": "Lord Arthur's Study Desk",
                "time_window": "21:10 - 21:20",
                "cctv_drift_minutes": 4,
                "planted_evidence": ["EVD-03", "EVD-04"],
                "false_confession_suspect": "gabriel"
            })
        },
        {
            "case_id": "CASE-DCI-002",
            "case_number": "DCI-26-002",
            "title": "Disappearance at St. Jude's Academy",
            "classification": "RESTRICTED",
            "difficulty": "NORMAL",
            "required_clearance": 1,
            "investigation_deadline_hours": 48,
            "template_json": json.dumps({
                "summary": "Headmaster vanishes from boarding school grounds during stormy midnight lockup.",
                "victim": "Dr. Edward Sterling (Headmaster)",
                "location": "St. Jude's Academy, Wiltshire",
                "suspects_count": 4,
                "initial_evidence": ["EVD-01", "EVD-02"]
            }),
            "hidden_solution_json": json.dumps({
                "killer_id": "burch",
                "motive": "Blackmail Over Exam Tampering",
                "murder_method": "Blunt Force Trauma"
            })
        },
        {
            "case_id": "CASE-DCI-003",
            "case_number": "DCI-26-003",
            "title": "The Obsidian Syndicate Embezzlement & Homicide",
            "classification": "RESTRICTED",
            "difficulty": "HARD",
            "required_clearance": 1,
            "investigation_deadline_hours": 72,
            "template_json": json.dumps({
                "summary": "Financial auditor poisoned in penthouse suite during offshore banking audit.",
                "victim": "Clara Vance (Chief Auditor)",
                "location": "Vanguard Tower Penthouse, London",
                "suspects_count": 6,
                "initial_evidence": ["EVD-01", "EVD-02", "EVD-03"]
            }),
            "hidden_solution_json": json.dumps({
                "killer_id": "holloway",
                "motive": "Embezzlement Cover-up",
                "murder_method": "Potassium Cyanide in Wine"
            })
        },
        {
            "case_id": "CASE-DCI-004",
            "case_number": "DCI-26-004",
            "title": "Operation Midnight Sun Assassination",
            "classification": "CONFIDENTIAL",
            "difficulty": "EXTREME",
            "required_clearance": 2,
            "investigation_deadline_hours": 96,
            "template_json": json.dumps({
                "summary": "Diplomat assassinated during international treaty signing.",
                "victim": "Ambassador Alexei Volkov",
                "location": "Grand Embassy, Geneva",
                "suspects_count": 8,
                "initial_evidence": ["EVD-01", "EVD-02", "EVD-03", "EVD-04"]
            }),
            "hidden_solution_json": json.dumps({
                "killer_id": "dupont",
                "motive": "Treaty Sabotage",
                "murder_method": "Micro-dart Ricin Shot"
            })
        },
        {
            "case_id": "CASE-DCI-005",
            "case_number": "DCI-26-005",
            "title": "Ghost Protocol Cyber Homicide",
            "classification": "SECRET",
            "difficulty": "EXTREME",
            "required_clearance": 3,
            "investigation_deadline_hours": 72,
            "template_json": json.dumps({
                "summary": "Quantum computer researcher locked inside server room.",
                "victim": "Dr. Sarah Chen",
                "location": "Nexus Quantum Lab, Cambridge",
                "suspects_count": 7,
                "initial_evidence": ["EVD-01", "EVD-02"]
            }),
            "hidden_solution_json": json.dumps({
                "killer_id": "vector_x",
                "motive": "IP Theft & Corporate Espionage",
                "murder_method": "Argon Gas Hypoxia"
            })
        },
        {
            "case_id": "CASE-DCI-006",
            "case_number": "DCI-26-006",
            "title": "Project Omega Multi-Location Conspiracy",
            "classification": "TOP_SECRET",
            "difficulty": "EXTREME",
            "required_clearance": 4,
            "investigation_deadline_hours": 120,
            "template_json": json.dumps({
                "summary": "Simultaneous deaths across 3 international intelligence safehouses.",
                "victim": "Director Marcus Wright & Assets",
                "location": "London, Berlin, Vienna",
                "suspects_count": 10,
                "initial_evidence": ["EVD-01", "EVD-02", "EVD-03"]
            }),
            "hidden_solution_json": json.dumps({
                "killer_id": "shadow_syndicate",
                "motive": "Deep State Takeover",
                "murder_method": "Synchronized VX Nerve Agent"
            })
        }
    ]

    for c in cases:
        cursor.execute('''
            INSERT INTO cases (case_id, case_number, title, classification, difficulty, required_clearance, investigation_deadline_hours, template_json, hidden_solution_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (c["case_id"], c["case_number"], c["title"], c["classification"], c["difficulty"], c["required_clearance"], c["investigation_deadline_hours"], c["template_json"], c["hidden_solution_json"]))

init_db()

class DCIServerHandler(http.server.BaseHTTPRequestHandler):
    def translate_path(self, path):
        parsed = urllib.parse.urlparse(path)
        clean_path = parsed.path.lstrip('/')
        if not clean_path:
            clean_path = 'index.html'
        return os.path.join(STATIC_DIR, clean_path)

    def _send_json(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == "/api/check-callsign":
            callsign = query.get("callsign", [""])[0].strip().upper()
            if not callsign:
                return self._send_json({"error": "Callsign parameter missing"}, 400)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM detectives WHERE UPPER(callsign) = ?", (callsign,))
            exists = cursor.fetchone()
            conn.close()

            return self._send_json({"callsign": callsign, "available": exists is None})

        elif path == "/api/profile":
            auth_header = self.headers.get("Authorization", "")
            token = auth_header.replace("Bearer ", "").strip()
            if not token and "token" in query:
                token = query["token"][0]

            if not token:
                return self._send_json({"error": "Unauthorized: Missing token"}, 401)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT d.detective_id, d.callsign, d.display_name, d.country, d.style, 
                       d.rank, d.clearance_level, d.xp, d.reputation, d.cases_solved, d.cases_failed,
                       d.cases_completed_count, d.wrongful_accusations, d.evidence_accuracy, u.email
                FROM detectives d 
                JOIN users u ON d.user_id = u.id 
                WHERE u.token = ?
            ''', (token,))
            row = cursor.fetchone()
            conn.close()

            if not row:
                return self._send_json({"error": "Invalid or expired session token"}, 401)

            detective = {
                "detective_id": row[0],
                "callsign": row[1],
                "display_name": row[2],
                "country": row[3],
                "style": row[4],
                "rank": row[5],
                "clearance_level": row[6],
                "xp": row[7],
                "reputation": row[8],
                "cases_solved": row[9],
                "cases_failed": row[10],
                "cases_completed_count": row[11],
                "wrongful_accusations": row[12],
                "evidence_accuracy": row[13],
                "email": row[14]
            }
            return self._send_json({"detective": detective})

        elif path == "/api/cases":
            auth_header = self.headers.get("Authorization", "")
            token = auth_header.replace("Bearer ", "").strip()

            clearance = 1
            if token:
                conn = sqlite3.connect(DB_FILE)
                cursor = conn.cursor()
                cursor.execute("SELECT d.clearance_level FROM detectives d JOIN users u ON d.user_id = u.id WHERE u.token = ?", (token,))
                r = cursor.fetchone()
                if r: clearance = r[0]
                conn.close()

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT case_id, case_number, title, classification, difficulty, status, required_clearance, investigation_deadline_hours, template_json FROM cases")
            rows = cursor.fetchall()
            conn.close()

            case_list = []
            for row in rows:
                req_clear = row[6]
                is_accessible = can_access_case(clearance, req_clear)
                case_list.append({
                    "case_id": row[0],
                    "case_number": row[1],
                    "title": row[2],
                    "classification": row[3],
                    "difficulty": row[4],
                    "status": row[5],
                    "required_clearance": req_clear,
                    "investigation_deadline_hours": row[7],
                    "accessible": is_accessible,
                    "template": json.loads(row[8])
                })

            return self._send_json({"cases": case_list, "detective_clearance": clearance})

        elif path == "/api/cases/detail":
            case_id = query.get("id", [""])[0].strip()
            if not case_id:
                return self._send_json({"error": "Case ID required"}, 400)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT case_id, case_number, title, classification, difficulty, status, required_clearance, investigation_deadline_hours, template_json FROM cases WHERE case_id = ?", (case_id,))
            row = cursor.fetchone()
            conn.close()

            if not row:
                return self._send_json({"error": "Case not found"}, 404)

            return self._send_json({
                "case_id": row[0],
                "case_number": row[1],
                "title": row[2],
                "classification": row[3],
                "difficulty": row[4],
                "status": row[5],
                "required_clearance": row[6],
                "investigation_deadline_hours": row[7],
                "template": json.loads(row[8])
            })

        elif path == "/api/detective/promotion-status":
            auth_header = self.headers.get("Authorization", "")
            token = auth_header.replace("Bearer ", "").strip()
            if not token:
                return self._send_json({"error": "Unauthorized"}, 401)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT d.detective_id, d.rank, d.clearance_level, d.xp, d.cases_completed_count, d.cases_solved, d.cases_failed, d.wrongful_accusations, d.evidence_accuracy
                FROM detectives d JOIN users u ON d.user_id = u.id WHERE u.token = ?
            ''', (token,))
            det = cursor.fetchone()

            if not det:
                conn.close()
                return self._send_json({"error": "Detective not found"}, 404)

            cur_clearance = det[2]
            completed_cnt = det[4]
            solved_cnt = det[5]
            failed_cnt = det[6]
            wrongful_cnt = det[7]
            accuracy = det[8]
            xp = det[3]

            cursor.execute("SELECT rank_name, next_rank_name, required_cases_count, minimum_success_rate, minimum_evidence_accuracy, minimum_xp, max_wrongful_accusations FROM rank_promotion_rules WHERE rank_level = ?", (cur_clearance,))
            rule = cursor.fetchone()
            conn.close()

            if not rule or not rule[1]:
                return self._send_json({
                    "eligible": False,
                    "status": "MAXED_RANK",
                    "message": "REACHED MAXIMUM AGENCY RANK: DIRECTOR OF INVESTIGATIONS"
                })

            req_cases = rule[2]
            req_success_rate = rule[3]
            req_accuracy = rule[4]
            req_xp = rule[5]
            max_wrongful = rule[6]

            cases_modulo = completed_cnt % req_cases
            cases_remaining = req_cases - cases_modulo if cases_modulo != 0 else (0 if completed_cnt >= req_cases else req_cases)

            total_cases = max(1, solved_cnt + failed_cnt)
            success_rate = int((solved_cnt / total_cases) * 100)

            review_eligible = (completed_cnt > 0 and completed_cnt % req_cases == 0)
            meets_metrics = (success_rate >= req_success_rate and accuracy >= req_accuracy and xp >= req_xp and wrongful_cnt <= max_wrongful)

            status = "IN_PROGRESS"
            if review_eligible:
                status = "APPROVED" if meets_metrics else "DEFERRED"

            return self._send_json({
                "current_rank": det[1],
                "current_clearance": cur_clearance,
                "next_rank": rule[1],
                "cases_completed": completed_cnt,
                "required_cases_per_rank": req_cases,
                "cases_remaining_for_review": cases_remaining,
                "review_eligible": review_eligible,
                "promotion_status": status,
                "metrics": {
                    "xp": {"current": xp, "required": req_xp, "pass": xp >= req_xp},
                    "success_rate": {"current": success_rate, "required": req_success_rate, "pass": success_rate >= req_success_rate},
                    "evidence_accuracy": {"current": accuracy, "required": req_accuracy, "pass": accuracy >= req_accuracy},
                    "wrongful_accusations": {"current": wrongful_cnt, "max_allowed": max_wrongful, "pass": wrongful_cnt <= max_wrongful}
                }
            })

        elif path == "/api/rooms/state":
            code = query.get("code", [""])[0].strip().upper()
            if not code:
                return self._send_json({"error": "Room code missing"}, 400)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT r.room_id, r.room_code, r.case_id, r.host_detective_id, r.partner_detective_id, r.status, r.current_game_time, s.discovered_evidence_json, s.hypotheses_json, s.actions_log_json FROM case_rooms r LEFT JOIN room_state s ON r.room_id = s.room_id WHERE r.room_code = ?", (code,))
            row = cursor.fetchone()
            conn.close()

            if not row:
                return self._send_json({"error": "Room not found"}, 404)

            return self._send_json({
                "room_id": row[0],
                "room_code": row[1],
                "case_id": row[2],
                "host": row[3],
                "partner": row[4],
                "status": row[5],
                "current_game_time": row[6],
                "shared_state": {
                    "discovered_evidence": json.loads(row[7] if row[7] else "[]"),
                    "hypotheses": json.loads(row[8] if row[8] else "[]"),
                    "actions_log": json.loads(row[9] if row[9] else "[]")
                }
            })

        rel_path = path.lstrip('/')
        if not rel_path:
            rel_path = 'index.html'

        file_path = os.path.join(STATIC_DIR, rel_path)
        if os.path.isfile(file_path):
            content_type = "text/html"
            if file_path.endswith(".css"): content_type = "text/css"
            elif file_path.endswith(".js"): content_type = "application/javascript"
            elif file_path.endswith(".png"): content_type = "image/png"
            elif file_path.endswith(".jpg") or file_path.endswith(".jpeg"): content_type = "image/jpeg"

            try:
                with open(file_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header("Content-Type", content_type)
                self.send_header("Content-Length", str(len(content)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(content)
            except Exception as e:
                self.send_error(500, str(e))
        else:
            self.send_error(404, "File Not Found")

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get('Content-Length', 0))
        body_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        try:
            payload = json.loads(body_data)
        except Exception:
            payload = {}

        if path == "/api/register":
            callsign = payload.get("callsign", "").strip().upper()
            display_name = payload.get("display_name", "").strip()
            email = payload.get("email", "").strip().lower()
            password = payload.get("password", "").strip()
            country = payload.get("country", "Global Operations").strip()
            style = payload.get("style", "Analytical").strip()

            if not callsign or not display_name or not email or not password:
                return self._send_json({"error": "All required fields must be filled."}, 400)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()

            cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
            if cursor.fetchone():
                conn.close()
                return self._send_json({"error": "EMAIL ALREADY REGISTERED IN DCI DATABASE."}, 400)

            cursor.execute("SELECT id FROM detectives WHERE UPPER(callsign) = ?", (callsign,))
            if cursor.fetchone():
                conn.close()
                return self._send_json({"error": "CALLSIGN ALREADY ASSIGNED TO ANOTHER DETECTIVE."}, 400)

            token = secrets.token_hex(16)
            pwd_hash = hash_password(password)
            cursor.execute("INSERT INTO users (email, password_hash, token) VALUES (?, ?, ?)", (email, pwd_hash, token))
            user_id = cursor.lastrowid

            det_id = generate_detective_id()
            cursor.execute('''
                INSERT INTO detectives (user_id, detective_id, callsign, display_name, country, style, rank, clearance_level, xp, reputation)
                VALUES (?, ?, ?, ?, ?, ?, 'CADET DETECTIVE', 1, 0, 'UNKNOWN')
            ''', (user_id, det_id, callsign, display_name, country, style))

            conn.commit()
            conn.close()

            detective = {
                "detective_id": det_id,
                "callsign": callsign,
                "display_name": display_name,
                "country": country,
                "style": style,
                "rank": "CADET DETECTIVE",
                "clearance_level": 1,
                "xp": 0,
                "reputation": "UNKNOWN",
                "cases_solved": 0,
                "cases_failed": 0,
                "cases_completed_count": 0,
                "wrongful_accusations": 0,
                "evidence_accuracy": 100,
                "email": email
            }

            sync_to_google_sheet(detective)
            return self._send_json({"message": "PERSONNEL RECORD CREATED", "token": token, "detective": detective})

        elif path == "/api/login":
            login_id = payload.get("login_id", "").strip()
            password = payload.get("password", "").strip()

            if not login_id or not password:
                return self._send_json({"error": "Please enter credentials"}, 400)

            pwd_hash = hash_password(password)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()

            cursor.execute('''
                SELECT u.id, u.email, d.detective_id, d.callsign, d.display_name, d.country, d.style,
                       d.rank, d.clearance_level, d.xp, d.reputation, d.cases_solved, d.cases_failed,
                       d.cases_completed_count, d.wrongful_accusations, d.evidence_accuracy
                FROM users u
                JOIN detectives d ON d.user_id = u.id
                WHERE (u.email = ? OR UPPER(d.callsign) = ? OR d.detective_id = ?)
                  AND u.password_hash = ?
            ''', (login_id.lower(), login_id.upper(), login_id.upper(), pwd_hash))
            
            row = cursor.fetchone()
            if not row:
                conn.close()
                return self._send_json({"error": "AUTHENTICATION FAILED: INVALID CREDENTIALS"}, 401)

            user_id = row[0]
            token = secrets.token_hex(16)
            cursor.execute("UPDATE users SET token = ? WHERE id = ?", (token, user_id))
            conn.commit()
            conn.close()

            detective = {
                "detective_id": row[2],
                "callsign": row[3],
                "display_name": row[4],
                "country": row[5],
                "style": row[6],
                "rank": row[7],
                "clearance_level": row[8],
                "xp": row[9],
                "reputation": row[10],
                "cases_solved": row[11],
                "cases_failed": row[12],
                "cases_completed_count": row[13],
                "wrongful_accusations": row[14],
                "evidence_accuracy": row[15],
                "email": row[1]
            }

            return self._send_json({"message": "AUTHENTICATION SUCCESSFUL", "token": token, "detective": detective})

        elif path == "/api/rooms/create":
            host_det_id = payload.get("host_detective_id", "").strip()
            case_id = payload.get("case_id", "CASE-DCI-001").strip()

            if not host_det_id:
                return self._send_json({"error": "Host detective ID required"}, 400)

            room_id = f"ROOM-{secrets.token_hex(6)}"
            room_code = generate_room_code()
            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("INSERT INTO case_rooms (room_id, room_code, case_id, host_detective_id, status) VALUES (?, ?, ?, ?, 'WAITING')", (room_id, room_code, case_id, host_det_id))
            cursor.execute("INSERT INTO room_members (room_id, detective_id, role) VALUES (?, ?, 'LEAD_INVESTIGATOR')", (room_id, host_det_id))
            cursor.execute("INSERT INTO room_state (room_id) VALUES (?)", (room_id,))
            conn.commit()
            conn.close()

            return self._send_json({"room_id": room_id, "room_code": room_code, "host": host_det_id, "case_id": case_id})

        elif path == "/api/rooms/join":
            room_code = payload.get("room_code", "").strip().upper()
            partner_det_id = payload.get("partner_detective_id", "").strip()

            if not room_code or not partner_det_id:
                return self._send_json({"error": "Room code and detective ID required"}, 400)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT room_id, host_detective_id FROM case_rooms WHERE room_code = ?", (room_code,))
            row = cursor.fetchone()

            if not row:
                conn.close()
                return self._send_json({"error": "ROOM CODE NOT FOUND"}, 404)

            room_id = row[0]
            cursor.execute("UPDATE case_rooms SET partner_detective_id = ?, status = 'ACTIVE' WHERE room_id = ?", (partner_det_id, room_id))
            cursor.execute("INSERT OR REPLACE INTO room_members (room_id, detective_id, role) VALUES (?, ?, 'INVESTIGATIVE_PARTNER')", (room_id, partner_det_id))
            cursor.execute("INSERT INTO investigation_events (room_id, detective_id, event_type, event_data_json) VALUES (?, ?, 'PLAYER_JOINED', ?)", (room_id, partner_det_id, json.dumps({"partner_id": partner_det_id})))
            conn.commit()
            conn.close()

            return self._send_json({"message": "JOINED INVESTIGATION ROOM", "room_id": room_id, "room_code": room_code, "host": row[1]})

        elif path == "/api/detective/apply-promotion":
            auth_header = self.headers.get("Authorization", "")
            token = auth_header.replace("Bearer ", "").strip()
            if not token:
                return self._send_json({"error": "Unauthorized"}, 401)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT d.id, d.clearance_level, d.rank FROM detectives d JOIN users u ON d.user_id = u.id WHERE u.token = ?", (token,))
            det = cursor.fetchone()

            if not det:
                conn.close()
                return self._send_json({"error": "Detective not found"}, 404)

            cur_clearance = det[1]
            cursor.execute("SELECT rank_name, next_rank_name FROM rank_promotion_rules WHERE rank_level = ?", (cur_clearance,))
            rule = cursor.fetchone()

            if not rule or not rule[1]:
                conn.close()
                return self._send_json({"error": "Already at maximum rank"}, 400)

            new_rank = rule[1]
            new_clearance = cur_clearance + 1

            cursor.execute("UPDATE detectives SET rank = ?, clearance_level = ? WHERE id = ?", (new_rank, new_clearance, det[0]))
            conn.commit()
            conn.close()

            return self._send_json({
                "message": "PROMOTION APPROVED BY COMMAND",
                "new_rank": new_rank,
                "new_clearance_level": new_clearance
            })

        elif path == "/api/test/complete-case":
            auth_header = self.headers.get("Authorization", "")
            token = auth_header.replace("Bearer ", "").strip()
            outcome = payload.get("outcome", "SUCCESSFUL")
            score = payload.get("score", 85)

            if not token:
                return self._send_json({"error": "Unauthorized"}, 401)

            conn = sqlite3.connect(DB_FILE)
            cursor = conn.cursor()
            cursor.execute("SELECT d.id, d.detective_id, d.cases_completed_count, d.cases_solved, d.cases_failed, d.wrongful_accusations, d.xp FROM detectives d JOIN users u ON d.user_id = u.id WHERE u.token = ?", (token,))
            det = cursor.fetchone()

            if not det:
                conn.close()
                return self._send_json({"error": "Detective not found"}, 404)

            det_db_id, det_id, completed_cnt, solved_cnt, failed_cnt, wrongful_cnt, xp = det

            new_completed = completed_cnt + 1
            new_solved = solved_cnt + (1 if outcome in ["SUCCESSFUL", "PERFECT"] else 0)
            new_failed = failed_cnt + (1 if outcome in ["FAILED", "WRONGFUL_ACCUSATION"] else 0)
            new_wrongful = wrongful_cnt + (1 if outcome == "WRONGFUL_ACCUSATION" else 0)
            new_xp = xp + (score * 5)

            cursor.execute('''
                UPDATE detectives 
                SET cases_completed_count = ?, cases_solved = ?, cases_failed = ?, wrongful_accusations = ?, xp = ?
                WHERE id = ?
            ''', (new_completed, new_solved, new_failed, new_wrongful, new_xp, det_db_id))

            cursor.execute('''
                INSERT INTO detective_case_history (detective_id, case_id, room_id, outcome, score, wrongful_accusation)
                VALUES (?, 'CASE-DCI-001', 'ROOM-TEST', ?, ?, ?)
            ''', (det_id, outcome, score, 1 if outcome == "WRONGFUL_ACCUSATION" else 0))

            conn.commit()
            conn.close()

            return self._send_json({
                "message": "TEST CASE RECORDED",
                "cases_completed_count": new_completed,
                "cases_solved": new_solved,
                "xp": new_xp
            })

        return self._send_json({"error": "Endpoint not found"}, 404)

if __name__ == "__main__":
    print(f"==================================================")
    print(f"DIRECTORATE OF CRIMINAL INVESTIGATION (DCI) SERVER")
    print(f"SYSTEM STATUS: ONLINE (DEMO ACCOUNT & FULL API)")
    print(f"LISTENING ON: http://0.0.0.0:{PORT}")
    print(f"==================================================")
    socketserver.TCPServer.allow_reuse_address = True
    server = socketserver.ThreadingTCPServer(("0.0.0.0", PORT), DCIServerHandler)
    server.serve_forever()
