importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyANtl6NgF4_nhUWBxn9exIBcXrfBHNePVE",
  authDomain: "educore-erp.firebaseapp.com",
  projectId: "educore-erp",
  storageBucket: "educore-erp.firebasestorage.app",
  messagingSenderId: "671546845544",
  appId: "1:671546845544:web:55739b3f4181613aed0edd",
  measurementId: "G-CMQ5NMLXNM"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
