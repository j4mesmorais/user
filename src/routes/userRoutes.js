const express = require('express');
const router = express.Router();
const { User } = require('../models'); // Importe o modelo de usuário
const { authenticateToken, isSuperUser } = require('../middlewares/authMiddleware'); // Certifique-se de que a importação está correta
const { encrypt } = require('../utils/encryption'); // Ajuste o caminho conforme necessário
/**
 * @openapi
 * tags:
 *   - name: Autenticação
 *     description: Rotas relacionadas à autenticação de usuários 
 * /api/users/create:
 *   post:
 *     tags:
 *       - Usuários 
 *     summary: Cria um novo usuário (only superusers)
 *     description: Somente superusuário pode criar novos usuários.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 example: securepassword
 *               codEmpresa:
 *                 type: string
 *                 example: 12345
 *             required:
 *               - email
 *               - name
 *               - password
 *               - codEmpresa
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário criado com sucesso
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     codEmpresa:
 *                       type: string
 *                       example: 12345
 *       400:
 *         description: Solicitação inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Todos os campos são obrigatórios
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Acesso negado
 *       500:
 *         description: Erro ao criar usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao criar usuário
 */

// Rota para criar um usuário (Somente superusuário pode acessar)
router.post('/create', authenticateToken, isSuperUser, async (req, res) => {
  try {
    const { email, name, password, codEmpresa } = req.body;

    if (!email || !name || !password || !codEmpresa) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }
 
    // Certifique-se de criptografar a senha antes de armazenar
    const newUser = await User.create({
      email,
      name,
      password:encrypt(password), // Criptografia de senha deve ser feita antes de armazenar
      codEmpresa,
      IsSuperUser: false,
      Ativo: true
    });

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        codEmpresa: newUser.codEmpresa
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao criar usuário' });
  }
});

module.exports = router;
