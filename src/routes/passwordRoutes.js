const express = require('express');
const { encrypt } = require('../utils/encryption'); // Ajuste o caminho conforme necessário
const { User, sequelize } = require('../models'); // Importa o Sequelize para usar transações
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Autenticação
 *     description: Rotas relacionadas à autenticação de usuários 
 * /api/users/changepassword:
 *   put:
 *     tags:
 *       - Usuários 
 *     summary: Altera a senha do usuario logado
 *     description: Permite ao usuário logado alterar sua própria senha
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Nova senha do usuário
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/', authenticateToken, async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ message: 'Nova senha é obrigatória' });
  }

  // Inicia a transação
  const transaction = await sequelize.transaction();

  try {
    // Encontra o usuário com base no ID do token
    const user = await User.findByPk(req.user.id, { transaction });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Criptografa a nova senha
    const hashedPassword = encrypt(newPassword);

    // Atualiza a senha do usuário
    user.password = hashedPassword;
    await user.save({ transaction });
    await transaction.commit();

    res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    await transaction.rollback();
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
