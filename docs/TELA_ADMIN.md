# Documentação de Funcionamento - Painel de Administração "Q Fila"

**1. Visão Geral**

O Painel de Administração é a interface web segura utilizada pelos gestores da clínica/hospital (Cliente) para configurar e gerenciar sua instância do sistema "Q Fila". Através deste painel, os administradores podem gerenciar os serviços oferecidos, as estações de atendimento, os usuários do sistema, ativar dispositivos (quiosques e monitores) e definir configurações operacionais.

**2. Componente Painel de Administração**

* **Tecnologia:** Aplicação Web, acessível via navegador (desktop recomendado para melhor usabilidade).
* **Acesso:** Requer login com um usuário que possua o `role` de `admin_cliente`. Todas as operações são estritamente filtradas pelo `cliente_id` associado ao administrador logado. (Um `super_admin` teria acesso adicional para gerenciar os próprios clientes).
* **Conectividade:** Necessita de conexão com a internet para interagir com o backend.

**3. Funcionalidades Principais (Páginas/Seções)**

O painel será organizado em seções para facilitar a gestão:

* **Dashboard (Opcional):** Uma página inicial com um resumo rápido do estado do sistema para o cliente (ex: número de senhas geradas hoje, número de estações ativas, usuários online, etc.).
* **Gerenciamento de Serviços:**
    * **Listagem:** Exibe todos os `Servicos` cadastrados para o cliente, com informações como Nome, Prefixo da Senha e Status (Ativo/Inativo).
    * **Criação:** Formulário para adicionar um novo serviço (definir Nome, Prefixo).
    * **Edição:** Permite alterar Nome, Prefixo e Status de um serviço existente.
    * **Ativação/Desativação:** Forma segura de habilitar ou desabilitar um serviço sem excluí-lo. (Exclusão pode ser perigosa se houver histórico associado).
* **Gerenciamento de Estações:**
    * **Listagem:** Exibe todas as `Estacoes` (guichês, consultórios, etc.) cadastradas, mostrando Nome de Exibição, Serviço(s) associado(s) e Status.
    * **Criação:** Formulário para adicionar nova estação (definir Nome de Exibição, opcionalmente associar a um `Servico`).
    * **Edição:** Permite alterar Nome de Exibição, Associação a Serviço e Status.
    * **Ativação/Desativação:** Habilita ou desabilita uma estação.
* **Gerenciamento de Usuários:**
    * **Listagem:** Exibe todos os `Usuarios` do cliente (Nome, Email, Role, Status).
    * **Criação:** Formulário para adicionar novo usuário (Nome, Email, Senha inicial temporária, selecionar `Role` - 'atendente' ou 'admin\_cliente').
    * **Edição:** Permite alterar Nome, Email, `Role`, Status (Ativo/Inativo). Inclui opção para "Resetar Senha".
    * **Ativação/Desativação:** Controla o acesso do usuário ao sistema.
* **Gerenciamento de Dispositivos (Quiosques e Monitores):**
    * **Listagem:** Mostra os dispositivos (Quiosques e Monitores) que foram ativados/vinculados, exibindo seu identificador, papel (Quiosque/Monitor), e status.
    * **Ativação de Novo Dispositivo:**
        * Campo para inserir o **Código Curto** exibido no dispositivo.
        * Opção para selecionar o **Papel** (Quiosque ou Monitor).
        * Opções para associar o dispositivo às configurações relevantes (ex: quais `Servicos` o Quiosque deve exibir, ou quais `Servicos`/`Estacoes` o Monitor deve seguir).
        * Botão para "Ativar/Vincular Dispositivo".
    * **Desativação/Desvinculação:** Permite remover a autorização de um dispositivo, forçando-o a voltar para a tela de ativação.
* **Gerenciamento de Configurações:**
    * Interface para visualizar e modificar os parâmetros armazenados na tabela `Configuracoes` para o `cliente_id` logado.
    * Exemplos: `Tmax_P_minutos` (Tempo máximo espera prioritária), `Notificar_SMS_Chamada` (Habilitar/Desabilitar SMS), `Texto_SMS_Chamada` (Template da mensagem SMS), etc.
    * Pode permitir configurações globais para o cliente e específicas por `Servico`.
* **Gerenciamento de Conteúdo Institucional (para Monitores):**
    * **Biblioteca de Mídia:** Área para fazer upload de vídeos (formatos comuns como MP4) e imagens. Listagem do conteúdo carregado.
    * **Links Externos:** Área para adicionar e gerenciar links de vídeos do YouTube/Vimeo.
    * **Playlists/Sequências (Opcional):** Ferramenta para criar sequências ou playlists combinando mídias carregadas e links externos.
    * **Associação:** Interface para associar um conteúdo específico ou uma playlist a um ou mais Monitores de Chamada ativos.
* **(Futuro) Relatórios:**
    * Seção dedicada à visualização de dados históricos: tempo médio de espera por serviço, número de atendimentos por estação/usuário, horários de pico, taxas de não comparecimento, etc.

**4. Considerações Técnicas**

* **Segurança:** Autenticação robusta e verificação de autorização (baseada no `role` e `cliente_id`) em todas as requisições ao backend. Proteção contra ataques comuns (XSS, CSRF, SQL Injection).
* **Interface:** Design limpo e intuitivo, focado na facilidade de uso para tarefas administrativas. Uso de tabelas paginadas, formulários claros com validação, modais de confirmação para ações destrutivas.
* **Feedback:** Mensagens claras para o administrador indicando o sucesso ou falha das operações realizadas.
* **Auditoria (Opcional):** Registrar logs das ações administrativas importantes (quem criou/editou/excluiu o quê e quando).

Com este Painel de Administração, o gestor da clínica terá o controle necessário para adaptar e gerenciar o sistema "Q Fila" de acordo com as necessidades do seu estabelecimento.