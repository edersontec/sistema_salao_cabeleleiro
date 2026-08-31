require("dotenv").config(); // Carrega o arquivo .env secretamente
const express = require("express");
const app = express();
const path = require("path");
const { setAgendamentos, getAgendamentos, setAvaliacoes, getAvaliacoes } = require("./db/sqlLite");

// 1. Configurar o motor de HTML (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 2. Liberar APENAS a pasta public para a internet (css, imagens)
app.use(express.static(path.join(__dirname, "public")));

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
app.get("/", (req, res) => {
  // Você pode passar dados do servidor para o HTML se quiser
  res.render("index");
});

// Rota para o formulário de agendamento
app.get("/agendamento", (req, res) => {
  res.render("agendamento");
});

// Rota para o comprovante
app.get("/comprovante", (req, res) => {
  const { id } = req.query;

  const [agendamento] = id ? getAgendamentos({ id }) : [];

  console.log("Dados do agendamento carregados para o comprovante:", agendamento);

  res.render("comprovante", { agendamento: agendamento || null });
});

// Rota POST (Quando o cliente clica em "Enviar" no formulário de agendamento)
app.post("/agendar", (req, res) => {
  // Captura os dados do formulário com total segurança no servidor
  const { cliente, data, hora, servico, profissional, sexo } = req.body;

  // Grava o agendamento no banco SQLite
  const id = setAgendamentos({
    nome: cliente,
    hora,
    profissional,
    sexo,
    services: JSON.stringify(servico),
    createAt: new Date().toISOString(),
  });

  // Busca o registro recém-salvo no banco para conferência
  const [agendamentoSalvo] = getAgendamentos({ id });

  console.log("Agendamento salvo no banco de dados:", agendamentoSalvo);

  // Retorna o id para o front-end usar na página de comprovante
  res.json({ id, agendamento: agendamentoSalvo });
});

// Rota POST (Quando o cliente clica em "Enviar" no formulário de avaliação)
app.post("/avaliar", (req, res) => {
  // Captura os dados do formulário com total segurança no servidor
  const { cliente, avaliacao, mensagem } = req.body;

  // Grava o agendamento no banco SQLite
  const id = setAvaliacoes({
    nome: cliente,
    avaliacao,
    mensagem,
    createAt: new Date().toISOString(),
  });

  // Busca o registro recém-salvo no banco para conferência
  const [avaliacaoSalvo] = getAvaliacoes({ id });

  console.log("Avaliacao salvo no banco de dados:", avaliacaoSalvo);

  // Retorna o id para o front-end usar na página de comprovante
  res.json({ id, avaliacao: avaliacaoSalvo });
});

// Rota para o formulário de servicos
app.get("/servicos", (req, res) => {
  res.render("servicos");
});

// Rota para o formulário de contato
app.get("/contato", (req, res) => {
  res.render("contato");
});

// Rota para o formulário de avaliacoes
app.get("/avaliacoes", (req, res) => {
  res.render("avaliacoes", {avaliacoes: getAvaliacoes()});
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor do Salão rodando com segurança na porta ${PORT}`);
});
