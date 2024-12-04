const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Certifique-se de que o caminho está correto
const { authenticateToken, isSuperUser } = require('../middlewares/authMiddleware');
/**
 * @swagger
 * /api/users/inactivate/{email}:
 *   put:
 *     summary: Inativa um usuário (apenas superusuários podem inativar).
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: O email do usuário a ser inativado
 *     responses:
 *       200:
 *         description: Usuário inativado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Usuário inativado com sucesso
 *       403:
 *         description: Você não pode inativar outro superusuário ou a si mesmo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Você não pode inativar outro superusuário
 *       404:
 *         description: Usuário não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Usuário não encontrado
 *       500:
 *         description: Erro ao tentar inativar o usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Erro ao tentar inativar o usuário
 */

/**
 * Rota para inativar um usuário
 */
// Rota para inativar um usuário
router.put('/inactivate/:email', authenticateToken, isSuperUser, async (req, res) => {
  const { email } = req.params;

  try {
    // Verifica se o usuário que está tentando inativar é superusuário
    const userToInactivate = await User.findOne({ where: { email } });

    if (!userToInactivate) {
      return res.status(404).json({ status: 'error', message: 'Usuário não encontrado' });
    }

    // Regras:
    // 1. Superusuários não podem inativar outros superusuários
    if (userToInactivate.isSuperUser) {
      return res.status(403).json({ status: 'error', message: 'Você não pode inativar outro superusuário' });
    }
//console.log('Email 1:',userToInactivate.email);
//console.log('Email 2:',req.user.email);
//console.log('req user:',req.user);
    // 2. Superusuários não podem inativar a si mesmos
    if (userToInactivate.email === req.user.email) {
      return res.status(403).json({ status: 'error', message: 'Você não pode inativar a si mesmo' });
    }

    // Inativar o usuário
    userToInactivate.ativo = false;
    await userToInactivate.save();

    return res.status(200).json({ status: 'success', message: 'Usuário inativado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Erro ao tentar inativar o usuário' });
  }
});

module.exports = router;
