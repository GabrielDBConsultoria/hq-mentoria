# HANDOFF — Cosmic Python cap. 1 (MN-1)

**Atualizado:** 2026-11-11  
**Persona:** [Mentor](./agents/mentoria/mentor.md) · Trilha **MN-1** — Domain Model

## Onde está o código (não está neste repo)

| Item | Valor |
|------|--------|
| **Caminho na VPS** | `/srv/hqaraca/mesas2/code` |
| **Acesso** | `ssh vps-hqaraca` (ou terminal na sessão `hq-exec@srv1885671`) |
| **Fork GitHub** | `GabrielDBConsultoria/code` |
| **Upstream (livro)** | `cosmicpython/code` |
| **Branch de prática** | `mentoria/cap01-allocation` alinhada a `chapter_01_domain_model` |

**Importante:** o Cloud Agent / Agent Window **não** vê a VPS. Toda edição e execução de `pytest` é **na VPS** (terminal ou IDE apontando para esse path).

## Capítulo atual

- **Livro:** *Architecture Patterns with Python* — **Cap. 1 — Domain Model**
- **Arquivos na raiz do clone:** `model.py`, `test_batches.py`, `test_allocate.py` (layout plano do livro)
- **Leitura:** [cap. 1 — Some Notes on Allocation](https://www.cosmicpython.com/book/chapter_01_domain_model.html)

## Último passo registrado

- Consulta aos arquivos do capítulo via `gh api` em `cosmicpython/code` @ `chapter_01_domain_model` (ex.: `test_batches.py`).
- Na VPS: alinhar branch com `upstream/chapter_01_domain_model` e ambiente `pytest`.

## Próximo passo único

Na VPS, dentro do clone:

```bash
cd /srv/hqaraca/mesas2/code
source .venv/bin/activate   # se já existir
pytest -q
```

Meta: **12 passed** (upstream) ou **13+** se já houver teste seu de duas alocações.

Depois (hands-on): usar o [Canvas — guia pytest cap. 1](https://cursor.com/canvas/store-b873b4f4-e73c-442e-be24-180884a5d923/1ca7b675-3ff6-4732-8e83-c474df93a2ec) e **escrever** um teste novo em `test_batches.py`; explicar por que `can_allocate` exige `disponível ≥ pedido`.

## Fluxo e sessões (HQ)

- Fluxo detalhado no Project **mentoria** (Context): *Fluxo prática cap. 1*
- Handoffs longos de mentoria: `sessoes/AAAA-MM/` neste repo
- **Arrumar depois:** habilitar **Issues** em `GabrielDBConsultoria/code` (hoje desligadas no fork)

## Regra Mentor (resumo)

Um passo por vez · Gabriel executa · explica com palavras próprias · primeiro commit no fork = código **dele**, não só mirror do upstream.
