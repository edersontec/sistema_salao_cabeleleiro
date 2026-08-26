require('dotenv').config(); // Carrega o arquivo .env secretamente
const express = require('express');
const app = express();
const path = require('path');

// 1. Configurar o motor de HTML (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Liberar APENAS a pasta public para a internet (css, imagens)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para conseguir ler dados enviados por formulários (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. DEFINIÇÃO DAS ROTAS (Substituindo o acesso direto a arquivos)

// Middleware global para variáveis de ambiente
app.use((req, res, next) => {
    // Fica disponível em absolutamente qualquer arquivo .ejs
    res.locals.salaoNome = process.env.SALAO_NAME || "Salão de Beleza";
    
    next(); // Passa para a próxima função/rota
});

// Rota da página inicial
app.get('/', (req, res) => {
    // Você pode passar dados do servidor para o HTML se quiser
    res.render('index');
});

// Rota para o formulário de agendamento
app.get('/agendamento', (req, res) => {
    res.render('agendamento');
});

// Rota para o comprovante
app.get('/comprovante', (req, res) => {
    res.render('comprovante');
});

// Rota POST (Quando o cliente clica em "Enviar" no formulário)
app.post('/agendar', (req, res) => {
    // Captura os dados do formulário com total segurança no servidor
    const { cliente, data, hora, servico } = req.body;
    
    // Aqui você faria a gravação no banco de dados futuramente...
    console.log(`Novo agendamento: ${cliente} - ${data} às ${hora}`);

    // Redireciona ou renderiza a página de comprovante passando os dados informados
    res.render('comprovante', { cliente, data, hora, servico });
});

// Rota para o formulário de servicos
app.get('/servicos', (req, res) => {
    res.render('servicos');
});

// Rota para o formulário de contato
app.get('/contato', (req, res) => {
    res.render('contato');
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor do Salão rodando com segurança na porta ${PORT}`);
});
