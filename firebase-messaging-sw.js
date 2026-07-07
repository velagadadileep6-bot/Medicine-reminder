// Import the Firebase scripts (v8)
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// ==========================================
// FIREBASE CONFIGURATION (SERVICE WORKER)
// Replace the placeholder values with your actual Firebase project config.
// ==========================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDJeZR5874ZvrBQJHinACi5cjgKDu8otLQ",
  authDomain: "medicine-reminder-app-38607.firebaseapp.com",
  projectId: "medicine-reminder-app-38607",
  storageBucket: "medicine-reminder-app-38607.firebasestorage.app",
  messagingSenderId: "218349099148",
  appId: "1:218349099148:web:e207f3155d0fae2f7783a9"
};

if (FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.projectId !== 'YOUR_PROJECT_ID') {
  firebase.initializeApp(FIREBASE_CONFIG);
  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title || 'Medicine Reminder';
    const notificationOptions = {
      body: payload.notification.body || 'It is time to take your dose!',
      icon: '/icon.png',
      badge: '/badge.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
