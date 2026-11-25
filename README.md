# Estoquei!

**Estoquei! — Controle de Estoque Simples**

Sistema de gerenciamento de estoque desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso de **Ensino Médio Integrado ao Técnico em Desenvolvimento de Sistemas da ETEC de Hortolândia**, em 2026.

O projeto é voltado para **microempresas e pequenos empreendedores**, oferecendo uma solução simples e acessível para organização e controle de estoque.

---

## Sobre o projeto

Muitas microempresas realizam o controle de seus produtos por meio de planilhas, anotações em papel ou outros métodos manuais, o que pode dificultar o acompanhamento das quantidades disponíveis e ocasionar erros nos registros.

O **Estoquei!** busca facilitar esse processo por meio do cadastro de produtos e do acompanhamento das movimentações de entrada e saída de mercadorias.

### Objetivos

- Organizar as informações dos produtos;
- Facilitar o controle de estoque;
- Reduzir erros causados por processos manuais;
- Acompanhar as movimentações de estoque;
- Auxiliar na administração dos produtos;
- Oferecer uma interface simples e acessível.

---

# Projeto Web

O **Estoquei! Web** permite o gerenciamento dos produtos e das informações relacionadas ao estoque por meio de navegadores.

### Funcionalidades

- Cadastro e login de usuários;
- Cadastro, consulta e pesquisa de produtos;
- Filtro por status do estoque;
- Dashboard;
- Registro de entrada e saída de produtos;
- Atualização da quantidade disponível;
- Histórico de movimentações;
- Organização por categorias;
- Visualização de estatísticas;
- Relatórios básicos de estoque.

### Tecnologias

- HTML5
- CSS3
- JavaScript
- TypeScript
- React

### Configuração do Firebase

O site usa a configuração do aplicativo Web do Firebase para acessar a autenticação e o Firestore.
Configure `VITE_PUBLIC_FIREBASE_API_KEY`, `VITE_PUBLIC_FIREBASE_PROJECT_ID` e `VITE_PUBLIC_FIREBASE_APP_ID` com os dados públicos do mesmo aplicativo Web.
O Vite inclui esses valores no JavaScript do navegador. Não use valores protegidos, chaves de servidor ou credenciais administrativas nesse prefixo.
Na Netlify, não mantenha os mesmos valores públicos cadastrados também como segredos: a verificação de segredos bloqueará o deploy se eles aparecerem no JavaScript.
Para rodar localmente, use um arquivo `.env.local`; nos ambientes publicados, forneça essa configuração antes da compilação.

---

# Projeto Mobile

O **Estoquei! Mobile** disponibiliza as principais funcionalidades do sistema em uma aplicação para smartphones.

### Funcionalidades

- Login e cadastro de usuários;
- Dashboard;
- Cadastro e consulta de produtos;
- Visualização de informações dos produtos;
- Registro de entradas e saídas;
- Histórico de movimentações;
- Visualização de estatísticas;
- Navegação pelas áreas do sistema.

### Tecnologias

- React Native
- TypeScript
- Expo
- Expo Router

---

# Back-end

O back-end é responsável pelo gerenciamento e armazenamento das informações utilizadas pelas aplicações Web e Mobile.

### Principais funções

- Autenticação de usuários;
- Gerenciamento de produtos;
- Gerenciamento de categorias;
- Registro das movimentações de estoque;
- Armazenamento das informações dos fornecedores.

### Banco de dados

O sistema armazena informações relacionadas a:

- Usuários;
- Produtos;
- Categorias;
- Movimentações de estoque.

---

# Tecnologias e ferramentas

- **Web:** HTML5, CSS3, JavaScript, TypeScript e React
- **Mobile:** React Native, TypeScript, Expo e Expo Router
- **Back-end:** Firebase
- **Ferramentas:** Visual Studio Code e GitHub

---

# Principais telas

- Tela inicial;
- Login;
- Cadastro de usuário;
- Dashboard;
- Cadastro de produtos;
- Lista de produtos;
- Detalhes do produto;
- Registro de movimentações;
- Histórico de movimentações;
- Estatísticas.

---

# Equipe

- **Kauã da Silva Padovani**
- **Miguel Camilo da Silva**
- **Nicolas Henrique Chereda Pereira**
- **Paulo Alves Estevão**

**ETEC de Hortolândia**  
Ensino Médio Integrado ao Técnico em Desenvolvimento de Sistemas — **2026**

---

# Status

**Em desenvolvimento**
