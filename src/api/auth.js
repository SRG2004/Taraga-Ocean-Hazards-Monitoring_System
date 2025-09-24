import express from 'express';
import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

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
    // This is a simplified login. In a real app, you'd verify the password.
    // Firebase Admin SDK doesn't directly verify passwords.
    // A common approach is to use Firebase client-side SDK for login and send the ID token to the backend.
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
