// =========================================================
// FUNÇÕES AUXILIARES DE RESPONSABILIDADE ÚNICA
// ========================================================= 

// Recupera os dados digitados no formulário
function obterDadosFormulario() {
    let nome = document.getElementById("nome").value;
    let profissional = document.getElementById("profissional").value;
    let sexoChecked = document.querySelector('input[name="sexo"]:checked');
    let sexo = sexoChecked ? sexoChecked.value : "";
    let data = document.getElementById("data").value;
    let horario = document.getElementById("horario").value;

    return { nome, profissional, sexo, data, horario };
}

// Recupera os serviços selecionados pelo usuário
function obterServicosSelecionados() {
    /* querySelectorAll procura no HTML todos os elementos
       que possuem a classe "serv" e que estão marcados (:checked).
    */
    let servicos = document.querySelectorAll(".serv:checked");
    let listaServicos = [];

    /*  forEach() percorre um por um os serviços encontrados.
        Adiciona o serviço à lista
    */
    servicos.forEach(function(servico) {
        listaServicos.push(servico.value);
    });

    return listaServicos;
}

// Envia os dados para o servidor salvar no banco de dados
function salvarAgendamentoServidor(dados, listaServicos) {
    return fetch("/agendar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cliente: dados.nome,
            profissional: dados.profissional,
            sexo: dados.sexo,
            servico: listaServicos,
            data: dados.data,
            hora: dados.horario,
        }),
    })
    .then(function(resposta) {
        if (!resposta.ok) {
            throw new Error("Falha ao salvar o agendamento");
        }
        return resposta.json();
    });
}

// Salva os dados no localStorage
function salvarLocalStorage(dados, listaServicos) {
    localStorage.setItem("nomeCliente", dados.nome);
    localStorage.setItem("profissional", dados.profissional);
    localStorage.setItem("sexoCliente", dados.sexo);
    localStorage.setItem("listaServicos", listaServicos.join(", "));
    localStorage.setItem("data", dados.data);
    localStorage.setItem("horario", dados.horario);
}

// Abre a página do comprovante com o id do agendamento salvo
function redirecionarParaComprovante(id) {
    window.location.assign("/comprovante?id=" + id);
}

// =========================================================
// FUNÇÃO DE CADASTRO DO AGENDAMENTO (COORDENADORA)
// ========================================================= 

function cadastrarAgendamento() {
    let dados = obterDadosFormulario();
    let listaServicos = obterServicosSelecionados();

    salvarAgendamentoServidor(dados, listaServicos)
        .then(function(dadosSalvos) {
            salvarLocalStorage(dados, listaServicos);
            redirecionarParaComprovante(dadosSalvos.id);
        })
        .catch(function(erro) {
            alert("Não foi possível salvar o agendamento. Tente novamente.");
            console.error(erro);
        });
}

// Exportações condicionais para ambiente de testes Jest (Node)
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        obterDadosFormulario,
        obterServicosSelecionados,
        salvarAgendamentoServidor,
        salvarLocalStorage,
        redirecionarParaComprovante,
        cadastrarAgendamento
    };
}
