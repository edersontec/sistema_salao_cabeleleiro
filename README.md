# Sistema Salão Cabeleireiro ( Studio Maison 💇‍♀️)

Sistema web para gerenciamento de um salão de cabeleireiro, desenvolvido com foco em organização, modularização e evolução de um projeto estático para uma aplicação Node.js.

Nome fictício: Studio Maison

## 🎯 Objetivos do projeto

O principal objetivo deste projeto é evoluir e modernizar um sistema web para salão de cabeleireiro, adicionando novas funcionalidades e aplicando boas práticas de desenvolvimento.

- 🔄 Converter o projeto estático em uma aplicação Node.js.
- 🎨 Utilizar EJS para criação de templates dinâmicos.
- 🧩 Refatorar o código, tornando a aplicação mais modular e seguindo o princípio da Responsabilidade Única (SRP).
- 🧪 Implementar testes unitários utilizando Jest.
- 📅 Criar uma funcionalidade para agendamento de horários.
- ⭐ Criar uma funcionalidade para avaliação dos serviços.
- 📱 Desenvolver um design responsivo e moderno, proporcionando uma boa experiência em diferentes tamanhos de tela.

## 🛠️ Stack utilizada

As principais tecnologias utilizadas no desenvolvimento do projeto são:

- Node.js — ambiente de execução da aplicação.
- EJS — mecanismo de templates para renderização das páginas.
- SQLite — banco de dados utilizado pela aplicação.
- Jest — framework utilizado para testes unitários.

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado em sua máquina:

- Node.js
- npm
- Git

## 🚀 Como executar o projeto

1. Clone o repositório
```
git clone https://github.com/edersontec/sistema_salao_cabeleleiro.git
```

2. Acesse o diretório do projeto
```
cd sistema_salao_cabeleleiro
```

3. Instale as dependências
Inicialmente, tente instalar as dependências normalmente:
```
npm ci
```
Caso ocorra um problema durante a instalação relacionado à biblioteca better-sqlite3, utilize:
```
npm ci --ignore-scripts
```
Observação: a opção --ignore-scripts pode ser necessária devido a um problema relacionado à instalação dos prebuilt binaries ao importar a biblioteca better-sqlite3, fazendo com que o npm acione o node-gyp de forma inadequada.
Mais informações podem ser encontradas na seguinte issue: https://github.com/WiseLibs/better-sqlite3/issues/1516

4. Configure as variáveis de ambiente

Renomeie o arquivo .env.example para .env:
```
mv .env.example .env
```
No Windows, o arquivo também pode ser renomeado manualmente. Depois, abra o arquivo .env e preencha as informações necessárias para execução da aplicação.

5. Inicie o servidor

Execute:
```
node server.js
```
Observação: o banco de dados SQLite será criado automaticamente durante a execução do projeto, caso ainda não exista.

## 🧪 Executando os testes

Para executar os testes unitários utilizando o Jest, execute:
```
npm test
```

## 📌 Funcionalidades

O projeto tem como objetivo disponibilizar funcionalidades para gerenciamento e utilização do salão de cabeleireiro. As principais são: Agendamento de horários e avaliação dos serviços.

A lista será atualizada conforme as funcionalidades forem implementadas.

## 🏗️ Arquitetura e boas práticas

Durante a evolução do projeto, o código está sendo refatorado com o objetivo de melhorar sua organização, manutenção e escalabilidade.

Entre os princípios adotados estão:

- Single Responsibility Principle (SRP) — cada módulo deve possuir uma responsabilidade bem definida.
- Modularização — separação das responsabilidades em diferentes módulos.
- Testabilidade — criação de testes unitários para garantir o comportamento esperado da aplicação.
- Templates reutilizáveis — utilização do EJS para evitar duplicação de código nas páginas.
- Responsividade — adaptação da interface para diferentes dispositivos e tamanhos de tela.

## 🤝 Contribuindo

Contribuições são muito bem-vindas!

Se você encontrou algum problema, possui uma sugestão ou deseja implementar uma nova funcionalidade, fique à vontade para contribuir com o projeto.

### Fluxo sugerido

- Faça um fork do projeto.
- Crie uma branch para sua alteração: *git checkout -b minha-nova-feature*
- Faça as alterações desejadas.
- Execute os testes: *npm test*
- Faça o commit das alterações: *git commit -m "feat: adiciona nova funcionalidade"*
- Envie sua branch: *git push origin minha-nova-feature*
- Abra um Pull Request.

## 📄 Licença

Este projeto foi desenvolvido para fins de estudo e desenvolvimento.
Sinta-se à vontade para explorar, estudar e contribuir com o projeto. 🚀
