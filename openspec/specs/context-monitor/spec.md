# context-monitor Specification

## Purpose
Mostrar ao usuário, de forma contínua e legível, o contexto em uso do Claude Code em relação ao teto de 100k tokens, para que ele aja antes de entrar na Dumb Zone (degradação do raciocínio do modelo).

## Requirements

### Requirement: Leitura do contexto em uso
O sistema SHALL obter a cada atualização o contexto em uso (total de tokens de entrada da última resposta da sessão, `total_input_tokens`) e o tamanho da janela do modelo, a partir dos dados da própria sessão do Claude Code.

#### Scenario: Dados disponíveis
- **WHEN** a sessão já recebeu ao menos uma resposta do modelo
- **THEN** o indicador usa o total de tokens de entrada dessa resposta como contexto em uso

#### Scenario: Atualização após cada turno
- **WHEN** um turno termina e o contexto em uso muda
- **THEN** o indicador reflete o novo valor sem ação do usuário

### Requirement: Teto efetivo
O sistema SHALL usar como teto efetivo o menor valor entre o teto (100.000 tokens) e a janela do modelo. Quando a janela for maior ou igual ao teto, os limiares SHALL ser os absolutos (50.000 e 80.000); quando for menor, SHALL ser 50% e 80% do teto efetivo.

#### Scenario: Janela maior que o teto
- **WHEN** a janela do modelo é 200.000 tokens
- **THEN** o teto efetivo é 100.000 e os limiares são 50.000 e 80.000

#### Scenario: Janela menor que o teto
- **WHEN** a janela do modelo é 64.000 tokens
- **THEN** o teto efetivo é 64.000 e os limiares são 32.000 e 51.200

### Requirement: Percentual relativo ao teto efetivo
O sistema SHALL calcular o percentual como contexto em uso dividido pelo teto efetivo, e SHALL exibir o valor em tokens (formato `Nk`) junto ao percentual.

#### Scenario: Cálculo básico
- **WHEN** o contexto em uso é 40.000 tokens e o teto efetivo é 100.000
- **THEN** o indicador mostra 40k e 40%

### Requirement: Faixas
O sistema SHALL classificar o contexto em uso em três faixas pelos limiares do teto efetivo (por padrão 50.000 e 80.000): abaixo do limiar de Atenção como Segura (`🟢`, verde); do limiar de Atenção até abaixo do limiar de Risco como Atenção (`⚠️`, amarelo); no limiar de Risco ou acima como Risco (`🚨`, vermelho; entrada na Dumb Zone).

#### Scenario: Início da sessão
- **WHEN** o contexto em uso é 0 tokens
- **THEN** o indicador mostra a faixa Segura com `🟢`

#### Scenario: Último valor seguro
- **WHEN** o contexto em uso é 49.999 tokens
- **THEN** o indicador ainda mostra a faixa Segura

#### Scenario: Limite inferior da atenção
- **WHEN** o contexto em uso é 50.000 tokens
- **THEN** o indicador mostra a faixa Atenção com `⚠️`

#### Scenario: Último valor de atenção
- **WHEN** o contexto em uso é 79.999 tokens
- **THEN** o indicador ainda mostra a faixa Atenção

#### Scenario: Limite inferior do risco
- **WHEN** o contexto em uso é 80.000 tokens
- **THEN** o indicador mostra a faixa Risco com `🚨`

### Requirement: Barra visual dinâmica
O sistema SHALL exibir uma barra de progresso proporcional ao percentual, colorida conforme a faixa, acompanhada do ícone, dos tokens e do percentual, visível durante a sessão sem comando do usuário.

#### Scenario: Barra proporcional
- **WHEN** o contexto em uso é 50.000 tokens e o teto efetivo é 100.000
- **THEN** a barra aparece preenchida pela metade, na cor da faixa Atenção

### Requirement: Alerta de risco
O sistema SHALL emitir um aviso sugerindo `/handoff` quando o contexto em uso passar de abaixo do limiar de Risco para o limiar ou acima, e SHALL NOT repeti-lo enquanto o contexto em uso permanecer no limiar ou acima.

#### Scenario: Cruzamento
- **WHEN** o contexto em uso passa de 79.000 para 82.000 tokens
- **THEN** um aviso sugerindo `/handoff` é exibido uma única vez

#### Scenario: Sem repetição
- **WHEN** o contexto em uso continua acima de 80.000 nos turnos seguintes, ainda abaixo do teto efetivo
- **THEN** nenhum novo aviso é exibido

