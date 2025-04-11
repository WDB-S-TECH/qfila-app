# Documento de Especificação Funcional - Projeto "Q Fila"

**1. Visão Geral do Projeto**

O "Q Fila" é um sistema de gerenciamento de filas de atendimento projetado para ambientes clínicos e hospitalares. Seus objetivos principais são:
* Otimizar o fluxo de pacientes em diferentes áreas de atendimento (serviços).
* Melhorar a experiência do paciente através de um sistema moderno, com senhas digitais e notificações opcionais.
* Aumentar a eficiência operacional da equipe de recepção e atendimento.
* Fornecer flexibilidade na configuração de regras de prioridade.
* Ser uma plataforma multi-tenant, permitindo que diferentes organizações (clientes) utilizem o sistema de forma independente e segura.
* Utilizar tecnologias web modernas (React/Next.js, Supabase/Convex) para interfaces de Kiosk, Atendente e Display, com atualizações em tempo real.

**2. Players (Atores) e Papéis**

* **Paciente:**
    * **Interage com:** Kiosk/Tablet, Display TV, (Opcional) SMS/WhatsApp.
    * **Ações:** Inicia o atendimento selecionando o serviço; opcionalmente informa telefone; recebe classificação de prioridade (se aplicável); recebe número da senha; visualiza chamada na TV; (Fase 2+) recebe notificações.
* **Usuário da Estação (Atendente, Recepcionista, Enfermeiro, Médico, etc.):**
    * **Interage com:** Aplicação Web de Atendimento.
    * **Ações:** Faz login; seleciona a Estação de trabalho; visualiza a fila de espera do seu serviço; clica em "Chamar Próximo"; gerencia a senha chamada (clica em "Iniciar Atendimento", "Não Compareceu", "Finalizar Atendimento").
* **Administrador do Cliente (Gestor da Clínica):**
    * **Interage com:** Aplicação Web de Administração.
    * **Ações:** Gerencia cadastros de Serviços, Estações, Usuários da sua organização; define Configurações específicas do cliente (ex: `Tmax_P_minutos`); (Futuro) visualiza relatórios.
* **Sistema "Q Fila" (Backend & Database):**
    * **Função:** Orquestrador central.
    * **Ações:** Recebe dados dos Kiosks e Estações; gera senhas com sequência diária por serviço; aplica regras de prioridade configuradas; atualiza status das senhas; armazena dados de forma segura e isolada por cliente; envia atualizações em tempo real para as interfaces; (Fase 2+) interage com APIs de notificação (SMS/WhatsApp).

**(Os Fluxos e o Schema do Banco de Dados estão nos blocos seguintes)**

**5. Telas Principais (Próximo Passo: Desenho/Wireframing)**

* Kiosk/Tablet Check-in
* Login Usuário
* Seleção de Estação (Pós-Login)
* Painel do Atendente (Fila + Ações)
* Display TV
* Administração (CRUDs: Clientes, Serviços, Estações, Usuários, Configurações)

**6. Tasks de Desenvolvimento (Próximo Passo: Detalhamento - Exemplo MVP)**

* Setup do Projeto (Repo, Next.js, Supabase/Convex).
* Definição e Migração do Schema do Banco de Dados (Tabelas MVP).
* Implementação da Autenticação de Usuário (Login/Logout).
* Desenvolvimento do Backend (API/DB Functions: criar senha, chamar próximo c/ lógica prioridade, atualizar status).
* Configuração do Realtime (Supabase/Convex) para atualizações de fila/chamada.
* Desenvolvimento Frontend - Tela Kiosk (Web/PWA básica).
* Desenvolvimento Frontend - Telas Atendente (Login, Seleção Estação, Fila, Botões de Ação).
* Desenvolvimento Frontend - Tela Display TV (Leitura Realtime e exibição).
* Implementação da Lógica de Geração de Senha Diária/Sequencial.
* Testes básicos de fluxo.
* Deployment Inicial.