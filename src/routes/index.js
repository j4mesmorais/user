// No seu arquivo de rotas ou app.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Adjunto Sistemas</title>
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
        </style>
    </head>
    <body>
        <div class="container">
            <img src="/public/assets/logo.svg" alt="Logo Adjunto" style="width: 150px; height: auto;">
            <h1>Sistemas Inteligentes</h1>
        </div>
    </body>
    </html>
  `;

  res.send(htmlContent);

});

module.exports = router;
