# Linguagem do mod context-guard

Vocabulário do indicador de contexto em uso. Não é a linguagem ubíqua do HQ; essa está no [`GLOSSARY.md`](../../GLOSSARY.md) da raiz.

## Language

**Contexto em uso**:
Tokens de entrada da última resposta do modelo. Medido, não estimado; pode estar ausente (sessão nova, logo após compactação).
_Avoid_: Consumo, uso de tokens, tamanho do contexto

**Dumb Zone**:
Fenômeno de degradação da qualidade do raciocínio do modelo quando o contexto em uso fica alto. É o que queremos evitar.
_Avoid_: Zona burra

**Teto**:
Contexto em uso máximo que o Gabriel aceita (100k). Política dele, não limite da janela do modelo.
_Avoid_: Limite, janela

**Teto efetivo**:
O menor valor entre o teto e a janela do modelo. Igual ao teto em todo modelo com janela de 100k ou mais.
_Avoid_: Teto real, limite efetivo

**Faixa**:
Estado do indicador definido pelo contexto em uso: **Segura** (abaixo de 50k), **Atenção** (50k a 79k) e **Risco** (80k ou mais, entrada na Dumb Zone). Limiares absolutos; viram 50% e 80% do teto efetivo só quando a janela é menor que o teto.
_Avoid_: Nível, status, Dumb Zone Risk

**Alerta**:
Aviso que sugere `/handoff`. São dois, cada um emitido uma vez por cruzamento: o **alerta de risco**, ao entrar na faixa Risco, e o **alerta de teto**, ao passar do teto efetivo.
_Avoid_: Notificação, warning, lembrete
