import { messaging, db } from './firebase-config.js';
import { getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { showToast } from './utils.js';

const VAPID_KEY = "BAI4O5MyJpT66bDYcrA0Q244wT4IN1dnf6H5sy-czjNNLLn5Nhyf59i9MTKs18Y9-1VzXgqAXOmeKKAzEH5xodQ";

export async function initMessaging(uid) {
  console.log(">>> initMessaging TRIGGERED for UID:", uid);
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications.');
    return;
  }

  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Service Worker registered successfully.');
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  }

  const currentPermission = Notification.permission;
  console.log('Current notification permission:', currentPermission);

  if (currentPermission === 'denied') {
    showToast('Notifications blocked! Go to browser Settings → Site Settings → Notifications → Reset for this site.', 'warning', 8000);
    return;
  }

  if (currentPermission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        showToast('Notifications denied. Enable them in browser settings.', 'warning', 5000);
        return;
      }
    } catch (err) {
      console.error('Error requesting permission:', err);
      return;
    }
  }

  try {
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (currentToken) {
      await updateDoc(doc(db, 'users', uid), { fcmToken: currentToken });
      console.log('FCM Token saved:', currentToken.substring(0, 20) + '...');
      showToast('Notifications enabled!', 'success', 3000);
    } else {
      console.warn('No FCM token received.');
      showToast('Could not get notification token. Check console.', 'warning', 5000);
    }
  } catch (err) {
    console.error('Error getting FCM token:', err);
    showToast('Notification error: ' + err.message, 'error', 5000);
  }

  try {
    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      showToast(`${payload.notification.title}: ${payload.notification.body}`, 'info', 5000);
    });
  } catch (err) { }
}
