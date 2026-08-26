# GEM Medicina e Pesquisa — site institucional

## Objetivo do repositório

Este repositório contém o site institucional da **GEM Medicina e Pesquisa**. É um site estático publicado pelo **GitHub Pages** e disponibilizado publicamente em <https://gemmedicina.com.br/>.

Os arquivos do site ficam na raiz do repositório. O arquivo `CNAME` preserva a configuração do domínio personalizado `gemmedicina.com.br`.

## Estrutura principal

| Caminho | Finalidade |
| --- | --- |
| `index.html` | Página inicial institucional. |
| `contato/index.html` | Página de contatos públicos. |
| `404.html` | Página exibida para endereços não encontrados. |
| `assets/` | Folhas de estilo, JavaScript e recursos visuais compartilhados. |
| `apps/handgrip-little/` | Página pública do Handgrip Light. |
| `apps/handgrip-little/suporte/` | Página de suporte do aplicativo. |
| `apps/handgrip-little/privacidade/` | Política de privacidade do aplicativo. |

## Convenção de nomes do Handgrip Light

- **Handgrip Light** é o nome comercial público oficial e deve ser usado na comunicação com usuários.
- `apps/handgrip-little/` e `HandgripLittle` são nomes técnicos legados. Eles não devem ser renomeados sem análise de impacto e planejamento de migração.
- Preserve o Bundle ID, os identificadores internos e os caminhos técnicos relacionados. Mudanças nesses valores podem quebrar links, integrações, publicação ou continuidade do aplicativo.

## Sistema bilíngue

O site oferece conteúdo em português (PT) e inglês (EN). Elementos de cada idioma são identificados no HTML pelo atributo `data-lang`, e o botão `.lang-toggle` alterna a apresentação entre os dois idiomas.

Quando o armazenamento local do navegador está disponível, a preferência é salva em `localStorage` com a chave `gem-lang` e reaplicada nas páginas que carregam `assets/site.js`. Se a preferência estiver ausente, indisponível ou tiver um valor diferente de `en`, o site usa **português como fallback**.

A versão atual do Handgrip Light processa localmente as informações inseridas e **não transmite esses dados à GEM nem a servidores do aplicativo**. Não adicione coleta, telemetria ou transmissão de dados sem avaliação técnica, jurídica e de privacidade.

## Publicação e fluxo de alterações

- A branch de publicação é a `main`.
- A hospedagem é feita pelo GitHub Pages.
- O domínio personalizado é `gemmedicina.com.br`, configurado por `CNAME`, com acesso público por HTTPS em <https://gemmedicina.com.br/>.
- Para alterar o site, crie uma branch de trabalho, revise o diff completo e abra um pull request.
- Faça o merge na `main` somente após a revisão e a aprovação das mudanças.
- Não remova nem substitua `CNAME` durante a publicação dos arquivos na raiz do repositório.

## Lançamento do Handgrip Light

O aplicativo está publicado na App Store e sua página de produto é pública:

- `robots.txt` permite o rastreamento de `/apps/handgrip-little/`;
- a página do produto não contém diretivas `noindex`/`nofollow`; e
- `sitemap.xml` inclui a URL pública do produto.

Esses itens formam uma única estratégia de indexação e devem permanecer coerentes em alterações futuras.

## Validação local

### Servidor estático

Na raiz do repositório, execute:

```bash
python3 -m http.server 8000
```

Depois, acesse <http://localhost:8000/>. Use um servidor HTTP em vez de abrir os arquivos diretamente para reproduzir corretamente os caminhos absolutos iniciados por `/`.

### Sintaxe do JavaScript

Com Node.js instalado, verifique o arquivo compartilhado:

```bash
node --check assets/site.js
```

### Checklist básico

- [ ] A página inicial, a página de contato, a página 404 e as páginas do aplicativo carregam sem erros.
- [ ] Links internos, links de e-mail e caminhos de suporte e privacidade apontam para os destinos corretos.
- [ ] O seletor alterna todo o conteúdo entre PT e EN, mantém português como fallback e recupera a preferência salva quando possível.
- [ ] O layout permanece legível e funcional em larguras de celular, tablet e desktop.
- [ ] A navegação por teclado, o link de salto para o conteúdo, os estados de foco e os nomes acessíveis dos controles funcionam.
- [ ] Títulos, hierarquia de cabeçalhos, contraste, textos alternativos e idioma do documento são adequados.
- [ ] Não há erros relevantes no console do navegador.
- [ ] As regras deliberadas de pré-lançamento em `robots.txt`, meta tags e `sitemap.xml` permanecem coerentes.

## Contatos públicos

- Institucional: [contato@gemmedicina.com.br](mailto:contato@gemmedicina.com.br)
- Suporte: [suporte@gemmedicina.com.br](mailto:suporte@gemmedicina.com.br)
- Privacidade: [privacidade@gemmedicina.com.br](mailto:privacidade@gemmedicina.com.br)

Não registre neste repositório credenciais, chaves, tokens, dados de pacientes ou outras informações privadas.
