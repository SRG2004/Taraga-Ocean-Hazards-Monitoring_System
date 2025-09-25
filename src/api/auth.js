import express from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Firebase Admin SDK
try {
  console.log("Attempting to initialize Firebase Admin SDK...");
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    console.error("CRITICAL: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not found.");
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }

  console.log("FIREBASE_SERVICE_ACCOUNT_KEY found.");
  console.log("Key length:", serviceAccountKey.length);
  console.log("Key starts with:", serviceAccountKey.substring(0, 30));
  console.log("Key ends with:", serviceAccountKey.substring(serviceAccountKey.length - 30));

  let serviceAccount;
  try {
    // Replace literal \n with actual newlines, which can be an issue with env vars
    const escapedKey = serviceAccountKey.replace(/\\n/g, "\n");
    serviceAccount = JSON.parse(escapedKey);
  } catch (e) {
    console.error("Failed to parse the service account key JSON.");
    console.error("Parsing error:", e.message);
    throw new Error("The FIREBASE_SERVICE_ACCOUNT_KEY could not be parsed as JSON.");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('Firebase Admin SDK initialized successfully.');

} catch (error) {
  console.error('CRITICAL: Failed to initialize Firebase Admin SDK. The server cannot start.');
  console.error('Final error:', error.message);
  process.exit(1);
}

// User registration
router.post('/register', async (req, res) => {
  const { email, password, fullName, role } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    res.status(201).send({ message: 'User created successfully', uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // This is a simplified login. For production, you'd typically use the Firebase client-side SDK
    // to sign in and then send the ID token to the backend for verification.
    const userRecord = await admin.auth().getUserByEmail(email);
    // Note: This does not actually verify the user's password.
    // A proper implementation would require client-side sign-in and token verification.
    const token = await admin.auth().createCustomToken(userRecord.uid);

    res.status(200).send({ token });
  } catch (error) {
    res.status(401).send({ error: 'Invalid credentials' });
  }
});


// Get user profile
router.get('/profile', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    res.status(200).send({ user: userRecord.toJSON() });
  } catch (error) {
    res.status(401).send({ error: 'Invalid token' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  const { fullName, phone } = req.body;

  if (!idToken) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    await admin.auth().updateUser(uid, {
      displayName: fullName,
      phoneNumber: phone
    });

    const userRecord = await admin.auth().getUser(uid);

    res.status(200).send({ user: userRecord.toJSON() });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;