# Mentoria — Sessão 02 (2026-10-19)

> Identificação: `Agente: Mentor | Harness: Claude Code | Superfície: CLI (VPS)`.
> Frente: mentoria (`hq-mentoria` é o projeto principal; `hq-mulder` é coordenado junto). Project de execução: #22 "Mentoria".
> Continua a [sessão 01](./sessao_19102026_mentoria-01.md). Encerrada perto de 80k tokens (barra amarela, 74%) para retomar limpo.

## Aprendido (com as palavras do Gabriel)
1. Com o Codex do desktop apontando para a mesma pasta da VPS, "muda pouca coisa": código e clone são os mesmos.
   Conduta certa nesse caso, na fala dele: abrir **nova branch e PR**.
   - Ajuste do mentor: uma pasta tem uma só branch ativa; `git checkout -b` ali troca a branch de qualquer outra sessão na pasta.
     O contrato do `CLAUDE.md` resolve isso com uma worktree por frente (`worktrees/<frente>/`). Ver "Arrumar depois".
   - Diferença de harness: o Codex lê o `AGENTS.md`; o `context-guard` e o `.claude/settings.json` são do Claude Code. [INFERÊNCIA, não verificado no Codex]
2. A barra do `context-guard` mede o contexto contra o **teto de 100k** (não contra a janela do modelo): verde abaixo de 50k, amarelo de 50k a 80k,
   vermelho a partir de 80k (Dumb Zone); acima de 100k o toast pede o handoff. Verificado em `mods/context-guard/hooks/guard.ts` e na spec.
3. **Pendente:** o Gabriel ainda não explicou com as próprias palavras por que o limite de 100k existe se a janela do modelo é maior.

## Feito
- `main` local dos dois repos atualizada com `git fetch origin main:main` (sem trocar de branch).
  `hq-mentoria`: `2f32c43` → `f47b4c4` (merges dos PRs #13 e #14). `hq-mulder`: `1165cfd` → `4449188` (merges dos PRs #6 e #7).
- Os 4 PRs do handoff da sessão 01 estão todos **mergeados** pelo Gabriel (`hq-mentoria` #13 e #14; `hq-mulder` #6 e #7, em 19/10 às 08:43 e 08:44 UTC).
- **Issue `hq-mentoria` #2 testada** e comentada com handoff: o plugin `context-guard` carregou ao abrir na raiz e a barra apareceu; o perfil do Mentor foi
  seguido, na avaliação do Gabriel. Comentário: https://github.com/GabrielDBConsultoria/hq-mentoria/issues/2#issuecomment-6263852557.
  A issue **não foi fechada nem atribuída**: o fechamento é do Gabriel.
- **Não verificado (registrado na #2):** se o harness carregou `agents/mentoria/mentor.md` sozinho ou só por instrução do handoff.

## Teste em andamento: Dana Scully no Codex
O Gabriel abriu uma sessão do **Codex** no desktop `gabrielg15`, apontando para `mesas2/hq-mulder`, para a **Dana Scully** executar a issue `hq-mulder` #2
("Definir o AGENTS.md específico do Mulder"). Última conferência do mentor, durante esta sessão (Fato): issue sem comentário e sem responsável,
nenhum PR aberto, só a `main` no remoto, pasta do `hq-mulder` limpa e ainda na branch `docs/referencia-glossary` (já mergeada).
Resultado final da Dana: **desconhecido no fechamento desta sessão**.
O que revisar quando ela terminar (apontar, não corrigir):
- Comentou na issue com `Agente: Dana Scully | Harness: Codex | Superfície: Desktop (gabrielg15)`? Se não, é dado para `hq-mentoria` #12.
- Partiu da `main` atualizada (`4449188`), em branch ou worktree nova, sem commit direto na `main`?
- Respeitou o handoff: propor a seção do Mulder e deixar as decisões em aberto para o Gabriel, sem decidir escopo por conta própria.
- Pediu confirmação antes do push?

## Arrumar depois (não mexer agora)
- [ ] Mesas e worktrees: nesta sessão trabalhei numa branch dentro da pasta principal, e a Dana provavelmente fará o mesmo no `hq-mulder`. O `CLAUDE.md` manda
      `worktrees/<frente>/` (liga com `hq-mentoria` #10 e com o item 1 de melhorias do template).
- [ ] O estado do Project #22 não acompanhou os merges na hora: `hq-mulder` #1 e #5 devem ir para Done (não verifiquei se a automação faz isso).
- [ ] Branches já mergeadas ainda existem localmente (`docs/linguagem-ubiqua`, `docs/referencia-glossary`, `docs/regras-project-handoff-identificacao`); apagar quando o Gabriel quiser.
- [ ] Issue de acompanhamento sugerida: perfil carregado por configuração x por instrução (ainda não aberta).

## Oportunidades de melhoria do `repo-padrao-araca` (novas)
13. **Registro de sessão exige issue específica (gate do `AGENTS.md`), mas o template não traz issue-modelo para isso.** Mesma família do item 12 da sessão 01.
14. **Nada no template impede, por configuração, a troca de branch numa pasta compartilhada por dois harnesses** (Claude Code e Codex na mesma pasta da VPS).
    Só o texto do `CLAUDE.md` pede worktrees, e o `CLAUDE.md` só vale para o Claude Code. [INFERÊNCIA]

## HANDOFF para a próxima sessão
**Estado (fim de 19/10/2026):** os 4 PRs da sessão 01 estão mergeados e as `main` locais atualizadas. A issue `hq-mentoria` #2 foi testada e comentada (aguarda o Gabriel fechar).
A Dana Scully executa a `hq-mulder` #2 no Codex; resultado desconhecido. Este registro está na branch `docs/sessao-02-handoff`; issue e PR dependem de confirmação do Gabriel.
**Pendente do Gabriel:**
1. Confirmar a issue específica e o PR deste registro (gate do `AGENTS.md`); push só com confirmação.
2. Fechar a `hq-mentoria` #2 se concordar com o resultado.
3. Explicar com suas palavras por que o teto é 100k.
4. Decidir as issues `hq-mentoria` #3 a #5 e #7 a #12, e o destino de `SOUL-hq-exec.md` e `entrypoint-fixed.sh` (`hq-mulder` #4).
**Próxima ação única:** abrir o agente na raiz (`cd /srv/hqaraca/mesas2/hq-mentoria`), rodar o bloco "Embrião do INICIO-DO-DIA" (sessão 01), ler este arquivo e ver o que a Dana entregou na `hq-mulder` #2
(`gh issue view 2 --repo GabrielDBConsultoria/hq-mulder` e `gh pr list --repo GabrielDBConsultoria/hq-mulder`). Se houver PR, o Mentor revisa contra o handoff.
**Como retomar:** (1) bloco "Início do dia"; (2) `GLOSSARY.md`; (3) Project #22 (https://github.com/users/GabrielDBConsultoria/projects/22) filtrado pelo repo da pasta; (4) trabalhar por issue, branch e PR.
**Regras do mentor:** um passo por vez; Gabriel executa e explica com as próprias palavras; "isso já existe?" antes de criar; anotar bagunça em "arrumar depois"; conferir na fonte antes de afirmar.
