# 📡 Sistema de Gestão de Telecomunicações

Este é um projeto Full Stack desenvolvido com **.NET** , **Angular** e banco de dados **In-Memory (Entity Framework Core)**. Ele permite a gestão de contratos, operadoras, faturas e apresenta um dashboard com os resultados.

🚀 Como rodar o projeto
Pré-requisitos
NET 7 ou superior
Node.js 18+ e npm
Angular CLI (instale com npm install -g @angular/cli)

1. Clone o repositório

2. Backend (.NET) — Banco InMemory
O backend já está configurado para rodar com banco InMemory por padrão, facilitando testes e desenvolvimento sem necessidade de instalar banco de dados.

2.1. Acesse a pasta do backend
     cd ApiTelecom/ApiTelecom

2.2. Instale as dependências
     dotnet restore

2.3. Rode o backend
     dotnet run

A API estará disponível em https://localhost:5036 (ou porta exibida no terminal).
Acesse a documentação Swagger em https://localhost:5036/swagger.

3. Frontend (Angular)
   cd ../../Frontend

3.2. Instale as dependências
     npm install

3.3. Rode o frontend
     ng serve

Acesse o app em http://localhost:4200

## 📧 Envio de e-mails

- Para testar o envio real de e-mails, configure seu e-mail e senha de app do Gmail no backend (`ContratoController.cs`).
- Por padrão, o envio é simulado.

---

## 📝 Observações

- O backend está configurado para rodar apenas com banco InMemory por padrão.
- Para produção, recomenda-se usar PostgreSQL, mas será necessário ajustar o código para suportar essa opção.
