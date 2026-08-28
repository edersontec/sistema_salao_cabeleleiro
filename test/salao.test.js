/**
 * @jest-environment jsdom
 */


const { replaceLocation } = require("jest-location-mock/hooks/replace-location");
const { reset } = require("jest-location-mock/hooks/reset");

const {
    obterDadosFormulario,
    obterServicosSelecionados,
    salvarAgendamentoServidor,
    salvarLocalStorage,
    redirecionarParaComprovante,
    cadastrarAgendamento
} = require("../public/js/salao");

describe("Testes Unitários - salao.js", () => {
    beforeAll(() => {
        console.log("typeof window in beforeAll:", typeof window);
        if (typeof window !== "undefined") {
            console.log("window._globalProxy in beforeAll:", !!window._globalProxy);
            console.log("window.location in beforeAll:", window.location);
        }
        // Inicializa o mock de location com o spyOn local do Jest
        replaceLocation(jest.spyOn);
        if (typeof window !== "undefined") {
            console.log("window.location.assign after replaceLocation:", typeof window.location.assign);
            console.log("window.location.assign.mockClear after replaceLocation:", typeof window.location.assign.mockClear);
        }
    });

    // Configuração do DOM antes de cada teste
    beforeEach(() => {
        // Limpa o DOM do JSDOM
        document.body.innerHTML = "";
        // Limpa o localStorage mockado
        localStorage.clear();
        // Mock global de fetch
        global.fetch = jest.fn();
        // Mock global de alert e console.error
        window.alert = jest.fn();
        console.error = jest.fn();
        
        // Reseta o mock de window.location do jest-location-mock
        reset();
        //window.location.assign.mockClear();
    });

    afterEach(() => {
        // Restaura todos os mocks após cada teste
        jest.restoreAllMocks();
    });

    // ==========================================
    // 1. TESTES PARA obterDadosFormulario()
    // ==========================================
    describe("obterDadosFormulario()", () => {
        test("1. Deve ler os valores corretamente quando o formulário estiver todo preenchido", () => {
            document.body.innerHTML = `
                <input id="nome" value="Carlos Silva" />
                <input id="profissional" value="Pedro Martins" />
                <input type="radio" name="sexo" value="M" checked />
                <input id="data" value="2026-09-10" />
                <input id="horario" value="14:00" />
            `;

            const dados = obterDadosFormulario();
            expect(dados).toEqual({
                nome: "Carlos Silva",
                profissional: "Pedro Martins",
                sexo: "M",
                data: "2026-09-10",
                horario: "14:00"
            });
        });

        test("2. Deve retornar strings vazias quando os inputs estiverem sem valores", () => {
            document.body.innerHTML = `
                <input id="nome" value="" />
                <input id="profissional" value="" />
                <input type="radio" name="sexo" value="F" checked />
                <input id="data" value="" />
                <input id="horario" value="" />
            `;

            const dados = obterDadosFormulario();
            expect(dados).toEqual({
                nome: "",
                profissional: "",
                sexo: "F",
                data: "",
                horario: ""
            });
        });

        test("3. Deve tratar a falta de sexo marcado retornando string vazia e não lançar erro", () => {
            document.body.innerHTML = `
                <input id="nome" value="Ana" />
                <input id="profissional" value="Juliana" />
                <input type="radio" name="sexo" value="F" />
                <input id="data" value="2026-09-11" />
                <input id="horario" value="15:30" />
            `;

            const dados = obterDadosFormulario();
            expect(dados.sexo).toBe("");
        });
    });

    // ==========================================
    // 2. TESTES PARA obterServicosSelecionados()
    // ==========================================
    describe("obterServicosSelecionados()", () => {
        test("1. Deve retornar múltiplos serviços quando houver mais de um marcado", () => {
            document.body.innerHTML = `
                <input type="checkbox" class="serv" value="Corte" checked />
                <input type="checkbox" class="serv" value="Barba" checked />
                <input type="checkbox" class="serv" value="Pintura" />
            `;

            const servicos = obterServicosSelecionados();
            expect(servicos).toEqual(["Corte", "Barba"]);
        });

        test("2. Deve retornar apenas o único serviço marcado", () => {
            document.body.innerHTML = `
                <input type="checkbox" class="serv" value="Corte" />
                <input type="checkbox" class="serv" value="Barba" checked />
            `;

            const servicos = obterServicosSelecionados();
            expect(servicos).toEqual(["Barba"]);
        });

        test("3. Deve retornar um array vazio se nenhum serviço estiver marcado", () => {
            document.body.innerHTML = `
                <input type="checkbox" class="serv" value="Corte" />
                <input type="checkbox" class="serv" value="Barba" />
            `;

            const servicos = obterServicosSelecionados();
            expect(servicos).toEqual([]);
        });
    });

    // ==========================================
    // 3. TESTES PARA salvarAgendamentoServidor()
    // ==========================================
    describe("salvarAgendamentoServidor()", () => {
        test("1. Deve retornar os dados obtidos do servidor se a requisição for bem-sucedida", async () => {
            const respostaMock = { id: 42, status: "confirmado" };
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => respostaMock
            });

            const dados = { nome: "Lucas", profissional: "Tiago", sexo: "M", data: "2026-08-30", horario: "10:00" };
            const servicos = ["Corte"];

            const resultado = await salvarAgendamentoServidor(dados, servicos);
            expect(resultado).toEqual(respostaMock);
        });

        test("2. Deve lançar um erro se o servidor responder com status de erro (não ok)", async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false
            });

            const dados = { nome: "Lucas", profissional: "Tiago", sexo: "M", data: "2026-08-30", horario: "10:00" };
            const servicos = ["Corte"];

            await expect(salvarAgendamentoServidor(dados, servicos)).rejects.toThrow("Falha ao salvar o agendamento");
        });

        test("3. Deve fazer a chamada POST correta para a rota /agendar", async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 1 })
            });

            const dados = { nome: "Lucas", profissional: "Tiago", sexo: "M", data: "2026-08-30", horario: "10:00" };
            const servicos = ["Corte", "Luzes"];

            await salvarAgendamentoServidor(dados, servicos);

            expect(global.fetch).toHaveBeenCalledWith("/agendar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cliente: "Lucas",
                    profissional: "Tiago",
                    sexo: "M",
                    servico: ["Corte", "Luzes"],
                    data: "2026-08-30",
                    hora: "10:00"
                })
            });
        });
    });

    // ==========================================
    // 4. TESTES PARA salvarLocalStorage()
    // ==========================================
    describe("salvarLocalStorage()", () => {
        test("1. Deve gravar todas as propriedades do agendamento com as chaves corretas", () => {
            const dados = { nome: "Marina", profissional: "Carla", sexo: "F", data: "2026-09-15", horario: "16:00" };
            const servicos = ["Corte", "Hidratação"];

            salvarLocalStorage(dados, servicos);

            expect(localStorage.getItem("nomeCliente")).toBe("Marina");
            expect(localStorage.getItem("profissional")).toBe("Carla");
            expect(localStorage.getItem("sexoCliente")).toBe("F");
            expect(localStorage.getItem("data")).toBe("2026-09-15");
            expect(localStorage.getItem("horario")).toBe("16:00");
        });

        test("2. Deve salvar a lista de serviços concatenada por vírgula e espaço", () => {
            const dados = { nome: "Marina", profissional: "Carla", sexo: "F", data: "2026-09-15", horario: "16:00" };
            const servicos = ["Corte", "Escova", "Manicure"];

            salvarLocalStorage(dados, servicos);

            expect(localStorage.getItem("listaServicos")).toBe("Corte, Escova, Manicure");
        });

        test("3. Deve funcionar perfeitamente com um array de serviços vazio", () => {
            const dados = { nome: "Marina", profissional: "Carla", sexo: "F", data: "2026-09-15", horario: "16:00" };
            const servicos = [];

            salvarLocalStorage(dados, servicos);

            expect(localStorage.getItem("listaServicos")).toBe("");
        });
    });

    // ==========================================
    // 5. TESTES PARA redirecionarParaComprovante()
    // ==========================================
    describe("redirecionarParaComprovante()", () => {

        // 1. Cria um spy no método assign do window.location
        let assignSpy;

        beforeEach(() => {
            // Se usar jest-location-mock, o reset limpa o estado
            reset(); 
            
            // Garante que o Jest está espionando a função
            assignSpy = jest.spyOn(window.location, 'assign').mockImplementation(() => {});
        });

        afterEach(() => {
            // Restaura a função original após cada teste
            assignSpy.mockRestore();
        });

        test("1. Deve definir o window.location.href corretamente com o id passado", () => {
            redirecionarParaComprovante(99);
            
            expect(assignSpy).toHaveBeenCalledWith("/comprovante?id=99");
        });

        test("2. Deve aceitar id como string vazia", () => {
            redirecionarParaComprovante("");
            expect(window.location.assign).toHaveBeenCalledWith("/comprovante?id=");
        });

        test("3. Deve aceitar caracteres especiais no id", () => {
            redirecionarParaComprovante("abc-123_xyz");
            expect(window.location.assign).toHaveBeenCalledWith("/comprovante?id=abc-123_xyz");
        });
    });

    // ==========================================
    // 6. TESTES PARA cadastrarAgendamento()
    // ==========================================
    describe("cadastrarAgendamento()", () => {

        // 1. Cria um spy no método assign do window.location
        let assignSpy;

        beforeEach(() => {
            // Se usar jest-location-mock, o reset limpa o estado
            reset(); 
            
            // Garante que o Jest está espionando a função
            assignSpy = jest.spyOn(window.location, 'assign').mockImplementation(() => {});
        });

        afterEach(() => {
            // Restaura a função original após cada teste
            assignSpy.mockRestore();
        });



        test("1. Deve coordenar todo o fluxo com sucesso (salvar no servidor, localStorage e redirecionar)", async () => {
            // Setup do DOM para obterDadosFormulario e obterServicosSelecionados
            document.body.innerHTML = `
                <input id="nome" value="Felipe" />
                <input id="profissional" value="Renato" />
                <input type="radio" name="sexo" value="M" checked />
                <input id="data" value="2026-09-01" />
                <input id="horario" value="09:00" />
                <input type="checkbox" class="serv" value="Barba" checked />
            `;

            // Mock do fetch com retorno de sucesso
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 50 })
            });

            // Chama a função principal
            cadastrarAgendamento();

            // Como as promises resolvem de forma assíncrona, aguardamos todos os microtasks
            await new Promise(process.nextTick);

            // Verifica se salvou no localStorage
            expect(localStorage.getItem("nomeCliente")).toBe("Felipe");
            expect(localStorage.getItem("listaServicos")).toBe("Barba");
            
            // Verifica se redirecionou para o comprovante
            expect(window.location.assign).toHaveBeenCalledWith("/comprovante?id=50");
        });

        test("2. Deve disparar alerta e logar erro se a requisição do servidor falhar", async () => {
            document.body.innerHTML = `
                <input id="nome" value="Felipe" />
                <input id="profissional" value="Renato" />
                <input type="radio" name="sexo" value="M" checked />
                <input id="data" value="2026-09-01" />
                <input id="horario" value="09:00" />
            `;

            global.fetch.mockResolvedValueOnce({
                ok: false
            });

            cadastrarAgendamento();
            await new Promise(process.nextTick);

            expect(window.alert).toHaveBeenCalledWith("Não foi possível salvar o agendamento. Tente novamente.");
            expect(console.error).toHaveBeenCalled();
        });

        test("3. Não deve modificar localStorage ou redirecionar se ocorrer falha na comunicação (fetch rejeitado)", async () => {
            document.body.innerHTML = `
                <input id="nome" value="Felipe" />
                <input id="profissional" value="Renato" />
                <input type="radio" name="sexo" value="M" checked />
                <input id="data" value="2026-09-01" />
                <input id="horario" value="09:00" />
            `;

            global.fetch.mockRejectedValueOnce(new Error("Network Error"));

            cadastrarAgendamento();
            await new Promise(process.nextTick);

            expect(localStorage.getItem("nomeCliente")).toBeNull();
            expect(window.location.assign).not.toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalledWith("Não foi possível salvar o agendamento. Tente novamente.");
        });
    });
});
