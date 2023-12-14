const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  console.log(req.headers)
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, '12345', (err, decoded) => {
    if (err) {
      console.log(err)
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = decoded; // Store the decoded token data in request object
    next();
  });
}

module.exports = authenticateToken;
