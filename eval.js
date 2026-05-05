const express = require('express');
const app = express();
app.use(express.json());

// Simulated user database
const users = [
  {
    id: 1,
    username: 'alice',
    email: 'alice@example.com',
    passwordHash: '$2b$10$abcd1234...',
    ssn: '123-45-6789',
    creditCard: '4532-1488-0343-6467',
    apiKey: 'sk_live_8f7d6a5b4c3e2f1a',
    role: 'user'
  },
  {
    id: 2,
    username: 'bob',
    email: 'bob@example.com',
    passwordHash: '$2b$10$wxyz9876...',
    ssn: '987-65-4321',
    creditCard: '5500-0000-0000-0004',
    apiKey: 'sk_live_1a2b3c4d5e6f7g8h',
    role: 'admin'
  }
];

// VULNERABILITY 1: Returns full user object including secrets
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send('Not found');
  res.json(user); // Leaks passwordHash, ssn, creditCard, apiKey
});

// VULNERABILITY 2: Lists ALL users with sensitive fields to anyone
app.get('/api/users', (req, res) => {
  res.json(users);
});

// VULNERABILITY 3: Verbose error messages leak internal details
app.get('/api/account', (req, res) => {
  try {
    const userId = req.query.id;
    const user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      // Leaks the database query path and internal structure
      throw new Error(
        `User lookup failed in /var/app/db/users.json at line 42. ` +
        `Connection: mysql://admin:Pa$$w0rd@10.0.0.5:3306/prod_db`
      );
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
      stack: err.stack,           // Full stack trace exposed
      env: process.env            // ALL environment variables (API keys, DB creds!)
    });
  }
});

// VULNERABILITY 4: Debug endpoint left in production
app.get('/debug/config', (req, res) => {
  res.json({
    dbPassword: process.env.DB_PASSWORD,
    jwtSecret: process.env.JWT_SECRET,
    stripeKey: process.env.STRIPE_SECRET_KEY,
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY
  });
});

// VULNERABILITY 5: Username enumeration via different responses
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'Username does not exist' });
  }
  if (user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Wrong password for this user' });
  }
  res.json({ token: 'abc123' });
});

// VULNERABILITY 6: Server header and version disclosure
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'Express 4.17.1');
  res.setHeader('X-Server', 'Node.js v14.15.0 on Ubuntu 18.04');
  res.setHeader('X-Database', 'MySQL 5.7.32');
  next();
});

// VULNERABILITY 7: Logs sensitive data
app.post('/api/payment', (req, res) => {
  console.log('Payment received:', JSON.stringify(req.body));
  // Logs full credit card number, CVV, etc. to stdout/log files
  res.json({ status: 'processed' });
});

function hashPassword(p) { return p; } // pretend hash

app.listen(3000);
