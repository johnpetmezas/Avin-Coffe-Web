import webpush from 'web-push';

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const email = process.env.VAPID_EMAIL || 'mailto:test@example.com';

if (publicKey && privateKey && !publicKey.includes('...')) {
  try {
    webpush.setVapidDetails(email, publicKey, privateKey);
  } catch (err) {
    console.error('VAPID initialization failed:', err.message);
  }
}

export async function sendPushNotification(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error('Error sending push notification', error);
  }
}
