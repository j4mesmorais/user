const express = require('express');
const crypto = require('crypto');
const { User } = require('../models');
const { sendEmail } = require('../utils/mailer');
const { encrypt } = require('../utils/encryption');
const { Op } = require('sequelize');
//const dotenv = require('dotenv');
const router = express.Router();
//dotenv.config(); // Carregar variáveis de ambiente do .env
/**
 * @openapi
 * /api/redefinipassword/{token}:
 *   get:
 *     tags:
 *       - Recuperação de Senha
 *     description: Exibe o formulário de redefinição de senha.
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token para redefinição de senha.
 *     responses:
 *       200:
 *         description: Formulário exibido com sucesso.
 *       404:
 *         description: Token inválido ou expirado.
 *     security: []
 */
  router.get('/redefinipassword/:token', async (req, res) => {
    const { token } = req.params;
  
    try {
        const user = await User.findOne({ where: { resetPasswordToken: token, resetPasswordExpires: { [Op.gt]: Date.now() } } });
  
        if (!user) {
            return res.status(404).json({status: 'error', message: 'Token inválido ou expirado.'});
        }

         
          res.send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Redefinir Senha</title>
                <style>
                    body {
                        background-color: #F5FAFF;
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .container {
                        text-align: center;
                        max-width: 400px;
                        padding: 20px;
                        background-color: #FFFFFF;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        margin-bottom: 20px;
                    }
                    h1 {
                        font-size: 24px;
                        margin-bottom: 20px;
                        color: #333333;
                    }
                    form {
                        display: flex;
                        flex-direction: column;
                    }
                    input[type="password"] {
                        padding: 10px;
                        margin-bottom: 15px;
                        border: 1px solid #CCCCCC;
                        border-radius: 4px;
                        font-size: 16px;
                    }
                    button {
                        padding: 10px;
                        background-color: #007BFF;
                        color: #FFFFFF;
                        border: none;
                        border-radius: 4px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }
                    button:hover {
                        background-color: #0056b3;
                    }
                    .error, .success {
                        color: red;
                        margin-bottom: 15px;
                    }
                    .success {
                        color: green;
                    }
                </style>
                <script>
                    async function submitForm(event) {
                        event.preventDefault(); // Impede o envio padrão do formulário
            
                        const password = document.querySelector('input[name="password"]').value;
                        const confirmPassword = document.querySelector('input[name="confirmPassword"]').value;
                        const errorElement = document.getElementById('error-message');
                        const successElement = document.getElementById('success-message');
                        const form = document.getElementById('reset-password-form');
            
                        if (password !== confirmPassword) {
                            errorElement.textContent = "As senhas não coincidem.";
                            return;
                        }
                        errorElement.textContent = ""; // Limpa a mensagem de erro, se houver
                        successElement.textContent = ""; // Limpa a mensagem de sucesso, se houver
            
                        try {
                            const response = await fetch(\`${process.env.URL_LOGIN_FORM_POST}/${token}\`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    password,
                                    confirmPassword
                                })
                            });
            
                            if (response.ok) {
                                const data = await response.json();
                                successElement.textContent = "Senha redefinida com sucesso.";
                                form.reset(); // Limpa os campos do formulário
                                form.querySelectorAll('input, button').forEach(el => el.disabled = true); // Desabilita o formulário
                                
                                ${process.env.URL_LOGIN_REDIRECT ? `
                                    setTimeout(() => {
                                        window.location.href = \`${process.env.URL_LOGIN_REDIRECT}\`; // Redireciona para a URL desejada
                                    }, 2000); // Opcional: Aguarda 2 segundos antes de redirecionar
                                ` : ''}
                                
                            } else {
                                const errorData = await response.json();
                                if (response.status === 400) {
                                    errorElement.textContent = "Token inválido, expirado ou senhas não correspondem.";
                                } else if (response.status === 500) {
                                    errorElement.textContent = "Erro interno do servidor.";
                                }
                            }
                        } catch (error) {
                            errorElement.textContent = "Erro ao tentar enviar a solicitação.";
                        }
                    }
                </script>
            </head>
            <body>
                <div class="container">
                    <img src="/public/assets/logo.svg" alt="Logo Adjunto" style="width: 150px; height: auto;">
                    <h1>Redefinir Senha</h1>
                    <form id="reset-password-form" onsubmit="submitForm(event)">
                        <div id="error-message" class="error"></div>
                        <div id="success-message" class="success"></div>
                        <input type="password" name="password" placeholder="Nova senha" required />
                        <input type="password" name="confirmPassword" placeholder="Confirme a nova senha" required />
                        <button type="submit">Redefinir senha</button>
                    </form>
                </div>
            </body>
            </html>
            
                      `);

    } catch (error) {
        res.status(500).json({status: 'error', message: 'Erro interno do servidor' });
    }
  });


/**
 * @openapi
 * tags:
 *   - name: Recuperação de Senha
 *     description: Rotas relacionadas à recuperação de senha
 * /api/redefinipasswordlink:
 *   post:
 *     tags:
 *       - Recuperação de Senha
 *     description: Envia um link de redefinição de senha para o e-mail fornecido
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: E-mail do usuário
 *     responses:
 *       200:
 *         description: Link de redefinição de senha enviado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 *     security: []
 */
router.post('/redefinipasswordlink', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({status: 'error', message: 'Usuário não encontrado' });
    }

    // Gerar um token único para redefinição de senha
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Definir o token e a data de expiração no usuário
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();
    //Para usar o N8N foi necessario passar o valor do token por query params
    //const resetLink = process.env.URL_LOGIN_FORM+'?'+'token='+resetToken;
    const resetLink = process.env.URL_LOGIN_FORM+`/${resetToken}`;//process.env.APLICATION_URL+`/api/redefinipassword/${resetToken}`;

    const subject = 'Redefinição de Senha';
    const text = `Você solicitou uma redefinição de senha. Clique no link a seguir para redefinir sua senha: ${resetLink}`;

    await sendEmail(email, subject, text);

    res.status(200).json({status: 'success', message: 'Link de redefinição de senha enviado com sucesso' });
  } catch (error) {
    res.status(500).json({status: 'error', message: 'Erro interno do servidor' });
  }
});



/**
 * @openapi
 * /api/redefinipassword/{token}:
 *   post:
 *     tags:
 *       - Recuperação de Senha
 *     description: Permite redefinir a senha do usuário.
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token para redefinição de senha.
 *     requestBody:
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Nova senha do usuário
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmação da nova senha
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso.
 *       400:
 *         description: Token inválido, expirado ou senhas não correspondem.
 *       500:
 *         description: Erro interno do servidor.
 *     security: []
 */
router.post('/redefinipassword/:token', async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  //return res.send('password:'+password+'confirmPassword:'+confirmPassword);


  if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'As senhas não correspondem.'
    });
      
  }

  try {
      const user = await User.findOne({ where: { resetPasswordToken: token, resetPasswordExpires: { [Op.gt]: Date.now() } } });

      if (!user) {
          return res.status(400).json({
            status: 'error',
            message: 'Token inválido ou expirado.'
        });
      }

      const hashedPassword = encrypt(password);
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      res.status(200).json({
        status: 'success',
        message: 'Senha redefinida com sucesso.'
    });
  } catch (error) {
      res.status(500).json({status: 'error', message: 'Aqui! Erro interno do servidor' });
  }
      
});

module.exports = router;
