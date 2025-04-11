# Documentação de Funcionamento - Quiosque "Q Fila"

**1. Visão Geral**

O Quiosque (Kiosk) é o ponto de entrada principal para os pacientes no sistema "Q Fila". Tipicamente executado em um tablet ou dispositivo similar com tela sensível ao toque, ele permite que os pacientes gerem senhas de atendimento de forma autônoma para os serviços disponíveis na clínica ou hospital (Cliente). Este documento detalha o fluxo de ativação do quiosque e o fluxo de uso pelo paciente.

**2. Componente Quiosque**

* **Tecnologia:** Uma aplicação web progressiva (PWA) ou uma página web otimizada, acessada através de um navegador em modo de tela cheia (kiosk mode).
* **Dispositivo:** Tablet (Android, iOS) ou outro dispositivo com tela touch e acesso à internet.
* **Conectividade:** Requer conexão estável com a internet para comunicação com o backend do "Q Fila".

**3. Fluxo de Ativação e Autorização (Realizado pelo Administrador)**

O quiosque não funciona para gerar senhas até que seja ativado e vinculado a um Cliente específico e suas configurações. O processo é desenhado para ser seguro, sem exigir login direto no dispositivo quiosque.

1.  **Estado Inicial (Não Autorizado):**
    * O dispositivo quiosque é ligado e o navegador é aberto no URL designado para quiosques (ex: `kiosk.qfila.app`).
    * Como o dispositivo ainda não está autorizado, a aplicação exibe uma tela de "Ativação Necessária".
    * Esta tela mostra:
        * Um **QR Code** único para esta sessão/dispositivo temporário.
        * Um **Código Curto** alfanumérico (ex: `A7K2B9Z1`), que representa o mesmo identificador temporário do QR Code.
        * Instruções claras para o administrador.
2.  **Ação do Administrador (Painel Web):**
    * Um usuário com permissão de `admin_cliente` faz login na aplicação web de administração do "Q Fila" (em seu próprio computador ou dispositivo móvel).
    * Navega até a seção "Gerenciar Quiosques" ou "Ativar Dispositivo".
    * O administrador pode precisar selecionar ou confirmar a qual configuração de quiosque/estação este dispositivo físico corresponde (ex: "Quiosque Recepção Principal", "Quiosque Laboratório").
    * Seleciona a opção "Ativar por Código".
3.  **Vinculação:**
    * O administrador digita o **Código Curto** exibido na tela do quiosque no campo correspondente do painel de administração.
    * Alternativamente (se implementado), o admin poderia usar a câmera do seu dispositivo para escanear o **QR Code** exibido no quiosque.
    * O administrador confirma a ativação.
4.  **Comunicação Backend:**
    * O painel de administração envia o Código Curto (ou dados do QR Code) e a identificação da configuração do quiosque/estação para o backend.
    * O backend valida o código temporário.
    * Se válido, o backend associa permanentemente aquela sessão/dispositivo à configuração selecionada pelo admin.
    * O backend gera um **Token de Autorização** persistente para o quiosque.
5.  **Ativação do Quiosque:**
    * O backend notifica a aplicação do quiosque (via WebSocket/Realtime) sobre a ativação bem-sucedida.
    * A aplicação do quiosque recebe a confirmação e armazena o Token de Autorização de forma segura (ex: `localStorage` ou `Cookie HttpOnly`).
    * A tela do quiosque é atualizada automaticamente, saindo do modo de ativação e entrando na interface de atendimento ao paciente.

**4. Fluxo de Uso (Realizado pelo Paciente)**

Uma vez ativo, o quiosque apresenta a interface para geração de senhas:

1.  **Tela Inicial:**
    * Exibe o logo do Cliente (clínica/hospital).
    * Apresenta botões grandes e claros para cada `Servico` ativo e configurado para aquele quiosque (ex: "Consultas", "Exames Laboratoriais", "Urgência").
2.  **Seleção de Serviço:**
    * O paciente toca no botão correspondente ao serviço desejado.
3.  **Entrada de Telefone (Opcional):**
    * Se configurado para o serviço/cliente, uma tela solicita que o paciente digite seu número de telefone (usando um teclado numérico virtual) para receber notificações. Há a opção de pular esta etapa.
4.  **Confirmação/Prioridade (Opcional/Contextual):**
    * Pode haver uma tela de confirmação ou, em serviços específicos como Urgência, perguntas adicionais ou instruções sobre classificação de risco (embora a classificação em si geralmente seja feita por um profissional). Para prioridades legais, pode haver um botão "Sou Prioridade" ou a orientação para informar a recepção.
5.  **Geração da Senha:**
    * O quiosque envia a solicitação para o backend (incluindo serviço, telefone, nível de prioridade inferido/informado).
    * O backend gera o `numero_senha` (com prefixo e sequência diária), cria o registro no banco de dados com status `aguardando`.
6.  **Exibição da Senha:**
    * O quiosque recebe a confirmação e exibe o `numero_senha` gerado em destaque (tamanho grande, legível).
    * Pode incluir informações adicionais como o nome do serviço e uma mensagem como "Aguarde ser chamado no painel".
7.  **Retorno ou Timeout:**
    * Após alguns segundos (configurável), ou se o paciente tocar na tela, a interface retorna para a Tela Inicial (passo 1), pronta para o próximo paciente.

**5. Interface do Quiosque (Elementos Chave)**

* **Tela de Ativação:** QR Code, Código Curto, Instruções.
* **Tela de Seleção de Serviço:** Botões grandes, ícones (opcional), nomes claros dos serviços.
* **Tela de Inserção de Telefone:** Teclado numérico virtual, botão "Confirmar", botão "Pular".
* **Tela de Exibição de Senha:** Número da senha em destaque, nome do serviço, mensagens informativas.
* **Rodapé/Cabeçalho (persistente):** Pode conter logo do cliente, talvez um relógio, e botões discretos para "Ajuda" ou "Teste de Conexão".

**6. Considerações Técnicas**

* **Conectividade:** Acesso constante à internet é crucial. Implementar tratamento de erros para falhas de comunicação.
* **Realtime:** WebSockets (via Supabase Realtime, Convex, ou outro) são recomendados para a notificação de ativação e potencialmente para buscar configurações atualizadas sem refresh.
* **Armazenamento Local:** Uso de `localStorage` ou `Cookies` para guardar o Token de Autorização e manter o quiosque ativo entre reloads.
* **Modo Kiosk (OS):** O dispositivo físico deve ser configurado para rodar o navegador em modo de tela cheia travado (usando recursos como Acesso Guiado no iOS, Kiosk Mode no Android/Windows) para impedir que os usuários saiam da aplicação.

**7. Desativação e Manutenção**

* **Desativação Remota:** O administrador pode "Desvincular" ou "Desativar" um quiosque através do painel de administração, o que invalidaria o token armazenado no dispositivo na próxima vez que ele tentasse se comunicar com o backend.
* **Logout Local (Manutenção):** Pode haver um link ou botão "secreto" (ex: acessível por um gesto específico ou em uma área protegida por senha simples) que limpa o token local e força o quiosque a retornar à tela de ativação, permitindo reconfigurá-lo ou realizar manutenção.