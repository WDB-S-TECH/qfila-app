Claro, aqui está o schema do banco de dados que definimos, incluindo as sugestões de ajustes que discutimos (como o tipo de estação), apresentado em formato Markdown com um bloco de código SQL:

```markdown
## Schema do Banco de Dados "Q Fila" (PostgreSQL)

```sql
-- Tabela de Clientes (Organizações/Tenants)
CREATE TABLE Clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identificador único do cliente
    nome_fantasia VARCHAR(255) NOT NULL,          -- Nome comercial da clínica/hospital
    razao_social VARCHAR(255),                     -- Razão social (opcional)
    ativo BOOLEAN DEFAULT true,                    -- Indica se o cliente está ativo no sistema
    data_criacao TIMESTAMPTZ DEFAULT now()         -- Data de cadastro do cliente
);

-- Tabela de Serviços (Departamentos/Filas) dentro de um Cliente
CREATE TABLE Servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identificador único do serviço
    cliente_id UUID NOT NULL REFERENCES Clientes(id) ON DELETE CASCADE, -- Liga ao cliente (ON DELETE CASCADE: se cliente for removido, seus serviços também são)
    nome VARCHAR(100) NOT NULL,                   -- Nome do serviço (Ex: "Ambulatório", "Laboratório")
    prefixo_senha VARCHAR(5) NOT NULL,            -- Prefixo usado na senha (Ex: "AMB", "LAB")
    ativo BOOLEAN DEFAULT true,                   -- Indica se o serviço está ativo
    -- Garante que o nome e o prefixo sejam únicos dentro de um mesmo cliente
    UNIQUE (cliente_id, nome),
    UNIQUE (cliente_id, prefixo_senha)
);

-- Tabela de Estações de Atendimento (Guichês, Consultórios, Quiosques, Monitores)
CREATE TABLE Estacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identificador único da estação
    cliente_id UUID NOT NULL REFERENCES Clientes(id) ON DELETE CASCADE, -- Liga ao cliente
    servico_id UUID REFERENCES Servicos(id) ON DELETE SET NULL, -- Serviço principal associado (pode ser NULL)
    nome_exibicao VARCHAR(100) NOT NULL,          -- Nome amigável para exibição (Ex: "Recepção Balcão", "Consultório 05", "Quiosque Entrada", "Monitor Sala Espera")
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ATENDIMENTO', 'KIOSK', 'MONITOR')), -- Tipo da estação: ATENDIMENTO (para atendente), KIOSK (para paciente), MONITOR (para exibição)
    ativa BOOLEAN DEFAULT true,                   -- Indica se a estação está ativa
    -- Garante que o nome de exibição seja único dentro do cliente
    UNIQUE (cliente_id, nome_exibicao)
);

-- Tabela de Usuários (Atendentes, Médicos, Admins)
CREATE TABLE Usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identificador único do usuário
    cliente_id UUID NOT NULL REFERENCES Clientes(id) ON DELETE CASCADE, -- Liga ao cliente
    nome VARCHAR(255) NOT NULL,                   -- Nome completo do usuário
    email VARCHAR(255) NOT NULL,                  -- Email para login (deve ser único por cliente)
    hash_senha TEXT NOT NULL,                     -- Hash da senha (NUNCA guardar senha em texto plano)
    role VARCHAR(50) NOT NULL CHECK (role IN ('atendente', 'admin_cliente', 'super_admin')), -- Papel do usuário no sistema
    ativo BOOLEAN DEFAULT true,                   -- Indica se o usuário está ativo
    data_criacao TIMESTAMPTZ DEFAULT now(),       -- Data de cadastro do usuário
    -- Garante que o email seja único dentro de um cliente
    UNIQUE (cliente_id, email)
);

