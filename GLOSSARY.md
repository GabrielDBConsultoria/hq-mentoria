# Linguagem ubíqua do HQ

Vocabulário compartilhado entre como o HQ trabalha (negócio) e como o agente é montado (arquitetura). Fonte única para `hq-mentoria` e `hq-mulder`. Os termos do mod `context-guard` estão em [`mods/context-guard/GLOSSARY.md`](./mods/context-guard/GLOSSARY.md). O [`CONTEXT.md`](./CONTEXT.md) da raiz fica só como redirecionamento legado.

## Como o HQ trabalha

**Frente**:
Linha de trabalho com objetivo e entrega próprios, que pode viver em um ou mais repos.
_Avoid_: projeto, área

**Mesa**:
Workspace local que agrupa o contexto de uma frente.
_Avoid_: pasta de repos

**Projeto**:
Iniciativa que percorre Discovery, PRD, OpenSpec e Apply até a entrega.
_Avoid_: quadro, Project

**Project**:
Quadro do GitHub que planeja o trabalho de um ou mais repos.
_Avoid_: projeto

**Project de execução**:
O Project declarado como governante de uma mudança; um repo pode participar de vários Projects.
_Avoid_: Project guia

**Sessão**:
Conversa contínua entre Gabriel e um agente num harness, do abrir ao encerrar.
_Avoid_: sessão para o registro escrito ou para a página do Notion

**Handoff**:
Registro que permite a outro agente continuar o trabalho sem o contexto de quem parou. Tem três formas: registro de sessão, issue handoff e snapshot de retomada.
_Avoid_: passagem, resumo

**Registro de sessão**:
Handoff escrito ao fim de uma sessão.
_Avoid_: sessão, ata

**Issue handoff**:
Handoff na forma de issue disponível para qualquer agente do HQ assumir.
_Avoid_: tarefa, ticket

**Snapshot de retomada**:
Handoff de 5 tópicos fixos (Frente Ativa, Última Ação, Trava Atual, Próximo Passo, Pendência do Gabriel), trocado entre agente e Gabriel pelas pastas Inbox/Outbox.
_Avoid_: resumo, status

**Esteira de agentes**:
Motor que orquestra o planejamento e a execução de uma frente: quais agentes estão envolvidos e as tarefas de cada um. Granularidade fina (subissues, subtarefas) fica na base de dados de tarefas do time no Notion, não na esteira.
_Avoid_: painel, painel de controle

**Painel de controle de retomada**:
Interface que visualiza a esteira de agentes de uma frente para retomada rápida.
_Avoid_: esteira, dashboard

**Memória canônica da frente**:
Página contínua com o estado, as decisões e o histórico de uma frente, para qualquer pessoa ou agente retomá-la. Vive como ponteiro reforçado (ver termo) entre o Notion e o repo `hq-registros`: o Notion guarda a página viva e curta por mesa (visão atual); o repo guarda só link, data do último sync e um resumo de 1 a 2 linhas. GitHub é dono do histórico; Notion é dono da visão atual.
_Avoid_: sessões da mesa, página de sessão

**Ponteiro reforçado**:
Padrão de memória canônica em que o repo não duplica o conteúdo do Notion — guarda só link, data do último sync e um resumo curto (1 a 2 linhas), o suficiente para um agente só-git decidir se precisa ir ler a página completa. Decidido para a Pergunta 5 do domain-modeling (`hq-mentoria#29`), em sessão de voz com perfil Dana, 22/11/2026; condicionado ao resultado dos testes de leitura do Notion sem ajuda, por harness (ver issues de teste em `hq-mentoria`).
_Avoid_: espelho, replicação completa, cópia

**Orion**:
Agente que conduz o aprendizado de Gabriel e revisa o trabalho dos demais agentes (papel: Mentor). Não é atrelado a um harness; atende por esse nome em qualquer harness, incluindo o Gemini/voz.
_Avoid_: Mentor como nome do agente (Mentor é o papel, não o nome), Fox Mulder, tutor

**Fox Mulder**:
Agente especialista em inteligência de ferramentas de IA e consultor de engenharia de harness.
_Avoid_: mentor, "Mulder" para o material de origem (diga material de origem do Mulder)

## Como o agente é montado

**Agente**:
Papel nomeado do HQ, com perfil e escopo próprios, independente do harness que o executa. Sem perfil carregado, vale "sem persona".
_Avoid_: nome de harness (Claude HQ, Codex HQ), modelo

**Harness**:
Programa que executa o agente e impõe permissões, ferramentas e hooks.
_Avoid_: agente, IDE, modelo

**Harness do projeto**:
O que um projeto define em volta do harness: contexto que orienta (`AGENTS.md`) mais configuração que impõe (`settings.json`, MCPs, hooks).
_Avoid_: "o harness" sozinho

**Superfície**:
Interface por onde Gabriel opera o agente. O servidor onde roda entra como qualificador, por exemplo `CLI (VPS)`.
_Avoid_: ambiente, host, plataforma

## Como os dois lados se ligam

- Toda sessão tem exatamente um agente, um harness e uma superfície. Trocar de agente ou de harness abre uma nova sessão, na mesma frente e no mesmo handoff.
- Uma frente é realizada por issues handoff, e o Project de execução as reúne.
- A memória canônica da frente e o registro de sessão guardam o que a frente decidiu e onde parou.
- Donos de domínio da memória canônica: Notion (visão atual) — Rita, substituta Kai; repos (histórico — `hq-registros`, `GLOSSARY.md`, ADRs) — Dana e Orion (Mentor); GitHub Projects — Kai.
- Orion e Fox Mulder são agentes; o perfil de cada um define o escopo.
- O harness do projeto é o que um projeto entrega ao harness para o agente trabalhar naquela frente.
