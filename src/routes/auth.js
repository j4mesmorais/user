const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { decrypt } = require('../utils/encryption'); // Ajuste o caminho conforme necessário
const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Autenticação
 *     description: Rotas relacionadas à autenticação de usuários  
 * /api/auth/login:
 *   post:
*     tags:
 *       - Autenticação 
 *     summary: loga o usuario
 *     description: Login to get a JWT token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Unauthorized
 *     security: [] 
*/
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!user.ativo) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const decryptedPassword = decrypt(user.password);
    if (password !== decryptedPassword) {
    //if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = jwt.sign({ id: user.id, email:user.email, isSuperUser: user.isSuperUser }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.status(200).json({ token, isSuperUser: user.isSuperUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
