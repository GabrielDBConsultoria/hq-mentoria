# HANDOFF — Cosmic Python, capítulo 1 (Domain Model)

> **Task:** MN-1 · **Livro:** *Architecture Patterns with Python* (Cosmic Python)  
> **Atualizado:** 2026-11-12 (America/Sao_Paulo)

## Onde estamos

- **Capítulo:** 1 — *Domain Model*
- **Branch de referência:** `chapter_01_domain_model` em [cosmicpython/code](https://github.com/cosmicpython/code)
- **Fork:** [GabrielDBConsultoria/code](https://github.com/GabrielDBConsultoria/code)
- **Última ação registrada (Cloud):** conteúdo de `test_batches.py` obtido com  
  `gh api repos/cosmicpython/code/contents/test_batches.py?ref=chapter_01_domain_model`
- **Pendência pedagógica:** explicar o que `test_allocating_to_a_batch_reduces_the_available_quantity` garante no domínio (2–3 frases suas)
- **Histórico:** na VPS os 12 testes do cap. 1 já tinham passado antes da sessão travar

## Onde está o código (não está nesta VM / Agent Window)

| Item | Caminho |
|---|---|
| Clone na VPS | `/srv/hqaraca/mesas2/code` |
| Domínio | `model.py` na **raiz** do repo (junto com `test_batches.py`, `test_allocate.py`) |
| Branch local (quando existir) | `mentoria/cap01-allocation` alinhada a `upstream/chapter_01_domain_model` |

O **Agent Window do Cursor Cloud não enxerga a VPS**. Editar, rodar testes e commits acontecem no **terminal da VPS** ou em sessão local/desktop com o clone — não assumir que o agente na nuvem vê esses arquivos.

## Como chegar no código

### SSH na VPS

```bash
ssh vps-hqaraca
cd /srv/hqaraca/mesas2/code
pwd && ls -la model.py test_batches.py
```

### Conferir branch e remotes

```bash
git status
git branch -a
git remote -v
```

Se o clone não existir ou estiver vazio, clonar a branch do capítulo:

```bash
git clone --branch chapter_01_domain_model https://github.com/cosmicpython/code.git
# ou usar o fork + fetch da upstream
```

## Próximo passo único (operacional)

Na VPS (ou no clone local equivalente), na raiz do repo:

```bash
pytest -q
```

Se passar: abrir `test_batches.py` (primeiro teste) e `model.py` (`Batch`, `allocate`, `available_quantity`) e responder à pendência pedagógica acima.

## O que cada superfície faz

| Superfície | Papel |
|---|---|
| **Agent Window (Cursor Cloud)** | Condução, handoffs, `gh api`/GitHub — **sem** acesso ao disco da VPS |
| **Terminal VPS / SSH** | `pytest`, editar `model.py`, git no clone real |
| **IDE local (VS Code / mesa)** | Abrir este `HANDOFF.md` + worktree/clone se estiver no desktop |

## Referências rápidas

- Orion (Mentor): `agents/mentoria/orion.md` (um passo por vez; você executa, Orion conduz)
- Retomada anterior (Project store): `internal/retomada-mn1-cap01-2026-11-06.md` no store do Project mentoria
- Sessões versionadas: `sessoes/` neste repo

---

**Menu após o pytest:** (1) fechar explicação do teste · (2) exercício `chapter_01_domain_model_exercise` · (3) preparar push/PR no fork
