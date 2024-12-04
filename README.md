# User Adjunto API Documentation

**Version:** 1.0.0  
**Specification:** OpenAPI 3.0  

---

## **Resumo do Projeto**

O projeto **User Adjunto** é uma API RESTful desenvolvida para gerenciar autenticação de usuários, recuperação de senha e administração de contas. Ele foi projetado com uma arquitetura modular e limpa, utilizando as melhores práticas para facilitar manutenção e escalabilidade.  

A API é construída com **Express.js**, utilizando **Sequelize** como ORM para comunicação com o banco de dados **PostgreSQL**. O banco de dados principal utilizado é o `userDB`.  

### **Principais Tecnologias Utilizadas:**
- **Node.js:** Para criação do servidor e gerenciamento de rotas.
- **Express:** Framework para a construção de APIs robustas.
- **Sequelize:** ORM para mapeamento de objetos relacionais e fácil migração para outros bancos de dados.
- **PostgreSQL:** Banco de dados relacional usado como backend.

---

## **Uso de Sequelize**

O projeto utiliza o Sequelize para facilitar a manipulação do banco de dados, implementando:
- **Migrations:** Para criação e versionamento do esquema do banco de dados.
- **Seeds:** Para popular o banco de dados com dados iniciais.
- **Models:** Para estruturar e organizar as tabelas e as relações do banco.

### Estrutura de Banco de Dados:

- Banco: `userDB`  
- Migrations: Localizadas na pasta `migrations`, contêm os scripts para criar ou alterar tabelas.  
- Seeds: Localizadas na pasta `seeders`, são usadas para inserir dados iniciais (por exemplo, usuários padrão ou configurações iniciais).

---

## **Documentação da API**

---

## **Authorize**
Rotas relacionadas à autenticação de usuários.

### **POST** `/api/auth/login`  
**Descrição:** Realiza o login do usuário.

---

## **Recuperação de Senha**
Rotas relacionadas à recuperação de senha.

### **GET** `/api/redefinipassword/{token}`  
**Descrição:** Recupera a senha utilizando o token fornecido.

### **POST** `/api/redefinipassword/{token}`  
**Descrição:** Redefine a senha utilizando o token fornecido.

### **POST** `/api/redefinipasswordlink`  
**Descrição:** Envia um link para redefinição de senha.

---

## **Usuários**
Rotas relacionadas à gestão de usuários.

### **PUT** `/api/users/inactivate/{email}`  
**Descrição:** Inativa um usuário. *(Apenas superusuários podem inativar usuários.)*

---

### **PUT** `/api/users/changepassword`  
**Descrição:** Altera a senha do usuário logado.

---

### **PUT** `/api/users/update`  
**Descrição:** Atualiza as informações de um usuário pelo e-mail. *(Apenas superusuários têm permissão.)*

---

### **POST** `/api/users/create`  
**Descrição:** Cria um novo usuário. *(Apenas superusuários têm permissão.)*

---

## **Scripts Úteis**

### Executar Migrations:
```bash
npx sequelize-cli db:migrate
```

### Reverter Migrations:

```bash
npx sequelize-cli db:migrate:undo
```

### Executar Seeds:
```bash
npx sequelize-cli db:seed:all
```
### Estrutura do Projeto
Diretórios principais:
- config/: Configurações do banco de dados e Sequelize.
- migrations/: Scripts para criação de tabelas no banco de dados.
- models/: Estruturas dos modelos de dados utilizados pelo Sequelize.
- seeders/: Scripts para popular o banco de dados com dados iniciais.
- routes/: Rotas da API organizadas por funcionalidade.
- src/public/assets/: Recursos públicos, como imagens e arquivos estáticos.
- views/: Arquivos HTML renderizados pelas rotas.

---

### Exemplo de Estrutura de Diretórios:
```plaintext
├── config/
├── migrations/
├── models/
├── seeders/
├── src/
│   ├── middlewares/
│   ├── public/
│   │   └── assets/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── inactivateUser.js
│   │   ├── passwordRoutes.js
│   │   ├── redefinePasswordLink.js
│   │   ├── updateUserRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   ├── utils/
│   └── views/
│       └── index.html
├── scripts/
├── app.js
├── swagger.js
```