#### Scenario: Rearme após queda
- **WHEN** o contexto em uso cai abaixo de 80.000 (por exemplo, após compactação) e depois volta a cruzá-lo
- **THEN** o aviso é exibido novamente

### Requirement: Alerta de teto
O sistema SHALL emitir um segundo aviso, mais enfático e sugerindo `/handoff`, quando o contexto em uso passar de abaixo do teto efetivo para o teto efetivo ou acima, e SHALL NOT emitir outros avisos acima do teto. O rearme segue a mesma regra do alerta de risco.

#### Scenario: Cruzamento do teto
- **WHEN** o contexto em uso passa de 98.000 para 101.000 tokens
- **THEN** um aviso de teto ultrapassado sugerindo `/handoff` é exibido uma única vez

#### Scenario: Salto direto acima do teto
- **WHEN** o contexto em uso passa de 75.000 para 105.000 tokens em um turno
- **THEN** apenas o alerta de teto é exibido

#### Scenario: Sem lembretes adicionais
- **WHEN** o contexto em uso continua subindo acima do teto efetivo
- **THEN** nenhum novo aviso é exibido

### Requirement: Overflow acima do teto efetivo
O sistema SHALL tratar contexto em uso acima do teto efetivo como faixa Risco, limitar a barra a 100% e indicar o excesso (por exemplo `105k` e `100%+`), sem erro nem truncamento do valor em tokens.

#### Scenario: Contexto em uso de 105k
- **WHEN** o contexto em uso é 105.000 tokens e o teto efetivo é 100.000
- **THEN** o indicador mostra `🚨`, barra cheia e o valor 105k com marca de excesso

### Requirement: Ausência de dados
O sistema SHALL mostrar um estado neutro (sem faixa e sem alerta) quando não houver contexto em uso disponível, e SHALL NOT exibir 0% falso nem falhar.

#### Scenario: Sessão nova
- **WHEN** ainda não houve resposta do modelo
- **THEN** o indicador mostra estado neutro (por exemplo `ctx --`)

#### Scenario: Logo após compactação
- **WHEN** o contexto foi compactado e ainda não há nova resposta
- **THEN** o indicador mostra estado neutro até o próximo dado

### Requirement: Degradação em terminais simples
O sistema SHALL funcionar sem cores 256 e sem Unicode: com `NO_COLOR` definido ou terminal sem suporte, SHALL exibir texto puro ASCII (por exemplo `[#####-----] 50k 50% ATENCAO`) preservando a mesma informação.

#### Scenario: NO_COLOR definido
- **WHEN** `NO_COLOR` está definido no ambiente
- **THEN** o indicador não emite códigos de cor e indica a faixa por texto

#### Scenario: Terminal sem Unicode
- **WHEN** o terminal não suporta os ícones Unicode
- **THEN** a faixa é indicada por rótulo em texto (SEGURA, ATENCAO, RISCO)

### Requirement: Habilitação por projeto
O sistema SHALL vir habilitado por padrão em todo projeto criado a partir do template, e SHALL poder ser desligado pelo mecanismo nativo de plugins do Claude Code: na configuração versionada do projeto (para todos) ou na configuração local não versionada (só para o usuário).

#### Scenario: Projeto novo
- **WHEN** um projeto é criado a partir do template e aberto no Claude Code
- **THEN** o indicador aparece sem passo manual

#### Scenario: Desligado para todos
- **WHEN** o mod é desabilitado na configuração versionada do projeto
- **THEN** o indicador não aparece para ninguém naquele projeto

#### Scenario: Desligado só para o usuário
- **WHEN** o mod é desabilitado na configuração local do projeto
- **THEN** o indicador não aparece para esse usuário e continua para os demais

### Requirement: Desempenho e portabilidade
O sistema SHALL calcular e montar o indicador em menos de 50 ms por atualização, SHALL NOT exigir dependências de runtime além do Claude Code, e SHALL funcionar em Linux e macOS.

#### Scenario: Orçamento de latência
- **WHEN** o indicador é atualizado
- **THEN** o cálculo e a renderização consomem menos de 50 ms

### Requirement: Isolamento de falhas
O sistema SHALL NOT interromper, bloquear ou alterar o fluxo da sessão se a leitura ou a exibição falhar; em caso de falha SHALL ocultar o indicador ou mostrar o estado neutro.

#### Scenario: Falha ao ler o contexto em uso
- **WHEN** a leitura do contexto em uso gera erro
- **THEN** a sessão continua normalmente e o indicador mostra estado neutro
