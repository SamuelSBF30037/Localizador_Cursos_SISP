# Localizador de Cursos SISP

## Descrição
Uma extensão para o Google Chrome que adiciona filtros de busca à lista suspensa de cursos na página do SISP. A extensão permite buscar opções tanto pela data de início/fim quanto por palavras-chave do nome do curso, facilitando a localização de um curso específico numa lista muito longa.

## Funcionalidades
- **Busca por Data**: Digite uma data (ex: `12/09/2021`) e a lista mostrará apenas os cursos que contêm essa data.
- **Busca por Nome**: Digite uma palavra ou sigla (ex: `POP`, `DEC`) e a lista filtrará instantaneamente os cursos cujo nome corresponde à busca.
- **Limpar Filtros**: Um botão dedicado para resetar os campos de busca e exibir todos os cursos novamente.
- **Manutenção de Seleção**: A extensão se esforça para manter selecionado o curso que o usuário já havia escolhido caso ele aplique ou altere os filtros.

## Como instalar
1. Abra o Google Chrome e acesse `chrome://extensions/`.
2. Ative o **Modo do desenvolvedor** (botão no canto superior direito).
3. Clique em **Carregar sem compactação**.
4. Selecione a pasta `Localizador_Cursos_SISP` onde estes arquivos estão salvos.

## Arquivos do Projeto
- `manifest.json`: Configurações principais da extensão.
- `content.js`: Script responsável por criar os campos de busca e aplicar a lógica de filtro na lista suspensa original.
- `styles.css`: Estilos simples para garantir que a barra de busca apareça de forma limpa e organizada na tela do SISP.