-- Tabela Principal de Senhas (Tickets)
CREATE TABLE Senhas (
    id BIGSERIAL PRIMARY KEY,                     -- Identificador sequencial único da senha (facilita ordenação interna)
    cliente_id UUID NOT NULL REFERENCES Clientes(id) ON DELETE CASCADE, -- Liga ao cliente
    servico_id UUID NOT NULL REFERENCES Servicos(id) ON DELETE RESTRICT, -- Liga ao serviço (ON DELETE RESTRICT: não deixa excluir serviço se tiver senhas ligadas)
    numero_senha VARCHAR(10) NOT NULL,            -- Senha exibida ao paciente (Ex: "AMB001")
    numero_sequencial INTEGER NOT NULL CHECK (numero_sequencial > 0 AND numero_sequencial <= 999), -- Número sequencial (1-999)
    data_dia DATE NOT NULL DEFAULT CURRENT_DATE,  -- Dia a que a sequência pertence
    paciente_nome VARCHAR(255),                   -- Nome do paciente (opcional)
    paciente_telefone VARCHAR(20),                -- Telefone do paciente (opcional, para notificações)
    nivel_prioridade SMALLINT NOT NULL DEFAULT 0 CHECK (nivel_prioridade >= 0), -- Nível de prioridade (0: Normal, 1: Legal, 2+: Clínica)
    status VARCHAR(20) NOT NULL DEFAULT 'aguardando' CHECK (status IN ('aguardando', 'chamado', 'em_atendimento', 'finalizado', 'nao_compareceu', 'cancelado')), -- Status atual da senha
    data_criacao TIMESTAMPTZ NOT NULL DEFAULT now(), -- Quando a senha foi gerada
    data_chamada TIMESTAMPTZ,                     -- Quando a senha foi chamada
    data_inicio_atend TIMESTAMPTZ,                -- Quando o atendimento iniciou na estação
    data_fim_atend TIMESTAMPTZ,                   -- Quando o atendimento finalizou ou foi marcado como não compareceu/cancelado
    estacao_chamadora_id UUID REFERENCES Estacoes(id) ON DELETE SET NULL, -- Qual estação chamou (SET NULL se estação for removida)
    usuario_atendente_id UUID REFERENCES Usuarios(id) ON DELETE SET NULL, -- Qual usuário chamou (SET NULL se usuário for removido)

    -- Constraint para garantir sequência única por cliente, serviço e dia
    UNIQUE (cliente_id, servico_id, data_dia, numero_sequencial)
);

-- Índices importantes para otimizar consultas comuns
CREATE INDEX idx_senhas_cliente_servico_status ON Senhas (cliente_id, servico_id, status);
CREATE INDEX idx_senhas_data_criacao ON Senhas (data_criacao);
CREATE INDEX idx_senhas_nivel_prioridade ON Senhas (nivel_prioridade);
CREATE INDEX idx_senhas_data_dia ON Senhas (data_dia);
-- Índice para buscar rapidamente senhas de um dia específico em um serviço/cliente
CREATE INDEX idx_senhas_lookup_diario ON Senhas (cliente_id, servico_id, data_dia);
-- Índice para buscar estação por tipo
CREATE INDEX idx_estacoes_tipo ON Estacoes (cliente_id, tipo);


-- Tabela de Configurações (por Cliente, opcionalmente por Serviço)
CREATE TABLE Configuracoes (
    id SERIAL PRIMARY KEY,                        -- Identificador único da configuração
    cliente_id UUID NOT NULL REFERENCES Clientes(id) ON DELETE CASCADE, -- Liga ao cliente
    servico_id UUID REFERENCES Servicos(id) ON DELETE CASCADE, -- Opcional: Liga a um serviço específico (NULL para config geral do cliente)
    chave VARCHAR(100) NOT NULL,                  -- Nome da configuração (Ex: 'Tmax_P_minutos', 'Notificar_SMS_Chamada', 'Texto_SMS_Chamada')
    valor TEXT NOT NULL,                          -- Valor da configuração
    -- Garante que a chave de configuração seja única para o cliente (e serviço, se aplicável)
    UNIQUE (cliente_id, servico_id, chave)
);

-- Exemplo de inserção de configuração geral para um cliente
-- INSERT INTO Configuracoes (cliente_id, chave, valor) VALUES ('uuid_do_cliente', 'Tmax_P_minutos', '15');
-- Exemplo de inserção de configuração específica para um serviço de um cliente
-- INSERT INTO Configuracoes (cliente_id, servico_id, chave, valor) VALUES ('uuid_do_cliente', 'uuid_do_servico_urgencia', 'Tmax_P_minutos', '5');

-- NOTA: Tabelas Adicionais Necessárias para Funcionalidades Completas do Admin Panel
-- Para suportar o "Gerenciamento de Conteúdo Institucional", seriam necessárias tabelas como:
-- - Conteudo_Institucional (para infos de vídeos/imagens)
-- - Playlists_Conteudo (para agrupar conteúdos)
-- - Playlist_Itens (para ordenar itens na playlist)
-- - Monitor_Conteudo_Associacao (para ligar conteúdo/playlist a um monitor específico)
--
-- Para suportar "Auditoria", seria necessária uma tabela como:
-- - Auditoria_Logs (para registrar ações administrativas)
```