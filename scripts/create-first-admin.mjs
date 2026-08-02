/**
 * One-time setup script: creates the first super_admin account.
 *
 * Firebase Auth alone doesn't make someone an admin — this app also
 * requires a matching document in the `admins` Firestore collection
 * (see firestore.rules). This script creates both in one step using
 * the Firebase Admin SDK, which bypasses security rules — that's why
 * it runs from a trusted machine with a service account key, never
 * from the browser.
 *
 * Setup:
 *   1. Firebase Console > Project settings > Service accounts >
 *      "Generate new private key" — save it as scripts/serviceAccountKey.json
 *      (already gitignored).
 *   2. npm install firebase-admin --save-dev
 *   3. node scripts/create-first-admin.mjs you@lawtronic.tech "Your Name" "temporary-password"
 *   4. Sign in once via the app's hidden admin modal, then change the
 *      password from Firebase Auth (or add a "change password" flow later).
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const [, , email, name, password] = process.argv;

if (!email || !name || !password) {
  console.error('Usage: node scripts/create-first-admin.mjs <email> <name> <password>');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(new URL('./serviceAccountKey.json', import.meta.url)));

initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();
const db = getFirestore();

const userRecord = await auth.createUser({ email, password, displayName: name });

await db.collection('admins').doc(userRecord.uid).set({
  email,
  name,
  role: 'super_admin',
  department: 'Leadership',
  approved: true,
});

console.log(`Created super admin: ${email} (uid: ${userRecord.uid})`);
