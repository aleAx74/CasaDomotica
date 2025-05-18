import jwt from 'jsonwebtoken';

const SECRET_KEY = 'segreto'; 

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      city: user.city
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Accesso negato. Nessun token fornito.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token non valido.' });
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token mancante' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token non valido' });
    req.userId = decoded.id;
    next();
  });
};
