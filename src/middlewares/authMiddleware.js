const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Certifique-se de que o caminho está correto
//const {JWT_SECRET}  = process.env;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user; // Verifique se o campo isSuperUser está aqui
    next();
  });
};


const isSuperUser = (req, res, next) => {
  if (req.user && req.user.isSuperUser) {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado' });
  }
};

module.exports = { authenticateToken, isSuperUser };
