import express from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Firebase Admin SDK
try {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
  }

  // The service account key from the environment variable may contain backslashes
  // that are not properly escaped for JSON.parse. This includes newlines (as \n)
  // and other literal backslashes in the key itself. The most robust solution
  // is to replace all backslashes with double backslashes, which makes them
  // valid escape characters in a JSON string.
  const escapedServiceAccountKey = serviceAccountKey.replace(/\/g, '\\');
  const serviceAccount = JSON.parse(escapedServiceAccountKey);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log('Firebase Admin SDK initialized successfully.');

} catch (error) {
  console.error('CRITICAL: Failed to initialize Firebase Admin SDK. The server cannot start.');
  console.error('Error details:', error.message);
  console.error('This is often caused by an improperly formatted FIREBASE_SERVICE_ACCOUNT_KEY in the .env file.');
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
    const userRecord = await admin.auth().getUserByEmail(email);
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
