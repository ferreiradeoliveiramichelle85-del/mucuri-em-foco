MUCURI EM FOCO — VERSÃO ESTÁTICA PARA GITHUB PAGES

Esta versão foi adaptada para funcionar sem PHP.

ARQUIVOS PRINCIPAIS
- index.html: página inicial do jornal.
- leitor.html: leitor de edições; recebe o ID pela URL, por exemplo leitor.html?id=1.
- dados/edicoes.json: cadastro das edições publicadas.
- assets/: CSS, JavaScript, logotipo, capas e páginas do jornal.

COMO PUBLICAR
1. Entre no GitHub e crie/abra o repositório do site.
2. Envie o conteúdo desta pasta para a raiz do repositório (index.html deve ficar na raiz).
3. Em Settings > Pages, escolha publicar a partir da branch principal (normalmente main) e da pasta /(root).
4. Aguarde o GitHub gerar o endereço do site.

IMPORTANTE SOBRE A ÁREA ADMINISTRATIVA
- A área administrativa em PHP foi retirada desta versão pública porque o GitHub Pages não executa PHP.
- Não existe uma forma segura de esconder um painel administrativo apenas mudando o nome ou removendo o link. Em um site estático, os arquivos públicos podem ser inspecionados.
- Não envie senhas, arquivos PHP de administração ou dados secretos para um repositório público.
- Para adicionar uma nova edição, nesta versão, atualize manualmente o arquivo dados/edicoes.json e envie a capa e as páginas para as pastas indicadas. Depois, faça commit/push para atualizar o site.
- Para um painel de publicação online de verdade, será necessário um backend/serviço externo com autenticação, ou usar uma hospedagem que execute PHP.

COMO CADASTRAR UMA EDIÇÃO
1. Coloque a capa em assets/img/capas/, por exemplo edicao-2.png.
2. Crie a pasta assets/paginas/edicao-2/ e coloque nela pag01.png, pag02.png etc. (a capa conta como página 1; pag01.png será a página 2 do leitor).
3. Acrescente um novo objeto dentro da lista "edicoes" em dados/edicoes.json, com id único, numero, data (AAAA-MM-DD), capa (caminho relativo a assets/img/), totalPaginas (incluindo a capa) e sumario.
4. Envie as alterações ao GitHub. O site exibirá a edição com maior ID como destaque.

NOTAS
- O leitor usa jQuery e Font Awesome por CDN; para carregar esses recursos, o visitante precisa de conexão com a internet.
- Teste o site pelo endereço publicado no GitHub Pages. Abrir index.html diretamente com duplo clique pode impedir o navegador de carregar o JSON por restrições de segurança.
- O arquivo teste.php e a pasta admin/ não fazem parte desta versão pronta para publicar.
