# GABGYM — Frontend e autenticação real

> Branch de revisão: não publicar sem backend e banco de staging configurados.

## Atualizações

- Login e cadastro integrados ao Spring Boot, com erro de credenciais versus indisponibilidade.
- `/users/me` verifica usuário no servidor; a tela usa a resposta real do backend.
- Tokens JWT no `sessionStorage`; o login legado era feito com `localStorage` e foi limpo.
- O logout faz `POST /users/logout` no servidor, invalida a versão de sessão e remove credenciais locais.
- Rotas de dados pessoais usam guardas no navegador; **a autorização verdadeira permanece no backend**.
- `/admin` mostra lista e perfil de alunos apenas para `SUPER_ADMIN`.
- Serviço Axios central com tratamento de erro e configuração da origem da API.

## Conectando frontend e backend

1. Render com uma API acessível por HTTPS e endpoint `GET /ping` respondendo 200.
2. Configurar Vercel `REACT_APP_API_URL=https://GABGYM-API.onrender.com/api` (exemplo, NÃO URL real).
3. Configurar no Render `CORS_ORIGIN=https://SEU-FRONTEND.vercel.app` (URL exata, sem barra ao final).
4. Executar build do frontend **após** mudar a variável REACT_APP_API_URL; ela é injetada no build.
5. Testar login de aluno, perfil, metas, diário, logout e painel superadmin.
6. Configurar rewrite da Vercel para o React Router atender refresh de `/admin` e `/perfil`, se necessário.

## Testes

- `npm install --legacy-peer-deps`
- `CI=true npm test -- --watch=false --runInBand`
- `npm run build`

**Atenção:** esta versão usa o legado Create React App e o `package-lock.json` não está em sincronia com o `package.json`. Atualizar o lock e retirar `--legacy-peer-deps` será uma tarefa de manutenção, preferencialmente na etapa de modernização para Vite; o CI atual usa instalação compatível com o projeto antigo, ainda não é o processo ideal.

## Próximas tarefas

- E2E em navegador contra backend de staging, antes de anunciar sistema pronto.
- Recuperação de senha, MFA para administrador e fluxo de expiração de sessão.
- Layout do superadmin, navegação mobile, revisão de acessibilidade e design do login (fase 2).
- Política de privacidade e fluxos de exportação/remoção de dados de aluno.
