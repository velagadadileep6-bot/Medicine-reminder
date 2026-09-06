# 🎨 Frontend Module - Medicine Reminder App

This directory contains the entire **Client-Side User Interface & Frontend Code** for the Medicine Reminder App.

---

## 📁 Files in this Module

* **`index.html`**: Single Page Application structure, multi-role views (Patient, Doctor, Caregiver, Admin), modals, forms, language selection.
* **`styles.css`**: Master CSS design system with CSS custom variables, glassmorphism UI card designs, dark theme styling, and responsive layouts.
* **`app.js`**: Core JavaScript logic, Web Speech API integration (`SpeechSynthesis`), language switching (`en`, `hi`, `te`), DOM state management, and API fetch calls.
* **`firebase-messaging-sw.js`**: Service Worker script enabling background push notifications.

---

## 🗣️ Key Features Handled by Frontend
1. **Multi-Role Switching**: Seamlessly switches between Patient, Doctor, Caregiver, and Admin views without page refresh.
2. **Web Speech Audio Alerts**: Speaks reminders in English, Hindi, and Telugu.
3. **Responsive UI**: Works across Mobile, Tablet, and Desktop browsers.
4. **Offline Caching**: Uses LocalStorage for user preferences and temporary caching.
