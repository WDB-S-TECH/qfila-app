# Documentação de Funcionamento - Monitor de Chamadas "Q Fila"

**1. Visão Geral**

O Monitor de Chamadas é a interface pública do sistema "Q Fila", projetada para ser exibida em televisores ou telas grandes nas áreas de espera da clínica/hospital. Sua função principal é informar aos pacientes quais senhas estão sendo chamadas e para qual estação (guichê, consultório, sala) eles devem se dirigir, podendo também exibir conteúdo institucional.

**2. Componente Monitor de Chamadas**

* **Tecnologia:** Aplicação Web ou PWA otimizada para exibição contínua, acessada via navegador em um dispositivo conectado à TV (ex: Smart TV, TV Box, Mini PC, Google TV, Fire Stick) ou diretamente no navegador da Smart TV.
* **Dispositivo:** Televisor ou monitor de tamanho adequado para boa visibilidade na área de espera.
* **Conectividade:** Requer conexão estável com a internet para receber atualizações em tempo real do backend e carregar conteúdo de mídia (se aplicável).

**3. Fluxo de Ativação**

* O Monitor utiliza o **mesmo processo de ativação unificado** do Quiosque:
    1.  O dispositivo acessa um URL genérico (ex: `ativar.qfila.app`).
    2.  Exibe um QR Code e um Código Curto temporário.
    3.  O Administrador, em seu painel web, digita o Código Curto (ou escaneia o QR Code).
    4.  Crucialmente, o Administrador seleciona o **papel** deste dispositivo como **"Monitor de Chamada"**.
    5.  O Administrador associa o Monitor ao `Cliente` e configura quais `Servicos` ou `Estacoes` este monitor específico deve exibir, e opcionalmente, qual conteúdo institucional deve ser mostrado.
    6.  Após a validação pelo backend, o dispositivo recebe a confirmação, armazena seu token/identificação e carrega a interface do Monitor de Chamadas com a configuração definida.

**4. Funcionalidade Principal**

* **Recepção de Dados:** O Monitor estabelece uma conexão persistente (WebSocket) com o backend para receber atualizações em tempo real sempre que uma senha muda de status (principalmente para `chamado` ou `em_atendimento`).
* **Filtragem:** Exibe apenas as informações de senhas relevantes para os `Servicos`/`Estacoes` configurados para ele.
* **Exibição de Chamadas:** Apresenta as senhas chamadas de forma clara e organizada.
* **Exibição de Conteúdo:** Exibe vídeos ou imagens institucionais carregados ou vinculados através do painel de administração.

**5. Layout Sugerido para TV (com Área de Conteúdo)**

O layout deve balancear a informação da fila com o conteúdo institucional, mantendo a clareza e legibilidade. Uma estrutura eficaz poderia ser dividir a tela em duas colunas principais:

* **Coluna Esquerda (Largura ~60-70%): Informações da Fila**
    * **Cabeçalho:** Logo do Cliente (canto superior esquerdo), Data e Hora (canto superior direito).
    * **Área Principal - Últimas Chamadas:**
        * Título claro (Ex: "SENHAS CHAMADAS").
        * Lista das últimas X senhas com status `chamado` (configurável, ex: 4 ou 5 últimas).
        * Layout em tabela ou lista clara, com colunas para "SENHA" e "ESTAÇÃO/LOCAL".
        * **Fonte:** Grande, legível à distância (ex: sans-serif).
        * **Destaque:** A senha mais recentemente chamada pode ter um fundo diferente, piscar brevemente ou ter uma animação sutil para chamar a atenção.
        * Exemplo Visual:
            ```
            --------------------------
            SENHA    | ESTAÇÃO
            --------------------------
            AMB005   | Recepção A  <-- (Destaque)
            LAB123   | Guichê 02
            AMB004   | Recepção B
            IMG045   | Sala 01
            --------------------------

            ```
    * **(Opcional) Área Secundária - Em Atendimento:** Uma seção menor abaixo das chamadas, mostrando senhas com status `em_atendimento` e suas estações.
* **Coluna Direita (Largura ~30-40%): Conteúdo Institucional**
    * **Player de Mídia:** Uma área dedicada para exibir:
        * Vídeos carregados pelo administrador no painel (requer funcionalidade de upload e armazenamento/streaming no backend). Usaria a tag `<video>`.
        * Vídeos do YouTube ou Vimeo vinculados pelo administrador (requer apenas o link/ID do vídeo). Usaria `<iframe>`.
    * **Controle:** O conteúdo pode ser um vídeo único em loop, uma playlist de vídeos/imagens que rodam ciclicamente, ou alternar entre imagem e vídeo. A gestão desse conteúdo (upload, links, ordem, associação a monitores) seria feita no painel de administração.
    * **Som:** O áudio do vídeo deve ser opcional ou controlável, pois pode interferir no ambiente da sala de espera.
* **Considerações Gerais de Design:**
    * **Contraste:** Usar cores com alto contraste entre fundo e texto/elementos.
    * **Simplicidade:** Evitar sobrecarregar a tela com informações desnecessárias.
    * **Atualização:** Transições suaves ao atualizar a lista de senhas.
    * **Chamada por Voz (Futuro):** A integração com Web Speech API poderia anunciar a senha e a estação quando uma nova chamada ocorrer.

**6. Considerações Técnicas**

* Aplicação Web/PWA responsiva, mas primariamente otimizada para modo paisagem (TV).
* Comunicação Realtime (WebSockets) é essencial para receber as atualizações da fila.
* Lógica para buscar e exibir o conteúdo institucional configurado (vídeos locais ou embeds).
* Tratamento robusto de erros de conexão e de carregamento de mídia.
* Possibilidade de configuração remota (via admin panel) dos parâmetros de exibição (número de senhas, serviços/estações a monitorar, conteúdo institucional).