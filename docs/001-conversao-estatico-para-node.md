# Passo 1: Iniciar o Projeto Node

```bash
npm init -y
npm install express ejs dotenv
```

# Passo 2: Organizar a Estrutura de Pastas

salao-node/
├── node_modules/
├── public/                 <-- TUDO O QUE FOR PÚBLICO VAI AQUI
│   ├── css/                <-- Mova a pasta "css" do GitHub para cá
│   ├── imagem/             <-- Mova a pasta "imagem" do GitHub para cá
│   └── js/                 <-- Mova a pasta "js" do GitHub para cá
├── views/                  <-- SEUS ARQUIVOS HTML (SSR)
│   ├── index.ejs           <-- Renomeie "index.html" para "index.ejs"
│   ├── agendamento.ejs     <-- Renomeie "cadastro_agendamento.html"
│   └── comprovante.ejs     <-- Renomeie "comprovante.html"
├── server.js               <-- O servidor Node/Express
├── .env                    <-- Suas senhas trancadas aqui (Protegido!)
└── package.json

# Passo 3: Ajustar os arquivos HTML para EJS (Nas views)

```html
<!-- Exemplo dentro do index.ejs -->
<link rel="stylesheet" href="/css/estilo.css">
<img src="/imagem/logo.png">
```

# Passo 4: Criar o Servidor e as Rotas Seguras (server.js)

# Passo 5: Criar o Arquivo Secreto .env

# Passo 6: Rodar a Aplicação

```bash
node server.js
```