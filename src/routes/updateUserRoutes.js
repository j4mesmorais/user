const express = require('express');
const { authenticateToken, isSuperUser } = require('../middlewares/authMiddleware');
const { User } = require('../models');

const router = express.Router();

/**
 * @openapi
* tags:
 *   - name: Autenticação
 *     description: Rotas relacionadas à autenticação de usuários  
 * /api/users/update:
 *   put:
 *     tags:
 *       - Usuários  
 *     summary: Altera o usuario pelo e-mail (only superusers)
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               codEmpresa:
 *                 type: string
 *               caixaEntrada:
 *                 type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only superusers can update users
 *       500:
 *         description: Internal Server Error
 */
router.put('/update', authenticateToken, isSuperUser, async (req, res) => {
  const { email, name, codEmpresa, caixaEntrada } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.codEmpresa = codEmpresa || user.codEmpresa;
    user.caixaEntrada = caixaEntrada || user.caixaEntrada;
    
    await user.save();
    
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
