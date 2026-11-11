# GabGym — Frontend 💪

Interface web do **GabGym**, desenvolvida para facilitar o acompanhamento diário de **treinos, alimentação, cardio e metas pessoais**, com atenção especial à experiência no celular.

## Tecnologias

**React** · **JavaScript** · **React Router** · **Axios** · **Create React App** · **CSS**

## Funcionalidades

- Tela inicial com visão geral do dia e do progresso.
- Registro e acompanhamento de treinos e cardio.
- Diário alimentar e biblioteca de alimentos.
- Metas, perfil, histórico e biblioteca de exercícios.
- Área **Meu Personal**, com acesso próprio para o profissional acompanhar alunos.
- Integração com a API Java do GabGym.

## Executar localmente

**Pré-requisito:** Node.js e npm instalados.

```bash
npm install
npm start
```

A aplicação abre, normalmente, em **http://localhost:3000**.

Crie um arquivo `.env` com base em [`.env.example`](./.env.example):

```env
REACT_APP_API_URL=http://localhost:8080/api
```

Outros comandos:

```bash
npm test
npm run build
```

## Organização

- `src/pages/` — telas do aplicativo.
- `src/components/` — componentes reutilizáveis.
- `src/utils/` — funções e regras auxiliares.
- `public/` — imagens e arquivos estáticos.

**Backend:** [gabgym_backend_java_V2](https://github.com/Ivano-Gabriel/gabgym_backend_java_V2)  
**Status:** projeto em desenvolvimento, com melhorias contínuas de interface e funcionalidades.
