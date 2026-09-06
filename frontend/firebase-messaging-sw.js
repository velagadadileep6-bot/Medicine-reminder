// Import the Firebase scripts (v8)
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// ==========================================
// FIREBASE CONFIGURATION (SERVICE WORKER)
// Replace the placeholder values with your actual Firebase project config.
// ==========================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCyVLoFNoB15deifPjL8SF6BsyZjOejKtM",
  authDomain: "medicare-reminder-7c001.firebaseapp.com",
  projectId: "medicare-reminder-7c001",
  storageBucket: "medicare-reminder-7c001.firebasestorage.app",
  messagingSenderId: "216535316330",
  appId: "1:216535316330:web:6b52b5a87bbf3bb7aad713"
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
