# ⚙️ Backend Module - Medicine Reminder App

This directory contains the entire **Server-Side API, Database Schema, & Serverless Integration Code** for the Medicine Reminder App.

---

## 📁 Files in this Module

* **`server.py`**: Custom Python HTTP Server handling RESTful API routes (`/api/login`, `/api/medicines`, `/api/logs`, `/api/health_logs`), SHA-256 password hashing, and SQLite queries.
* **`database.db`**: Relational SQLite database storing tables for `users`, `medicines`, `logs`, `appointments`, `settings`, and `health_logs`.
* **`api/index.py`**: Vercel Serverless Function adapter bridge for cloud hosting.

---

## ⚙️ Key Backend Responsibilities
1. **User Authentication**: Secure signup and login verification using SHA-256 cryptographic hashing and unique per-user salts.
2. **Database Operations**: Performs CRUD actions on SQLite database for medicine schedules, compliance tracking, and vital signs.
3. **Restful API Gateway**: Processes JSON payloads for frontend client requests.
4. **Serverless Ready**: Runs efficiently on Vercel Edge Serverless functions.
