# GabGym Mobile — revisão de 27/11/2026

## Navegação e acesso
Cabeçalho sem menu de logo, selo de rota ou links duplicados. Barra lateral permanente em desktop (1024px ou mais); dock mobile também atende tablet. Entrada mobile com fotografia e ações na primeira viewport, formulários compactos. A fotografia anterior fica preservada no histórico Git e como alternativa de referência: Unsplash photo-1770616756218-f0abe20da404, Prateek Saxena, HRsaEyu_3B0. A nova fotografia principal usa Sushil Ghimire, eFx1KZhaSvo.

## Onboarding
Sete etapas. Sexo biológico, objetivo e medidas são opcionais; somente campos preenchidos são enviados à API de perfil já existente após verificar o ID da sessão. Experiência, tempo de prática e foco muscular são preferências locais segregadas por conta e não geram rotinas automaticamente. A escolha de modo e pelo menos um módulo é obrigatória. As ilustrações musculares são esquemáticas, não diagnóstico nem anatomia clínica.

## Google (pendente)
Não há botão falso. Para integração real: criar cliente OAuth Web no Google Cloud, cadastrar origens oficiais e de homologação; implementar no Spring Boot a validação do ID token (assinatura, emissor, audience, expiração e nonce quando aplicável), associação única pelo subject do Google, tratamento explícito de vinculação de contas existentes, proteção contra takeover e emissão do JWT GabGym com papel STUDENT exclusivamente. Não enviar client secret ao frontend. Preservar autenticação atual e MFA quando aplicável. Testar tokens inválidos, expirados, audience incorreta, duplicidade e papéis. Não habilitar até homologação com conta de teste.

## Publicação
PR #31, sem alteração da produção. O backend piloto ainda precisa receber a API de preferências da PR #7; confirmação do backup recuperável permanece pendente.
