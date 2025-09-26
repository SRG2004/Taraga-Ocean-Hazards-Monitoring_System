
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// --- Mock User Database ---
// In a real app, this would be a database.
const DEMO_USERS = {
  'admin@oceanhazard.com': {
    id: 'demo_admin',
    email: 'admin@oceanhazard.com',
    fullName: 'Admin User',
    role: 'admin',
  },
  'analyst@oceanhazard.com': {
    id: 'demo_analyst',
    email: 'analyst@oceanhazard.com',
    fullName: 'Analyst User',
    role: 'analyst',
  },
  'official@oceanhazard.com': {
    id: 'demo_official',
    email: 'official@oceanhazard.com',
    fullName: 'Official User',
    role: 'official',
  },
  'citizen@oceanhazard.com': {
    id: 'demo_citizen',
    email: 'citizen@oceanhazard.com',
    fullName: 'Citizen User',
    role: 'citizen',
  }
};

const DEMO_PASSWORD = 'demo123';

console.log("SERVER RUNNING IN MOCK AUTHENTICATION MODE.");
console.log("All users share the same password: 'demo123'");

// --- Mock Authentication Routes ---

// User registration
router.post('/register', async (req, res) => {
  const { email, fullName, role } = req.body;

  if (!email || !fullName || !role) {
    return res.status(400).send({ error: 'Email, full name, and role are required.' });
  }

  if (DEMO_USERS[email]) {
    return res.status(400).send({ error: 'User with this email already exists.' });
  }

  const newUser = {
    id: `user_${Date.now()}`,
    email,
    fullName,
    role,
  };

  DEMO_USERS[email] = newUser;

  console.log("New user registered (mock):", newUser);
  res.status(201).send({ message: 'User created successfully', user: newUser });
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ error: 'Email and password are required' });
  }

  const user = DEMO_USERS[email];

  if (!user || password !== DEMO_PASSWORD) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  // In a real app, you'd generate a JWT. Here, we create a simple mock token.
  const token = `mock_token_for_${user.id}`;

  console.log(`Successful mock login for: ${email}`);
  res.status(200).send({ token, user });
});


// Mock Profile Routes (No token verification needed for this mock setup)

router.get('/profile', async (req, res) => {
  // This is a simplified mock. It doesn't validate a token but returns a default user.
  const user = DEMO_USERS['citizen@oceanhazard.com']; // default to citizen
  res.status(200).send({ user });
});

router.put('/profile', async (req, res) => {
    const { fullName } = req.body;
    // In a real app, we'd get the user from the token.
    const userToUpdate = DEMO_USERS['citizen@oceanhazard.com'];
    userToUpdate.fullName = fullName;
    console.log("Updated mock user profile:", userToUpdate);
    res.status(200).send({ user: userToUpdate });
});


export default router;
