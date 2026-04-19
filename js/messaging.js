import { messaging, db } from './firebase-config.js';
import { getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { showToast } from './utils.js';

const VAPID_KEY = "BAI4O5MyJpT66bDYcrA0Q244wT4IN1dnf6H5sy-czjNNLLn5Nhyf59i9MTKs18Y9-1VzXgqAXOmeKKAzEH5xodQ";

export async function initMessaging(uid) {
  if (VAPID_KEY === "REPLACE_ME_WITH_YOUR_VAPID_KEY") {
    console.warn("Messaging init skipped: VAPID_KEY not replaced yet.");
    return;
  }
  try {
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      if (currentToken) {
        await updateDoc(doc(db, 'users', uid), { fcmToken: currentToken });
        console.log("FCM Token generated & saved to profile successfully!");
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    } else {
      console.log('Unable to get permission to notify - user denied.');
    }
  } catch (err) {
    if (err.code === "messaging/unsupported-browser") {
      console.log("This browser does not support push notifications.");
    } else {
      console.error('An error occurred while retrieving token. ', err);
    }
  }

  try {
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      showToast(`${payload.notification.title}: ${payload.notification.body}`, 'info', 5000);
    });
  } catch (err) { }
}
