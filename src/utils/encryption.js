const crypto = require('crypto');
const { ENCRYPTION_KEY } = process.env;
const algorithm = 'aes-256-cbc'; // Algoritmo de criptografia

// Função para criptografar texto
function encrypt(text) {
  const iv = crypto.randomBytes(16); // Vetor de inicialização
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex'); // Retorna o IV e o texto criptografado
}

// Função para descriptografar texto
function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = { encrypt, decrypt };
