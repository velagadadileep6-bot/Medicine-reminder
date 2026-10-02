import http.server
import socketserver
import json
import sqlite3
import hashlib
import os
import urllib.parse
import sys
import time
from datetime import datetime

PORT = 8080
IS_VERCEL = 'VERCEL' in os.environ

if IS_VERCEL:
    DB_FILE = '/tmp/database.db'
else:
    DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')

def get_db_connection():
    if IS_VERCEL and not os.path.exists(DB_FILE):
        import shutil
        src_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')
        if os.path.exists(src_path):
            shutil.copy2(src_path, DB_FILE)
            
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password, salt=None):
    if salt is None:
        salt = os.urandom(16).hex()
    hashed = hashlib.sha256((password + salt).encode('utf-8')).hexdigest()
    return hashed, salt

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            mobile TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            blood_group TEXT,
            address TEXT,
            photo TEXT,
            emergency_contact TEXT,
            primary_doctor_id TEXT,
            doctor_phone TEXT
        )
    ''')
    
    # Medicines table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS medicines (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            dosage TEXT NOT NULL,
            times TEXT NOT NULL, -- JSON array of strings
            frequency TEXT NOT NULL,
            specific_days TEXT, -- JSON array of ints
            stock INTEGER,
            refill_alert_at INTEGER,
            instructions TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    # Appointments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            doctor_id TEXT,
            doctor_name TEXT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            purpose TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    # Logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            medicine_id TEXT NOT NULL,
            medicine_name TEXT NOT NULL,
            time TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL,
            dosage TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    # Settings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            user_id TEXT PRIMARY KEY,
            theme TEXT DEFAULT 'dark',
            font_size TEXT DEFAULT 'normal',
            speech_alerts INTEGER DEFAULT 1,
            high_contrast INTEGER DEFAULT 0,
            lang TEXT DEFAULT 'en',
            doctor_phone TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')

    # Health Tracker Logs table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS health_logs (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            sys INTEGER,
            dia INTEGER,
            sugar REAL,
            sugar_type TEXT,
            weight REAL,
            pulse INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    # Caregiver-Patient Mapping Table (Relational User ID linking)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS caregiver_patient (
            id TEXT PRIMARY KEY,
            caregiver_id TEXT NOT NULL,
            patient_id TEXT NOT NULL,
            relationship TEXT DEFAULT 'Caregiver',
            status TEXT NOT NULL DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (caregiver_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(caregiver_id, patient_id)
        )
    ''')

    # Indexed database queries for fast execution
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_cg_pt_caregiver ON caregiver_patient(caregiver_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_cg_pt_patient ON caregiver_patient(patient_id)')

    conn.commit()
    
    # Seed default Admin and Doctor if they don't exist
    cursor.execute("SELECT id FROM users WHERE role = 'admin'")
    if not cursor.fetchone():
        admin_pass_hash, admin_salt = hash_password('admin')
        cursor.execute('''
            INSERT INTO users (id, name, role, email, mobile, password_hash, salt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', ('admin_1', 'System Administrator', 'admin', 'admin@medicare.com', '0000000000', admin_pass_hash, admin_salt))
        
        # Seed settings for admin
        cursor.execute('INSERT INTO settings (user_id) VALUES (?)', ('admin_1',))
        
    cursor.execute("SELECT id FROM users WHERE role = 'doctor'")
    if not cursor.fetchone():
        doc_pass_hash, doc_salt = hash_password('doctor')
        cursor.execute('''
            INSERT INTO users (id, name, role, email, mobile, password_hash, salt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', ('doctor_1', 'Dr. Prasad', 'doctor', 'doctor@medicare.com', '9876543212', doc_pass_hash, doc_salt))
        
        # Seed settings for doctor
        cursor.execute('INSERT INTO settings (user_id, doctor_phone) VALUES (?, ?)', ('doctor_1', '9876543212'))

    cursor.execute("SELECT id FROM users WHERE role = 'caregiver'")
    if not cursor.fetchone():
        cg_pass_hash, cg_salt = hash_password('caregiver')
        cursor.execute('''
            INSERT INTO users (id, name, role, email, mobile, password_hash, salt, primary_doctor_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('caregiver_1', 'Ramesh Rao (Caregiver)', 'caregiver', 'caregiver@medicare.com', '9876543219', cg_pass_hash, cg_salt, 'patient@medicare.com'))
        
        # Seed settings for caregiver
        cursor.execute('INSERT INTO settings (user_id) VALUES (?)', ('caregiver_1',))

    cursor.execute("SELECT id FROM users WHERE role = 'patient'")
    if not cursor.fetchone():
        pat_pass_hash, pat_salt = hash_password('patient')
        cursor.execute('''
            INSERT INTO users (id, name, role, email, mobile, password_hash, salt, age, gender, blood_group, address, emergency_contact, primary_doctor_id, doctor_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('patient_1', 'Ram Rao', 'patient', 'patient@medicare.com', '9876543210', pat_pass_hash, pat_salt, 68, 'male', 'A+', 'Gandhi Nagar', '9876543211', 'Dr. Prasad', '9876543212'))
        
        # Seed settings for patient
        cursor.execute("INSERT INTO settings (user_id, lang, doctor_phone) VALUES (?, 'en', '9876543212')", ('patient_1',))
        
        # Seed default medicines for this patient so the track view looks awesome immediately!
        cursor.execute('''
            INSERT INTO medicines (id, user_id, name, type, dosage, times, frequency, stock, refill_alert_at, instructions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('med_seed_1', 'patient_1', 'Atorvastatin (Cholesterol)', 'tablet', '1 tablet (20mg)', '["21:00"]', 'daily', 28, 7, 'Take in evening before bedtime'))
        
        cursor.execute('''
            INSERT INTO medicines (id, user_id, name, type, dosage, times, frequency, stock, refill_alert_at, instructions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('med_seed_2', 'patient_1', 'Amoxicillin (Antibiotic)', 'capsule', '1 capsule (500mg)', '["08:00", "14:00", "20:00"]', 'daily', 6, 5, 'Take after eating food. Complete full course.'))

    # Seed caregiver_patient link for caregiver_1 -> patient_1
    cursor.execute("SELECT id FROM caregiver_patient WHERE caregiver_id = 'caregiver_1' AND patient_id = 'patient_1'")
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO caregiver_patient (id, caregiver_id, patient_id, relationship, status)
            VALUES ('cp_seed_1', 'caregiver_1', 'patient_1', 'Family Member', 'active')
        ''')
        
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

def get_user_login_payload(cursor, user):
    user_id = user['id']
    role = user['role']
    user_data = dict(user)
    user_data.pop('password_hash', None)
    user_data.pop('salt', None)
    
    # Medicines
    cursor.execute('SELECT * FROM medicines WHERE user_id = ?', (user_id,))
    meds = []
    for med_row in cursor.fetchall():
        med = dict(med_row)
        med['times'] = json.loads(med['times']) if isinstance(med['times'], str) else med['times']
        med['specificDays'] = json.loads(med['specific_days']) if med.get('specific_days') and isinstance(med['specific_days'], str) else []
        meds.append(med)
    
    # Appointments
    cursor.execute('SELECT * FROM appointments WHERE patient_id = ? OR doctor_id = ?', (user_id, user_id))
    appts = [dict(r) for r in cursor.fetchall()]
    
    # Logs
    cursor.execute('SELECT * FROM logs WHERE user_id = ?', (user_id,))
    logs = [dict(r) for r in cursor.fetchall()]
    
    # Settings
    cursor.execute('SELECT * FROM settings WHERE user_id = ?', (user_id,))
    settings_row = cursor.fetchone()
    set_data = dict(settings_row) if settings_row else {"theme": "dark", "lang": "en"}
    
    health_logs = []
    linked_patient = None
    linked_patient_settings = None

    if role == 'caregiver' and user.get('primary_doctor_id'):
        linked_identifier = str(user['primary_doctor_id']).strip().lower()
        cursor.execute('SELECT * FROM users WHERE (LOWER(email) = ? OR mobile = ?) AND role = \'patient\'', (linked_identifier, linked_identifier))
        p_row = cursor.fetchone()
        if p_row:
            p_dict = dict(p_row)
            p_dict.pop('password_hash', None)
            p_dict.pop('salt', None)
            linked_patient = p_dict
            p_id = linked_patient['id']
            
            cursor.execute('SELECT * FROM medicines WHERE user_id = ?', (p_id,))
            meds = []
            for med_row in cursor.fetchall():
                med = dict(med_row)
                med['times'] = json.loads(med['times']) if isinstance(med['times'], str) else med['times']
                med['specificDays'] = json.loads(med['specific_days']) if med.get('specific_days') and isinstance(med['specific_days'], str) else []
                meds.append(med)
                
            cursor.execute('SELECT * FROM appointments WHERE patient_id = ?', (p_id,))
            appts = [dict(r) for r in cursor.fetchall()]
            
            cursor.execute('SELECT * FROM logs WHERE user_id = ?', (p_id,))
            logs = [dict(r) for r in cursor.fetchall()]
            
            cursor.execute('SELECT * FROM settings WHERE user_id = ?', (p_id,))
            s_row = cursor.fetchone()
            linked_patient_settings = dict(s_row) if s_row else {"theme": "dark", "lang": "en"}
            
            cursor.execute('SELECT * FROM health_logs WHERE user_id = ?', (p_id,))
            for h_row in cursor.fetchall():
                h = dict(h_row)
                health_logs.append({
                    "id": h["id"],
                    "timestamp": h["timestamp"],
                    "date": h["date"],
                    "time": h["time"],
                    "bloodPressure": { "systolic": h["sys"], "diastolic": h["dia"] },
                    "bloodSugar": { "value": h["sugar"], "type": h["sugar_type"] },
                    "weight": h["weight"],
                    "pulse": h["pulse"]
                })
    else:
        cursor.execute('SELECT * FROM health_logs WHERE user_id = ?', (user_id,))
        for h_row in cursor.fetchall():
            h = dict(h_row)
            health_logs.append({
                "id": h["id"],
                "timestamp": h["timestamp"],
                "date": h["date"],
                "time": h["time"],
                "bloodPressure": { "systolic": h["sys"], "diastolic": h["dia"] },
                "bloodSugar": { "value": h["sugar"], "type": h["sugar_type"] },
                "weight": h["weight"],
                "pulse": h["pulse"]
            })

    return {
        "success": True,
        "user": user_data,
        "settings": set_data,
        "medicines": meds,
        "appointments": appts,
        "logs": logs,
        "healthLogs": health_logs,
        "linkedPatient": linked_patient,
        "linkedPatientSettings": linked_patient_settings
    }

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    
    def log_message(self, format, *args):
        # Override to log cleanly to stderr without cluttering terminal
        sys.stderr.write("%s - - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format%args))

    def translate_path(self, path):
        # Translate requested URL path to local file path
        target_path = super().translate_path(path)
        if os.path.exists(target_path) and not os.path.isdir(target_path):
            return target_path
            
        script_dir = os.path.dirname(os.path.abspath(__file__))
        clean_path = path.split('?')[0].lstrip('/')
        if not clean_path or clean_path == '/':
            clean_path = 'index.html'
            
        # Check root directory
        root_target = os.path.join(script_dir, clean_path)
        if os.path.exists(root_target):
            return root_target
            
        # Check parent directory (if running inside backend/)
        parent_target = os.path.join(os.path.dirname(script_dir), clean_path)
        if os.path.exists(parent_target):
            return parent_target

        # Check frontend/ directory
        frontend_target = os.path.join(script_dir, 'frontend', clean_path)
        if os.path.exists(frontend_target):
            return frontend_target

        # Check ../frontend/ directory
        parent_frontend_target = os.path.join(os.path.dirname(script_dir), 'frontend', clean_path)
        if os.path.exists(parent_frontend_target):
            return parent_frontend_target
            
        return target_path

    def end_headers(self):
        # Enable CORS for all local or external origins
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        if self.path.startswith('/api/'):
            self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self.end_headers()

    def do_GET(self):
        if self.path.startswith('/api/'):
            self.handle_api_get()
        else:
            # Fallback to serving static frontend files
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self.handle_api_post()
        else:
            self.send_error(404, "Not Found")

    def read_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length)
        return json.loads(body.decode('utf-8'))

    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def handle_api_get(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            if path == '/api/patients':
                # Get list of all registered patients
                cursor.execute('''
                    SELECT id, name, email, mobile, age, gender, blood_group, address, photo, emergency_contact, primary_doctor_id, doctor_phone
                    FROM users
                    WHERE role = 'patient'
                ''')
                patients = [dict(row) for row in cursor.fetchall()]
                
                # Fetch overall compliance percentage for each patient
                for p in patients:
                    cursor.execute("SELECT status FROM logs WHERE user_id = ?", (p['id'],))
                    p_logs = cursor.fetchall()
                    if p_logs:
                        taken = sum(1 for log in p_logs if log['status'] == 'taken')
                        p['adherence'] = round((taken / len(p_logs)) * 100)
                    else:
                        p['adherence'] = 0
                        
                    # Fetch streak
                    cursor.execute("SELECT id FROM logs WHERE user_id = ? AND status = 'taken'", (p['id'],))
                    p['streak'] = len(cursor.fetchall()) # Simple count streak
                
                self.send_json_response(patients)
                
            elif path == '/api/patient-details':
                patient_id = query.get('id', [None])[0]
                if not patient_id:
                    self.send_json_response({"error": "Missing patient ID"}, 400)
                    return
                
                # Get profile
                cursor.execute('SELECT * FROM users WHERE id = ? AND role = \'patient\'', (patient_id,))
                p_row = cursor.fetchone()
                if not p_row:
                    self.send_json_response({"error": "Patient not found"}, 404)
                    return
                patient = dict(p_row)
                patient.pop('password_hash', None)
                patient.pop('salt', None)
                
                # Get medicines
                cursor.execute('SELECT * FROM medicines WHERE user_id = ?', (patient_id,))
                meds = []
                for row in cursor.fetchall():
                    med = dict(row)
                    med['times'] = json.loads(med['times'])
                    med['specificDays'] = json.loads(med['specific_days']) if med.get('specific_days') else []
                    meds.append(med)
                
                # Get appointments
                cursor.execute('SELECT * FROM appointments WHERE patient_id = ?', (patient_id,))
                appts = [dict(row) for row in cursor.fetchall()]
                
                # Get logs
                cursor.execute('SELECT * FROM logs WHERE user_id = ?', (patient_id,))
                logs = [dict(row) for row in cursor.fetchall()]
                
                # Get health logs
                cursor.execute('SELECT * FROM health_logs WHERE user_id = ?', (patient_id,))
                health_logs = []
                for h_row in cursor.fetchall():
                    h = dict(h_row)
                    health_logs.append({
                        "id": h["id"],
                        "timestamp": h["timestamp"],
                        "date": h["date"],
                        "time": h["time"],
                        "bloodPressure": { "systolic": h["sys"], "diastolic": h["dia"] },
                        "bloodSugar": { "value": h["sugar"], "type": h["sugar_type"] },
                        "weight": h["weight"],
                        "pulse": h["pulse"]
                    })
                
                self.send_json_response({
                    "patient": patient,
                    "medicines": meds,
                    "appointments": appts,
                    "logs": logs,
                    "healthLogs": health_logs
                })
                
            elif path == '/api/caregiver/patients':
                caregiver_id = query.get('caregiver_id', [None])[0] or query.get('userId', [None])[0]
                if not caregiver_id:
                    self.send_json_response({"error": "Missing caregiver ID"}, 400)
                    return
                    
                cursor.execute('''
                    SELECT u.id, u.name, u.email, u.mobile, u.age, u.gender, u.blood_group, u.photo, u.emergency_contact, u.primary_doctor_id, u.doctor_phone, cp.relationship
                    FROM users u
                    JOIN caregiver_patient cp ON u.id = cp.patient_id
                    WHERE cp.caregiver_id = ? AND cp.status = 'active'
                ''', (caregiver_id,))
                
                patient_rows = cursor.fetchall()
                patient_cards = []
                today_str = datetime.now().strftime('%Y-%m-%d')
                
                for p_row in patient_rows:
                    p = dict(p_row)
                    p_id = p['id']
                    
                    cursor.execute('SELECT * FROM medicines WHERE user_id = ?', (p_id,))
                    meds = [dict(m) for m in cursor.fetchall()]
                    
                    cursor.execute('SELECT * FROM logs WHERE user_id = ?', (p_id,))
                    logs = [dict(l) for l in cursor.fetchall()]
                    
                    today_logs = [l for l in logs if l.get('date') == today_str]
                    taken_count = len([l for l in today_logs if l.get('status') == 'taken'])
                    missed_count = len([l for l in today_logs if l.get('status') in ['missed', 'skipped']])
                    
                    total_med_doses = 0
                    for m in meds:
                        t_val = m.get('times')
                        if isinstance(t_val, str):
                            try:
                                t_list = json.loads(t_val)
                            except Exception:
                                t_list = [t_val] if t_val else []
                        elif isinstance(t_val, list):
                            t_list = t_val
                        else:
                            t_list = []
                        total_med_doses += len(t_list)

                    pending_count = max(0, total_med_doses - (taken_count + missed_count))
                    
                    total_logged = len(logs)
                    total_taken = len([l for l in logs if l.get('status') == 'taken'])
                    adherence_pct = round((total_taken / total_logged * 100)) if total_logged > 0 else 100
                    
                    p['todayMedicines'] = total_med_doses
                    p['takenDoses'] = taken_count
                    p['missedDoses'] = missed_count
                    p['pendingDoses'] = pending_count
                    p['adherencePct'] = adherence_pct
                    p['medicinesCount'] = len(meds)
                    
                    patient_cards.append(p)
                    
                self.send_json_response({"success": True, "patients": patient_cards})

            elif path == '/api/caregiver/patient-detail':
                caregiver_id = query.get('caregiver_id', [None])[0] or query.get('userId', [None])[0]
                patient_id = query.get('patient_id', [None])[0] or query.get('id', [None])[0]
                
                if not caregiver_id or not patient_id:
                    self.send_json_response({"error": "Missing parameters"}, 400)
                    return
                    
                # SECURITY AUTHORIZATION CHECK: Ensure relationship exists
                cursor.execute('SELECT id FROM caregiver_patient WHERE caregiver_id = ? AND patient_id = ? AND status = \'active\'', (caregiver_id, patient_id))
                auth_check = cursor.fetchone()
                
                if not auth_check:
                    cursor.execute('SELECT id FROM users WHERE id = ? AND primary_doctor_id = (SELECT email FROM users WHERE id = ?)', (patient_id, caregiver_id))
                    auth_check = cursor.fetchone()
                    
                if not auth_check and caregiver_id != 'admin_1':
                    self.send_json_response({"error": "403 Forbidden: Unauthorized access to patient data."}, 403)
                    return
                    
                cursor.execute('SELECT id, name, role, email, mobile, age, gender, blood_group, address, photo, emergency_contact, primary_doctor_id, doctor_phone FROM users WHERE id = ?', (patient_id,))
                p_row = cursor.fetchone()
                if not p_row:
                    self.send_json_response({"error": "Patient not found"}, 404)
                    return
                    
                p_data = dict(p_row)
                
                cursor.execute('SELECT * FROM medicines WHERE user_id = ?', (patient_id,))
                meds = []
                for m in cursor.fetchall():
                    med = dict(m)
                    t_val = med.get('times')
                    if isinstance(t_val, str):
                        try:
                            med['times'] = json.loads(t_val)
                        except Exception:
                            med['times'] = [t_val] if t_val else []
                    elif not isinstance(t_val, list):
                        med['times'] = []
                    meds.append(med)
                    
                cursor.execute('SELECT * FROM appointments WHERE patient_id = ?', (patient_id,))
                appts = [dict(a) for a in cursor.fetchall()]
                
                cursor.execute('SELECT * FROM logs WHERE user_id = ? ORDER BY timestamp DESC', (patient_id,))
                logs = [dict(l) for l in cursor.fetchall()]
                
                cursor.execute('SELECT * FROM health_logs WHERE user_id = ? ORDER BY timestamp DESC', (patient_id,))
                vitals = []
                for h in cursor.fetchall():
                    h_dict = dict(h)
                    vitals.append({
                        "id": h_dict["id"],
                        "timestamp": h_dict["timestamp"],
                        "date": h_dict["date"],
                        "time": h_dict["time"],
                        "bloodPressure": { "systolic": h_dict["sys"], "diastolic": h_dict["dia"] },
                        "bloodSugar": { "value": h_dict["sugar"], "type": h_dict["sugar_type"] },
                        "weight": h_dict["weight"],
                        "pulse": h_dict["pulse"]
                    })
                    
                self.send_json_response({
                    "success": True,
                    "patient": p_data,
                    "medicines": meds,
                    "appointments": appts,
                    "logs": logs,
                    "healthLogs": vitals
                })
                
            elif path == '/api/admin/users':
                # Get all users (Admin only)
                cursor.execute('SELECT id, name, role, email, mobile FROM users')
                users = [dict(row) for row in cursor.fetchall()]
                self.send_json_response(users)
                
            else:
                self.send_json_response({"error": "Endpoint not found"}, 404)
                
        except Exception as e:
            self.send_json_response({"error": str(e)}, 500)
        finally:
            conn.close()

    def handle_api_post(self):
        path = self.path
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            body = self.read_json_body()
            
            if path == '/api/auth/register':
                name = body.get('name', '').strip()
                email = body.get('email', '').strip().lower()
                mobile = str(body.get('mobile', '')).strip()
                password = body.get('password')
                role = body.get('role', 'patient')
                
                if not name or not password or (not email and not mobile):
                    self.send_json_response({"error": "Please enter Name, Password and either Email or Mobile number!"}, 400)
                    return
                
                # Check duplicate
                if email and mobile:
                    cursor.execute('SELECT id FROM users WHERE (LOWER(email) = ? AND email != "") OR (mobile = ? AND mobile != "")', (email, mobile))
                elif email:
                    cursor.execute('SELECT id FROM users WHERE LOWER(email) = ? AND email != ""', (email,))
                else:
                    cursor.execute('SELECT id FROM users WHERE mobile = ? AND mobile != ""', (mobile,))

                if cursor.fetchone():
                    self.send_json_response({"error": "Email or mobile number already registered!"}, 400)
                    return
                
                pass_hash, salt = hash_password(password)
                seed_str = email or mobile or name
                user_id = f"{role}_{int(hashlib.md5(seed_str.encode()).hexdigest(), 16) % 10000000}"
                
                cursor.execute('''
                    INSERT INTO users (id, name, role, email, mobile, password_hash, salt, age, gender, blood_group, address, photo, emergency_contact, primary_doctor_id, doctor_phone)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    user_id, name, role, email, mobile, pass_hash, salt,
                    body.get('age'), body.get('gender'), body.get('blood'),
                    body.get('address'), body.get('photo'), body.get('emergency'),
                    body.get('primaryDoctorId'), body.get('doctorPhone')
                ))
                
                # Create settings
                cursor.execute('''
                    INSERT INTO settings (user_id, lang, doctor_phone)
                    VALUES (?, ?, ?)
                ''', (user_id, body.get('lang', 'en'), body.get('doctorPhone', '')))
                
                conn.commit()
                
                # Load new user details
                cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
                user_data = dict(cursor.fetchone())
                user_data.pop('password_hash', None)
                user_data.pop('salt', None)
                
                # Fetch settings
                cursor.execute('SELECT * FROM settings WHERE user_id = ?', (user_id,))
                set_data = dict(cursor.fetchone())
                
                health_logs = []
                linked_patient = None
                linked_patient_settings = None
                meds = []
                appts = []
                logs = []

                if role == 'caregiver' and user_data.get('primary_doctor_id'):
                    linked_identifier = user_data['primary_doctor_id']
                    cursor.execute('SELECT * FROM users WHERE (email = ? OR mobile = ?) AND role = \'patient\'', (linked_identifier, linked_identifier))
                    p_row = cursor.fetchone()
                    if p_row:
                        p_dict = dict(p_row)
                        p_dict.pop('password_hash', None)
                        p_dict.pop('salt', None)
                        linked_patient = p_dict
                        p_id = linked_patient['id']
                        
                        cursor.execute('SELECT * FROM medicines WHERE user_id = ?', (p_id,))
                        for med_row in cursor.fetchall():
                            med = dict(med_row)
                            med['times'] = json.loads(med['times'])
                            med['specificDays'] = json.loads(med['specific_days']) if med.get('specific_days') else []
                            meds.append(med)
                            
                        cursor.execute('SELECT * FROM appointments WHERE patient_id = ?', (p_id,))
                        appts = [dict(r) for r in cursor.fetchall()]
                        
                        cursor.execute('SELECT * FROM logs WHERE user_id = ?', (p_id,))
                        logs = [dict(r) for r in cursor.fetchall()]
                        
                        cursor.execute('SELECT * FROM settings WHERE user_id = ?', (p_id,))
                        s_row = cursor.fetchone()
                        linked_patient_settings = dict(s_row) if s_row else {"theme": "dark", "lang": "en"}
                        
                        cursor.execute('SELECT * FROM health_logs WHERE user_id = ?', (p_id,))
                        for h_row in cursor.fetchall():
                            h = dict(h_row)
                            health_logs.append({
                                "id": h["id"],
                                "timestamp": h["timestamp"],
                                "date": h["date"],
                                "time": h["time"],
                                "bloodPressure": { "systolic": h["sys"], "diastolic": h["dia"] },
                                "bloodSugar": { "value": h["sugar"], "type": h["sugar_type"] },
                                "weight": h["weight"],
                                "pulse": h["pulse"]
                            })

                self.send_json_response({
                    "success": True,
                    "user": user_data,
                    "settings": set_data,
                    "medicines": meds,
                    "appointments": appts,
                    "logs": logs,
                    "healthLogs": health_logs,
                    "linkedPatient": linked_patient,
                    "linkedPatientSettings": linked_patient_settings
                })
                
            elif path == '/api/auth/login':
                identifier = body.get('identifier', '').strip()
                if '@' in identifier:
                    identifier = identifier.lower().strip()
                password = body.get('password')
                role = body.get('role', 'patient')
                
                if not identifier or not password:
                    print(f"[LOGIN DEBUG] Missing credentials: identifier={identifier}")
                    self.send_json_response({"error": "Missing credentials"}, 400)
                    return
                
                print(f"[LOGIN DEBUG] Attempting login: identifier={identifier}, role={role}")
                cursor.execute('SELECT * FROM users WHERE (LOWER(email) = LOWER(?) OR mobile = ?) AND role = ?', (identifier, identifier, role))
                row = cursor.fetchone()
                if not row:
                    # Fallback lookup without role filter
                    cursor.execute('SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR mobile = ?', (identifier, identifier))
                    row = cursor.fetchone()
                
                if not row:
                    print(f"[LOGIN DEBUG] No user found with identifier={identifier}")
                    self.send_json_response({"error": "Invalid email/mobile, password, or role!"}, 400)
                    return
                
                user = dict(row)
                target_hash, _ = hash_password(password, user['salt'])
                
                if target_hash != user['password_hash']:
                    print(f"[LOGIN DEBUG] Hash mismatch for user {user['id']}!")
                    self.send_json_response({"error": "Invalid email/mobile, password, or role!"}, 400)
                    return
                
                payload = self.get_user_login_payload(cursor, user)
                self.send_json_response(payload)

            elif path in ('/api/auth/google-login', '/api/auth/google', '/api/auth/google-login/', '/api/auth/google/'):
                email = body.get('email', '').strip().lower()
                name = body.get('name', 'User')
                photo = body.get('photo')
                role = body.get('role', 'patient')
                
                if not email:
                    self.send_json_response({"error": "Missing email from Google Sign-In"}, 400)
                    return
                
                cursor.execute('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', (email,))
                row = cursor.fetchone()
                
                if not row:
                    # Auto-register new Google user
                    user_id = f"{role}_{int(hashlib.md5(email.encode()).hexdigest(), 16) % 10000000}"
                    pass_hash, salt = hash_password(os.urandom(8).hex())
                    cursor.execute('''
                        INSERT INTO users (id, name, role, email, mobile, password_hash, salt, photo)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (user_id, name, role, email, '', pass_hash, salt, photo))
                    cursor.execute('INSERT INTO settings (user_id) VALUES (?)', (user_id,))
                    conn.commit()
                    
                    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
                    row = cursor.fetchone()
                
                user = dict(row)
                payload = self.get_user_login_payload(cursor, user)
                self.send_json_response(payload)
                
                # Load associated data
                # Medicines
                cursor.execute('SELECT * FROM medicines WHERE user_id = ?', (user_id,))
                meds = []
                for med_row in cursor.fetchall():
                    med = dict(med_row)
                    med['times'] = json.loads(med['times'])
                    med['specificDays'] = json.loads(med['specific_days']) if med.get('specific_days') else []
                    meds.append(med)
                
                # Appointments
                cursor.execute('SELECT * FROM appointments WHERE patient_id = ? OR doctor_id = ?', (user_id, user_id))
                appts = [dict(r) for r in cursor.fetchall()]
                
                # Logs
                cursor.execute('SELECT * FROM logs WHERE user_id = ?', (user_id,))
                logs = [dict(r) for r in cursor.fetchall()]
                
                # Settings
                cursor.execute('SELECT * FROM settings WHERE user_id = ?', (user_id,))
                settings_row = cursor.fetchone()
                set_data = dict(settings_row) if settings_row else {"theme": "dark", "lang": "en"}
                
                health_logs = []
                linked_patient = None
                linked_patient_settings = None

                if role == 'caregiver' and user.get('primary_doctor_id'):
                    linked_identifier = user['primary_doctor_id']
                    cursor.execute('SELECT * FROM users WHERE (email = ? OR mobile = ?) AND role = \'patient\'', (linked_identifier, linked_identifier))
                    p_row = cursor.fetchone()
                    if p_row:
                        p_dict = dict(p_row)
                        p_dict.pop('password_hash', None)
                        p_dict.pop('salt', None)
                        linked_patient = p_dict
                        p_id = linked_patient['id']
                        
                        cursor.execute('SELECT * FROM medicines WHERE user_id = ?', (p_id,))
                        meds = []
                        for med_row in cursor.fetchall():
                            med = dict(med_row)
                            med['times'] = json.loads(med['times'])
                            med['specificDays'] = json.loads(med['specific_days']) if med.get('specific_days') else []
                            meds.append(med)
                            
                        cursor.execute('SELECT * FROM appointments WHERE patient_id = ?', (p_id,))
                        appts = [dict(r) for r in cursor.fetchall()]
                        
                        cursor.execute('SELECT * FROM logs WHERE user_id = ?', (p_id,))
                        logs = [dict(r) for r in cursor.fetchall()]
                        
                        cursor.execute('SELECT * FROM settings WHERE user_id = ?', (p_id,))
                        s_row = cursor.fetchone()
                        linked_patient_settings = dict(s_row) if s_row else {"theme": "dark", "lang": "en"}
                        
                        cursor.execute('SELECT * FROM health_logs WHERE user_id = ?', (p_id,))
                        for h_row in cursor.fetchall():
                            h = dict(h_row)
                            health_logs.append({
                                "id": h["id"],
                                "timestamp": h["timestamp"],
                                "date": h["date"],
                                "time": h["time"],
                                "bloodPressure": { "systolic": h["sys"], "diastolic": h["dia"] },
                                "bloodSugar": { "value": h["sugar"], "type": h["sugar_type"] },
                                "weight": h["weight"],
                                "pulse": h["pulse"]
                            })
                else:
                    # If patient
                    cursor.execute('SELECT * FROM health_logs WHERE user_id = ?', (user_id,))
                    for h_row in cursor.fetchall():
                        h = dict(h_row)
                        health_logs.append({
                            "id": h["id"],
                            "timestamp": h["timestamp"],
                            "date": h["date"],
                            "time": h["time"],
                            "bloodPressure": { "systolic": h["sys"], "diastolic": h["dia"] },
                            "bloodSugar": { "value": h["sugar"], "type": h["sugar_type"] },
                            "weight": h["weight"],
                            "pulse": h["pulse"]
                        })

                self.send_json_response({
                    "success": True,
                    "user": user,
                    "settings": set_data,
                    "medicines": meds,
                    "appointments": appts,
                    "logs": logs,
                    "healthLogs": health_logs,
                    "linkedPatient": linked_patient,
                    "linkedPatientSettings": linked_patient_settings
                })
                
            elif path == '/api/state/save':
                user_id = body.get('userId')
                if not user_id:
                    self.send_json_response({"error": "Missing user ID"}, 400)
                    return
                
                # 1. Update Profile Fields (photo, doctorPhone) if sent
                profile = body.get('profile')
                if profile:
                    cursor.execute('''
                        UPDATE users
                        SET name = ?, age = ?, gender = ?, blood_group = ?, address = ?, photo = ?, emergency_contact = ?, primary_doctor_id = ?, doctor_phone = ?
                        WHERE id = ?
                    ''', (
                        profile.get('name'), profile.get('age'), profile.get('gender'),
                        profile.get('blood'), profile.get('address'), profile.get('photo'),
                        profile.get('emergency'), profile.get('primaryDoctorId'), profile.get('doctorPhone'), user_id
                    ))
                
                # 2. Sync Medicines
                medicines = body.get('medicines')
                if medicines is not None:
                    # Clear old ones
                    cursor.execute('DELETE FROM medicines WHERE user_id = ?', (user_id,))
                    for m in medicines:
                        cursor.execute('''
                            INSERT INTO medicines (id, user_id, name, type, dosage, times, frequency, specific_days, stock, refill_alert_at, instructions)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ''', (
                            m.get('id'), user_id, m.get('name'), m.get('type'), m.get('dosage'),
                            json.dumps(m.get('times', [])), m.get('frequency'),
                            json.dumps(m.get('specificDays', [])), m.get('stock', 0),
                            m.get('refillAlertAt', 5), m.get('instructions', '')
                        ))
                
                # 3. Sync Appointments
                appointments = body.get('appointments')
                if appointments is not None:
                    # Clear old ones
                    cursor.execute('DELETE FROM appointments WHERE patient_id = ?', (user_id,))
                    for a in appointments:
                        cursor.execute('''
                            INSERT INTO appointments (id, patient_id, doctor_id, doctor_name, date, time, purpose, status)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        ''', (
                            a.get('id'), user_id, a.get('doctorId'), a.get('doctorName'),
                            a.get('date') or '', a.get('time') or '', a.get('purpose'), a.get('status') or 'pending'
                        ))
                
                # 4. Sync Logs
                logs = body.get('logs')
                if logs is not None:
                    # Clear old ones
                    cursor.execute('DELETE FROM logs WHERE user_id = ?', (user_id,))
                    for l in logs:
                        cursor.execute('''
                            INSERT INTO logs (id, user_id, medicine_id, medicine_name, time, date, status, dosage, timestamp)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ''', (
                            l.get('id'), user_id, l.get('medicineId') or '', l.get('medicineName') or 'Medicine',
                            l.get('time') or '00:00', l.get('date') or '', l.get('status') or 'taken',
                            l.get('dosage') or '', l.get('timestamp') or 0
                        ))
                
                # 5. Sync Settings
                settings = body.get('settings')
                if settings is not None:
                    cursor.execute('DELETE FROM settings WHERE user_id = ?', (user_id,))
                    cursor.execute('''
                        INSERT INTO settings (user_id, theme, font_size, speech_alerts, high_contrast, lang, doctor_phone)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        user_id, settings.get('theme', 'dark'), settings.get('fontSize', 'normal'),
                        1 if settings.get('speechAlerts', True) else 0,
                        1 if settings.get('highContrast', False) else 0,
                        settings.get('lang', 'en'), settings.get('doctorPhone', '')
                    ))
                
                # 6. Sync Health Logs
                health_logs = body.get('healthLogs')
                if health_logs is not None:
                    cursor.execute('DELETE FROM health_logs WHERE user_id = ?', (user_id,))
                    for h in health_logs:
                        bp = h.get('bloodPressure') or {}
                        sugar = h.get('bloodSugar') or {}
                        cursor.execute('''
                            INSERT INTO health_logs (id, user_id, timestamp, date, time, sys, dia, sugar, sugar_type, weight, pulse)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        ''', (
                            h.get('id'), user_id, h.get('timestamp'), h.get('date'), h.get('time'),
                            bp.get('systolic'), bp.get('diastolic'),
                            sugar.get('value'), sugar.get('type'),
                            h.get('weight'), h.get('pulse')
                        ))
                
                conn.commit()
                self.send_json_response({"success": True})
                
            elif path == '/api/caregiver/link-patient':
                caregiver_id = body.get('caregiver_id') or body.get('caregiverId') or body.get('userId')
                target_id = body.get('target_id') or body.get('patientIdentifier') or body.get('patientId') or body.get('email') or body.get('mobile')
                if not caregiver_id or not target_id:
                    self.send_json_response({"error": "Please enter a valid Patient Email or Mobile Number!"}, 400)
                    return
                    
                target_clean = str(target_id).strip().lower()
                cursor.execute('''
                    SELECT id, name, email, mobile, age, gender, blood_group, photo, emergency_contact, primary_doctor_id, doctor_phone
                    FROM users
                    WHERE LOWER(id) = ? OR LOWER(email) = ? OR mobile = ?
                ''', (target_clean, target_clean, str(target_id).strip()))
                p_row = cursor.fetchone()
                
                if p_row:
                    p_data = dict(p_row)
                    patient_id = p_data['id']
                    # Ensure role is set to patient
                    cursor.execute("UPDATE users SET role = 'patient' WHERE id = ?", (patient_id,))
                else:
                    # Auto-provision new patient profile if not existing yet
                    patient_id = f"patient_{int(datetime.now().timestamp() * 1000)}"
                    is_email = '@' in target_clean
                    email_val = target_clean if is_email else ''
                    mobile_val = str(target_id).strip() if not is_email else ''
                    name_part = target_clean.split('@')[0] if is_email else target_clean
                    name_val = name_part.replace('.', ' ').replace('_', ' ').replace('-', ' ').title()
                    
                    cursor.execute('''
                        INSERT INTO users (id, name, role, email, mobile, password_hash, salt, age, gender, blood_group, address, emergency_contact, primary_doctor_id, doctor_phone)
                        VALUES (?, ?, 'patient', ?, ?, '', '', 65, 'male', 'A+', 'Home Address', '9876543210', ?, '9876543212')
                    ''', (patient_id, name_val or 'Patient User', email_val, mobile_val, caregiver_id))
                    
                    cursor.execute('''
                        INSERT INTO settings (user_id, lang, doctor_phone)
                        VALUES (?, 'en', '9876543212')
                    ''', (patient_id,))
                    
                    # Seed initial medicine for auto-created patient
                    cursor.execute('''
                        INSERT INTO medicines (id, user_id, name, type, dosage, times, frequency, stock, refill_alert_at, instructions)
                        VALUES (?, ?, ?, 'tablet', '1 tablet (500mg)', '["09:00"]', 'daily', 30, 7, 'Take in morning with food')
                    ''', (f"med_{int(datetime.now().timestamp())}", patient_id, 'Daily Multi-Vitamin'))
                    
                    cursor.execute('SELECT id, name, email, mobile, age, gender, blood_group, photo, emergency_contact, primary_doctor_id, doctor_phone FROM users WHERE id = ?', (patient_id,))
                    p_data = dict(cursor.fetchone())

                link_id = f"cp_{int(datetime.now().timestamp())}"
                cursor.execute('''
                    INSERT OR REPLACE INTO caregiver_patient (id, caregiver_id, patient_id, relationship, status)
                    VALUES (?, ?, ?, 'Family Member', 'active')
                ''', (link_id, caregiver_id, patient_id))
                
                conn.commit()
                self.send_json_response({"success": True, "message": "Patient linked successfully", "patient": p_data, "linkedPatient": p_data})
                
            elif path == '/api/admin/users/create':
                # Create a user (Admin only)
                name = body.get('name')
                email = body.get('email')
                mobile = body.get('mobile')
                password = body.get('password')
                role = body.get('role', 'patient')
                
                if not name or not email or not mobile or not password:
                    self.send_json_response({"error": "Missing required fields"}, 400)
                    return
                
                cursor.execute('SELECT id FROM users WHERE email = ? OR mobile = ?', (email, mobile))
                if cursor.fetchone():
                    self.send_json_response({"error": "Email or mobile already registered!"}, 400)
                    return
                
                pass_hash, salt = hash_password(password)
                user_id = f"{role}_{int(hashlib.md5(email.encode()).hexdigest(), 16) % 10000000}"
                
                cursor.execute('''
                    INSERT INTO users (id, name, role, email, mobile, password_hash, salt)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (user_id, name, role, email, mobile, pass_hash, salt))
                
                cursor.execute('INSERT INTO settings (user_id) VALUES (?)', (user_id,))
                conn.commit()
                
                self.send_json_response({"success": True, "userId": user_id})
                
            elif path == '/api/admin/users/delete':
                # Delete a user (Admin only)
                user_id = body.get('userId')
                if not user_id:
                    self.send_json_response({"error": "Missing user ID"}, 400)
                    return
                
                if user_id == 'admin_1':
                    self.send_json_response({"error": "Cannot delete primary admin account!"}, 400)
                    return
                
                cursor.execute('DELETE FROM users WHERE id = ?', (user_id,))
                cursor.execute('DELETE FROM medicines WHERE user_id = ?', (user_id,))
                cursor.execute('DELETE FROM appointments WHERE patient_id = ? OR doctor_id = ?', (user_id, user_id))
                cursor.execute('DELETE FROM logs WHERE user_id = ?', (user_id,))
                cursor.execute('DELETE FROM settings WHERE user_id = ?', (user_id,))
                
                conn.commit()
                self.send_json_response({"success": True})
                
            else:
                self.send_json_response({"error": "Endpoint not found"}, 404)
                
        except Exception as e:
            import traceback
            traceback.print_exc()
            self.send_json_response({"error": str(e)}, 500)
        finally:
            conn.close()

if __name__ == '__main__':
    # Initialize the database file
    init_db()
    
    ports_to_try = [8080, 5000, 8000, 3000]
    httpd = None
    chosen_port = PORT

    for p in ports_to_try:
        try:
            socketserver.TCPServer.allow_reuse_address = True
            httpd = socketserver.TCPServer(("0.0.0.0", p), CustomHTTPRequestHandler)
            chosen_port = p
            break
        except OSError:
            continue

    if not httpd:
        print("[ERROR] Could not bind to any port (8080, 5000, 8000, 3000). Ensure ports are free.")
        sys.exit(1)

    print("====================================================================")
    print(" [SERVER RUNNING] MEDICINE REMINDER FULL-STACK SERVER IS READY!")
    print(f" -> Open in Web Browser: http://localhost:{chosen_port}")
    print(f" -> Alternative IP:      http://127.0.0.1:{chosen_port}")
    print("====================================================================")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down backend...")
        httpd.server_close()
