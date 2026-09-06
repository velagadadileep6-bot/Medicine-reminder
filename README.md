# 💊 Medicine Reminder App & Healthcare Management System

[![Live Demo](https://img.shields.io/badge/Demo-Vercel%20Live-brightgreen?style=for-the-badge&logo=vercel)](https://medicine-reminder-navy-phi.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Python%20Native%20HTTP-blue?style=for-the-badge&logo=python)](https://medicine-reminder-navy-phi.vercel.app)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%2F%20CSS3%20%2F%20ES6+-orange?style=for-the-badge&logo=javascript)](https://medicine-reminder-navy-phi.vercel.app)
[![Database](https://img.shields.io/badge/Database-SQLite3-lightgrey?style=for-the-badge&logo=sqlite)](https://medicine-reminder-navy-phi.vercel.app)

> **Live Application URL:** [https://medicine-reminder-navy-phi.vercel.app](https://medicine-reminder-navy-phi.vercel.app)  
> **Project Guide:** G. Bhagya Lakshmi

---

## 📋 Table of Contents
1. [Project Overview & Abstract](#-project-overview--abstract)
2. [Problem Statement](#-problem-statement)
3. [Key Features & Capabilities](#-key-features--capabilities)
4. [Architecture & System Flow](#-architecture--system-flow)
5. [Tech Stack Breakdown](#-tech-stack-breakdown)
6. [Code Structure & segregation](#-code-structure--segregation)
7. [API Endpoints Reference](#-api-endpoints-reference)
8. [Local Setup & Deployment](#-local-setup--deployment)
9. [Author & Guide Acknowledgments](#-author--guide-acknowledgments)

---

## 📌 Project Overview & Abstract
The **Medicine Reminder App** is a full-stack, responsive healthcare management application designed to assist patients, senior citizens, caregivers, and medical practitioners in managing daily medication routines and tracking health metrics.

Many patients miss or mismanage their medication doses due to busy schedules, complex prescriptions, or cognitive decline. This application resolves these critical healthcare challenges by providing real-time voice-synthesized alerts in multiple languages (**English, Hindi, Telugu**), automated dosage tracking, doctor appointment management, caregiver alerts, and vital health sign logs (Blood Pressure, Sugar, Pulse, Weight).

---

## ❓ Problem Statement
Many individuals forget to take their medicines on time due to hectic routines, old age, or memory impairments. Missing or delaying prescribed medicines can lead to severe health complications, treatment failures, and avoidable hospitalizations. Patients require an intuitive, accessible system that provides timely reminders, voice alerts, and caregiver monitoring to ensure continuous treatment adherence.

---

## ✨ Key Features & Capabilities

### 🩺 1. Multi-Role Portal Architecture
* **Patient Portal**: Personalized schedule dashboard, visual time cards, quick dose log buttons ("Mark as Taken"), refill threshold warnings, and vital logs.
* **Doctor Portal**: View assigned patient lists, monitor patient dose compliance rates, review logged vitals, and add digital prescriptions.
* **Caregiver Portal**: Real-time adherence feed, missed dose alerts, emergency contact triggers, and doctor communication options.
* **Admin Portal**: User management, system health metrics, and database audit logs.

### 🗣️ 2. Web Speech & Voice Engine
* Multi-lingual voice alerts (**English `en-US`**, **Hindi `hi-IN`**, **Telugu `te-IN`**).
* Hands-free voice commands using Web Speech Recognition (`webkitSpeechRecognition`).

### 🌐 3. Multi-Lingual Internationalization (i18n)
* Complete UI localization engine supporting English, Hindi, and Telugu without full page reloads.

### 🔔 4. Smart Notifications & Push Service
* Service Worker integrated (`firebase-messaging-sw.js`) for background push notifications even when the web application is inactive.

### 📈 5. Health Vitals Logger & Adherence Analytics
* Tracks Systolic/Diastolic Blood Pressure, Blood Glucose (Fasting / Post-Prandial), Pulse Rate, and Body Weight.

---

## 🏗️ Architecture & System Flow

```
                                +--------------------------------------+
                                |           CLIENT BROWSER             |
                                |  Single Page Application (SPA) HTML5 |
                                |  Vanilla CSS3 (Glassmorphism UI)     |
                                |  JavaScript ES6+ Controller Engine   |
                                +--------------------------------------+
                                      |                 |
                   Web Speech API /   |                 | REST API Requests
                   Web Notifications  |                 v (JSON payloads)
                                      |    +---------------------------+
                                      |    |   VERCEL SERVERLESS EDGE  |
                                      |    |   (api/index.py Gateway)  |
                                      |    +---------------------------+
                                      |                 |
                                      v                 v
                        +----------------------------------------------+
                        |           PYTHON BACKEND ENGINE              |
                        |           (server.py Custom HTTP)            |
                        |   - Auth & SHA-256 Hashing                   |
                        |   - REST API Route Handlers                  |
                        |   - Role-Based Access Control                |
                        +----------------------------------------------+
                                                |
                                                v
                        +----------------------------------------------+
                        |            DATABASE LAYER                    |
                        |   - SQLite Relational DB (database.db)       |
                        |   - Browser LocalStorage Offline Sync        |
                        +----------------------------------------------+
```

---

## 🧰 Tech Stack Breakdown

### **Frontend**
* **HTML5**: Semantic document structure for dynamic SPAs.
* **CSS3**: Native Custom Properties (CSS Variables), Flexbox, CSS Grid, Glassmorphism, animations, dark/light themes.
* **JavaScript (ES6+)**: Event delegation, Async/Await fetch API, DOM manipulation.
* **Web APIs**: Web Speech API (`SpeechSynthesis`), Speech Recognition (`SpeechRecognition`), Service Workers (`ServiceWorkerContainer`), Web Notifications API.

### **Backend**
* **Python 3**: Server logic implementation.
* **Custom HTTP Server (`http.server`)**: Lightweight, zero-dependency REST server handling GET and POST endpoints.
* **Security & Auth**: SHA-256 password hashing with unique per-user salts.

### **Database & Storage**
* **SQLite3**: Lightweight relational database storing users, medicines, schedules, logs, appointments, settings, and health vitals.
* **Browser LocalStorage**: Client-side state caching for offline capabilities.

### **Deployment & Cloud**
* **Vercel**: Serverless platform hosting both static frontend assets and Python backend microservices.
* **Git / GitHub**: Source control and continuous deployment pipeline.

---

## 📁 Code Structure & Segregation

```
medicine-reminder/
├── api/
│   └── index.py               # Vercel Serverless Function entry point
├── images/                    # Application architecture & screenshot assets
│   ├── dose_due.png
│   ├── sos_alert.png
│   ├── splash_screen.png
│   └── system_architecture.png
├── app.js                     # Frontend JavaScript controller & logic
├── database.db                # SQLite database file
├── firebase-messaging-sw.js   # Service worker script for push alerts
├── firebase.json              # Firebase configuration setup
├── firestore.rules            # Firestore security rules
├── index.html                 # Main Single Page Application structure
├── presentation.html          # HTML presentation deck
├── server.py                  # Python backend HTTP server & REST routes
├── styles.css                 # Master CSS design system
├── vercel.json                # Vercel routing configuration
└── README.md                  # Complete project documentation
```

---

## 🔌 API Endpoints Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Authenticates user credentials & returns user state |
| `POST` | `/api/register` | Registers new user account with hashed password & role |
| `GET` | `/api/medicines?user_id={id}` | Retrieves all scheduled medicines for a patient |
| `POST` | `/api/medicines` | Adds a new medicine entry |
| `DELETE` | `/api/medicines?id={id}` | Deletes a scheduled medicine |
| `GET` | `/api/logs?user_id={id}` | Fetches adherence history logs |
| `POST` | `/api/logs` | Logs dose status ("taken" / "missed") |
| `GET` | `/api/appointments?user_id={id}` | Fetches upcoming doctor appointments |
| `POST` | `/api/appointments` | Schedules a new appointment |
| `GET` | `/api/settings?user_id={id}` | Fetches user UI and speech settings |
| `POST` | `/api/settings` | Updates language, theme, and speech preferences |
| `POST` | `/api/health_logs` | Logs vital signs (BP, sugar, pulse, weight) |

---

## 🚀 Local Setup & Deployment

1. **Clone the Repository**
   ```bash
   git clone https://github.com/velagadadileep6-bot/Medicine-reminder.git
   cd Medicine-reminder
   ```

2. **Run Backend Server (Python 3)**
   ```bash
   python server.py
   ```
   *The server starts locally at `http://localhost:8080`.*

3. **Open Frontend**
   Open `index.html` in your web browser or view via VS Code Live Server.

---

## 👩‍🏫 Author & Guide Acknowledgments

* **Project Title**: Medicine Reminder App & Healthcare Management System
* **Demo URL**: [https://medicine-reminder-navy-phi.vercel.app](https://medicine-reminder-navy-phi.vercel.app)
* **Project Guide**: G. Bhagya Lakshmi
