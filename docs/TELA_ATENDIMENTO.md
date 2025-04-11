# Documentação de Funcionamento - Painel do Atendente "Q Fila"

**1. Visão Geral**

O Painel do Atendente é a interface principal utilizada pela equipe da clínica/hospital (recepcionistas, enfermeiros, médicos, etc.) para gerenciar as filas de atendimento e chamar os pacientes. É uma aplicação web que requer autenticação e permite ao usuário interagir com as senhas geradas pelos Quiosques para um determinado serviço ou estação.

**2. Componente Painel do Atendente**

* **Tecnologia:** Aplicação Web, acessível via navegador (desktop, tablet). Desenvolvida preferencialmente com React/Next.js.
* **Acesso:** Requer login e senha de um usuário cadastrado no sistema "Q Fila" com `role` apropriado (ex: 'atendente', 'admin\_cliente').
* **Conectividade:** Necessita de conexão estável com a internet para comunicação em tempo real com o backend e recebimento de atualizações da fila.

**3. Fluxo de Acesso e Preparação**

1.  **Login:** O usuário acessa a URL da aplicação e insere seu email e senha cadastrados. O sistema valida as credenciais e o `cliente_id` associado.
2.  **Seleção de Estação:** Após o login bem-sucedido, o sistema solicita que o usuário selecione em qual `Estacao` ele está trabalhando durante aquela sessão. A lista de estações disponíveis é filtrada pelo `cliente_id` e, potencialmente, pelos serviços que o usuário pode atender.
3.  **Carregamento do Painel:** Uma vez selecionada a estação, a interface principal do painel é carregada, exibindo as informações relevantes para aquela estação/serviço.

**4. Interface Principal (Painel da Estação)**

A tela principal é dividida em áreas funcionais:

* **Identificação:** Exibe o nome do usuário logado e o `nome_exibicao` da `Estacao` selecionada. Inclui um botão de `[Logout]` ou `[Trocar Estação]`.
* **Área da Fila de Espera:**
    * Mostra uma lista ou tabela das senhas com `status = 'aguardando'` para o(s) serviço(s) associado(s) à estação selecionada.
    * Colunas/Informações por senha: `numero_senha`, `nivel_prioridade` (com destaque visual para níveis > 0), `data_criacao` ou Tempo de Espera calculado.
    * Ordenação: Geralmente por `nivel_prioridade` (maior primeiro) e depois por `data_criacao` (mais antigo primeiro).
    * Atualização: A lista deve ser atualizada em tempo real à medida que novas senhas são geradas no Quiosque.
* **Área da Senha Ativa (Chamada / Em Atendimento):**
    * Uma área de destaque que mostra a senha que está sendo gerenciada ativamente por este atendente/estação (`status = 'chamado'` ou `status = 'em_atendimento'`).
    * Exibe: `numero_senha`, `paciente_nome` (se disponível), `paciente_telefone` (se disponível), tempo decorrido desde a chamada (`data_chamada`).
* **Botões de Ação:**
    * `[Chamar Próximo]`: Botão principal, habilitado quando não há uma senha ativa sendo gerenciada. Dispara a lógica de seleção da próxima senha no backend.
    * `[Iniciar Atendimento]`: Habilitado quando uma senha está com `status = 'chamado'`. Confirma a presença do paciente e muda o status.
    * `[Não Compareceu]`: Habilitado quando uma senha está com `status = 'chamado'`. Marca a senha como não compareceu.
    * `[Finalizar Atendimento]`: Habilitado quando uma senha está com `status = 'em_atendimento'`. Conclui o ciclo de atendimento naquela estação.
    * (Opcional) `[Chamar Senha Específica]`: Permite chamar uma senha fora de ordem (requer permissão?).
    * (Opcional) `[Cancelar Senha]`: Remove uma senha da fila (requer permissão?).

**5. Fluxo de Operação (Ações do Atendente)**

1.  **Chamar Senha:**
    * Atendente clica em `[Chamar Próximo]`.
    * Frontend envia requisição ao backend.
    * Backend aplica a lógica de prioridade, seleciona a próxima senha (ID Z), atualiza seu `status` para `'chamado'`, registra `data_chamada`, `estacao_chamadora_id`, `usuario_atendente_id`.
    * Backend retorna dados da Senha Z para o frontend.
    * Frontend exibe Senha Z na "Área da Senha Ativa" e habilita os botões `[Iniciar Atendimento]` e `[Não Compareceu]`. O botão `[Chamar Próximo]` é desabilitado.
    * *Realtime:* Display TV é atualizado. (Fase 2+) Notificação SMS/WhatsApp é enviada.
2.  **Iniciar Atendimento:**
    * Paciente comparece, atendente clica em `[Iniciar Atendimento]`.
    * Frontend envia requisição ao backend.
    * Backend atualiza `status` da Senha Z para `'em_atendimento'`, registra `data_inicio_atend`.
    * Frontend atualiza a "Área da Senha Ativa" (pode mudar o status visualmente) e habilita o botão `[Finalizar Atendimento]`, desabilitando os outros botões de ação para esta senha.
3.  **Finalizar Atendimento:**
    * Atendimento concluído, atendente clica em `[Finalizar Atendimento]`.
    * Frontend envia requisição ao backend.
    * Backend atualiza `status` da Senha Z para `'finalizado'`, registra `data_fim_atend`.
    * Frontend limpa a "Área da Senha Ativa" e reabilita o botão `[Chamar Próximo]`.
4.  **Não Compareceu:**
    * Paciente não comparece, atendente clica em `[Não Compareceu]`.
    * Frontend envia requisição ao backend.
    * Backend atualiza `status` da Senha Z para `'nao_compareceu'`, registra `data_fim_atend`.
    * Frontend limpa a "Área da Senha Ativa" e reabilita o botão `[Chamar Próximo]`.

**6. Considerações Técnicas**

* **Autenticação e Autorização:** Uso de tokens de sessão (JWT ou similar) após o login. Verificação de `role` no backend para acesso a funcionalidades.
* **Realtime:** Essencial para receber novas senhas na fila (`status = 'aguardando'`) sem necessidade de refresh manual. WebSockets são a tecnologia indicada.
* **Comunicação Backend:** Requisições HTTP (API REST ou GraphQL) para realizar as ações de chamada e atualização de status.
* **Interface Responsiva:** O design deve se adaptar a diferentes tamanhos de tela (desktops, notebooks, tablets).
* **Tratamento de Erros:** Feedback visual claro para o usuário em caso de falhas de comunicação ou erros de lógica no backend.