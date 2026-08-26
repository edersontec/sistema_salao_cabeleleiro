
// =========================================================
// FUNÇÃO DE CADASTRO DO AGENDAMENTO
// ========================================================= 

function cadastrarAgendamento() {

    // Recupera os dados digitados no formulário
    let nome = document.getElementById("nome").value;

    let profissional = document.getElementById("profissional").value;

    let sexo = document.querySelector('input[name="sexo"]:checked').value;
    
    let data = document.getElementById("data").value;
    
    let horario = document.getElementById("horario").value;

    // ---------------------------------------------------------
    // RECUPERA OS SERVIÇOS OS SERVIÇOS SELECINADOS PELO USUÁRIO
    // ---------------------------------------------------------
	/* querySelectorAll procura no HTML todos os elementos
	   que possuem a classe "serv" e que estão marcados (:checked).
	   Exemplo: se o aluno marcou "Corte" e "Barba",
	   os dois elementos serão armazenado na variável "serviços".
	*/
    let servicos = document.querySelectorAll(".serv:checked");
    // ----------------------------------------------------------
    // CRIA UMA LISTA VAZIA PARA ARMAZENAR OS SERVIÇOS ESCOLHIDOS
	// ----------------------------------------------------------
	
	/* Cria uma array (lista) vazio.
	   Ele será usado para armazenar somente os valores
	   dos serviços que foram selecionados pelo usuário.
	*/

    let listaServicos = [];
	
    // ----------------------------------------------------------
    // PERCORRE TODOS OS SERVIÇOS SELECIONADOS
    // ----------------------------------------------------------
	
    /*  forEach() percorre um por um os serviços encontrados.
	    A variável "serviços" representa o serviço atual.
		durante casa repetição do forEach().
	*/
    servicos.forEach(function(servico) {
		
	/* push*() adiciona um novo item ao final do array.
	   o ".value" pega o valor do serviço definido no HTML.
	
	*/	

        listaServicos.push(servico.value);

         // Adiciona o serviço à lista
    });
	
	// ---------------------------------------------------------
    // ENVIA OS DADOS PARA O SERVIDOR SALVAR NO BANCO DE DADOS
    // ---------------------------------------------------------
    fetch("/agendar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            cliente: nome,
            profissional: profissional,
            sexo: sexo,
            servico: listaServicos,
            data: data,
            hora: horario,
        }),
    })
    .then(function(resposta) {
        if (!resposta.ok) {
            throw new Error("Falha ao salvar o agendamento");
        }

        return resposta.json();
    })
    .then(function(dados) {
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
        // ABRE A PÁGINA DO COMPROVANTE COM O ID DO AGENDAMENTO SALVO
        // ---------------------------------------------------------
        window.location.href = "/comprovante?id=" + dados.id;
        // Redireciona para a página do comprovante
    })
    .catch(function(erro) {
        alert("Não foi possível salvar o agendamento. Tente novamente.");
        console.error(erro);
    });
}
