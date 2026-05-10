const webpush = require('web-push');
const crypto = require('crypto');

const vapidKeys = webpush.generateVAPIDKeys();
const jwtSecret = crypto.randomBytes(32).toString('hex');
const posSecret = crypto.randomBytes(16).toString('hex');

console.log('NEXT_PUBLIC_VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('JWT_SECRET=' + jwtSecret);
console.log('POS_BRIDGE_SECRET=' + posSecret);
