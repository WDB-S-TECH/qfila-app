%% Fluxo 1: Check-in do Paciente (Diagrama de Sequência)
sequenceDiagram
    participant Paciente
    participant KioskUI as Kiosk/Tablet UI
    participant BackendAPI as Backend API/DB Functions
    participant Database

    Paciente->>KioskUI: Seleciona Serviço
    Paciente->>KioskUI: Informa Telefone (Opcional)
    KioskUI->>BackendAPI: Solicita nova senha (servicoId, telefone?, prioridade?)
    BackendAPI->>Database: Busca último numero_sequencial (servicoId, hoje)
    Database-->>BackendAPI: Retorna max(numero_sequencial) ou NULL
    BackendAPI->>BackendAPI: Calcula próximo numero_sequencial e numero_senha
    BackendAPI->>Database: Insere nova Senha (status='aguardando', dados...)
    Database-->>BackendAPI: Confirma inserção (retorna ID/dados da senha)
    BackendAPI-->>KioskUI: Retorna numero_senha gerado
    KioskUI->>Paciente: Exibe numero_senha ("AMB001")
    BackendAPI->>Database: (Realtime) Notifica mudança na fila

%% Fluxo 2: Chamada de Senha (Diagrama de Sequência)
sequenceDiagram
    participant AtendenteUI as Interface do Atendente
    participant BackendAPI as Backend API/DB Functions
    participant Database
    participant NotifyAPI as API Notificação (Ex: Twilio)

    AtendenteUI->>BackendAPI: Clica "Chamar Próximo" (para seu servicoId)
    BackendAPI->>Database: Consulta senhas 'aguardando' (servicoId)
    Database-->>BackendAPI: Retorna lista de senhas aguardando
    BackendAPI->>BackendAPI: Aplica Lógica de Prioridade (Tmax_P, FIFO)
    BackendAPI->>BackendAPI: Seleciona Senha ID Z para chamar
    BackendAPI->>Database: Atualiza Senha Z (status='chamado', data_chamada, etc.)
    Database-->>BackendAPI: Confirma atualização
    BackendAPI-->>AtendenteUI: Retorna dados da Senha Z chamada
    AtendenteUI->>AtendenteUI: Exibe Senha Z e botões [Iniciar Atend.], [Não Compareceu]
    BackendAPI->>Database: (Realtime) Notifica mudança de status da Senha Z
    opt Se Senha Z tem telefone e Notificações ativas
        BackendAPI->>NotifyAPI: Dispara notificação (Senha Z, Estação X)
        NotifyAPI-->>BackendAPI: Confirma envio (ou erro)
    end

%% Fluxo 3: Lógica "Chamar Próximo" (Fluxograma)
graph TD
    A[Início: Atendente clica 'Chamar Próximo'] --> B{Consulta Senhas 'aguardando' para o Serviço};
    B --> C{Existe Prioritária (Nível>0) com espera > Tmax_P?};
    C -- Sim --> D[Seleciona a Prioritária mais antiga que estourou Tmax_P];
    C -- Não --> E[Seleciona a Senha mais antiga (qualquer nível) por data_criacao];
    D --> F[Fim: Senha Selecionada];
    E --> F;

%% Fluxo 4: Gerenciamento Pós-Chamada (Fluxograma)
graph TD
    subgraph Gerenciamento da Senha Chamada
        direction LR
        AA[Senha Z no estado 'chamado'] --> BB{Paciente Compareceu?};
        BB -- Sim --> CC[Atendente clica 'Iniciar Atendimento'];
        CC --> DD[Sistema: status='em_atendimento', data_inicio_atend];
        DD --> EE[Atendimento];
        EE --> FF[Atendente clica 'Finalizar Atendimento'];
        FF --> GG[Sistema: status='finalizado', data_fim_atend];
        GG --> HH[Fim do Ciclo da Senha];
        BB -- Não --> II[Atendente clica 'Não Compareceu'];
        II --> JJ[Sistema: status='nao_compareceu', data_fim_atend];
        JJ --> HH;
    end

