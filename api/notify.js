// Vercel Serverless Function: /api/notify
// This endpoint receives a POST request with {title, body}
// It uses firebase-admin (service account) to send a push notification
// to all students that have a valid fcmToken stored in Firestore.

const admin = require('firebase-admin');

// Initialize Firebase Admin only once (Vercel may reuse the instance)
if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private key comes with escaped newlines (\n) from env var, replace them
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
  });
}

/** Vercel handler */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { title, body } = req.body || {};
  if (!title || !body) {
    return res.status(400).json({ error: 'Missing title or body' });
  }

  try {
    const db = admin.firestore();
    // Get all student documents that have a fcmToken field
    const snapshot = await db.collection('users')
      .where('role', '==', 'student')
      .where('fcmToken', '!=', null)
      .get();

    const tokens = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.fcmToken) tokens.push(data.fcmToken);
    });

    if (tokens.length === 0) {
      return res.status(200).json({ message: 'No student tokens to notify' });
    }

    const message = {
      notification: { title, body },
      data: { click_action: 'FLUTTER_NOTIFICATION_CLICK' }, // optional
    };

    // Use sendMulticast for up to 500 tokens per request (FCM limit)
    const response = await admin.messaging().sendMulticast({
      ...message,
      tokens
    });

    return res.status(200).json({
      successCount: response.successCount,
      failureCount: response.failureCount,
      message: 'Notifications sent'
    });
  } catch (err) {
    console.error('Notify error:', err);
    return res.status(500).json({ error: err.message });
  }
};
