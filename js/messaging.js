import { messaging, db } from './firebase-config.js';
import { getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { showToast } from './utils.js';

const VAPID_KEY = "BAI4O5MyJpT66bDYcrA0Q244wT4IN1dnf6H5sy-czjNNLLn5Nhyf59i9MTKs18Y9-1VzXgqAXOmeKKAzEH5xodQ";

export async function initMessaging(uid) {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications.');
    return;
  }

  let registration;
  if ('serviceWorker' in navigator) {
    try {
      registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      }
      // Wait for the service worker to be ready/active
      await navigator.serviceWorker.ready;
      console.log('Service Worker is active and ready.');
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  }

  const currentPermission = Notification.permission;
  if (currentPermission === 'denied') {
    return;
  }

  if (currentPermission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;
    } catch (err) {
      console.error('Error requesting permission:', err);
      return;
    }
  }

  try {
    // Pass the registration to getToken to avoid the AbortError
    const currentToken = await getToken(messaging, { 
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    if (currentToken) {
      await updateDoc(doc(db, 'users', uid), { fcmToken: currentToken });
      console.log('FCM Token secured!');
      showToast('Notifications enabled successfully!', 'success', 3000);
    }
  } catch (err) {
    console.error('Error getting FCM token:', err);
  }

  try {
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      showToast(`${payload.notification.title}: ${payload.notification.body}`, 'info', 5000);
    });
  } catch (err) { }
}
