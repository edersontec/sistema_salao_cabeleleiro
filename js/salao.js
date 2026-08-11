
// =========================================================
// FUNÇÃO DE CADASTRO DO AGENDAMENTO
// 

function cadastrarAgendamento() {

    // Recupera os dados digitados no formulário
    let nome = document.getElementById("nome").value;

    let profissional = document.getElementById("profissional").value;

    let sexo = document.querySelector('input[name="sexo"]:checked').value;
    
    let data = document.getElementById("data").value;
    
    let horario = document.getElementById("horario").value;

    // ---------------------------------------------------------
    // RECUPERA OS SERVIÇOS
    // ---------------------------------------------------------
    let servicos = document.querySelectorAll(".serv:checked");
    
    // Cria uma lista vazia para armazenar os serviços

    let listaServicos = [];

    // Percorre os serviços selecionados

    servicos.forEach(function(servico) {

        listaServicos.push(servico.value);

         // Adiciona o serviço à lista
    });

    // ---------------------------------------------------------
    // SALVA OS DADOS NO LOCALSTORAGE
    // ---------------------------------------------------------
    localStorage.setItem("nomeCliente", nome);

    localStorage.setItem("profissional", profissional);
    
    localStorage.setItem("sexoCliente", sexo);
    
    localStorage.setItem("listaServicos", listaServicos.join(", "));
    
    localStorage.setItem("data", data);
    
    localStorage.setItem("horario", horario);

    // ---------------------------------------------------------
    // ABRE A PÁGINA DO COMPROVANTE
    // ---------------------------------------------------------
    window.location.href = "comprovante.html";
    // Redireciona para a página do comprovante
}