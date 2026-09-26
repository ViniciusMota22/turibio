# Turíbio Odontologia

Primeira versão funcional do site, construída com React, Vite e Motion para React.

## Rodar

Requer Node.js 20.19+ ou 22.12+.

```sh
npm install
npm run dev
```

## Compilar e visualizar

```sh
npm run build
npm run preview -- --port 4173
```

O site compilado fica em `dist/`. O endereço local é http://127.0.0.1:4173. Abrir o HTML por duplo clique não executa corretamente a aplicação; use o servidor acima.

## Entrega

- Página inicial responsiva com clínica, tratamentos, jornada de atendimento, FAQ e contato.
- Cinco páginas de tratamentos e página de privacidade.
- Cormorant Garamond nos títulos e Manrope no texto, hospedadas no próprio projeto.
- Motion: revelação das seções, interações nos botões, abertura do menu e FAQ. Respeita a preferência de movimento reduzido.
- Todos os contatos apontam para WhatsApp `5562981195003`, o número observado no perfil fornecido. As mensagens são sugestões e só são enviadas pelo visitante.
- Sem formulários, contas, banco de dados ou rastreadores.

## Editar

- Conteúdo, serviços e telefone: `src/main.jsx`.
- Cores, espaçamento, fontes e adaptação mobile: `src/style.css`.
- Imagens: `public/images/`.

## Antes da publicação definitiva

1. Substituir os prints pelas fotos originais em boa resolução. A versão atual mantém os prints inteiros e seleciona visualmente os trechos com CSS. Isso não serve como otimização definitiva de imagens: os arquivos completos ainda são transferidos.
2. Substituir a representação provisória do logotipo pelo arquivo oficial da marca.
3. Confirmar endereço completo, horários, profissionais, registros e os serviços descritos. Estes dados não foram inventados nem publicados como confirmados.
4. Revisar o conteúdo com o responsável da clínica e confirmar o uso das fotos no site.
5. Configurar domínio e hospedagem. Esta entrega é local e não publica o site na internet.
6. Complementar os dados de identificação da clínica e a página de privacidade de acordo com a operação e a hospedagem escolhidas.

## Hospedagem e busca

É uma aplicação estática React com rotas no navegador. A hospedagem precisa devolver `index.html` para as rotas de tratamentos e privacidade. Há exemplos de configuração para Netlify (`public/_redirects`) e Vercel (`vercel.json`).

Os títulos mudam por página. Para uma etapa voltada à aquisição por busca, adicionar pré-renderização por rota, metadados específicos, sitemap e dados locais após confirmar o domínio e as informações da clínica.

Documentação da biblioteca de animação: https://motion.dev/docs/react


## v4
- Equipe atualizada para um coverflow 3D inspirado no exemplo Carousel: Coverflow do Motion.
- Navegação por arraste/swipe, roda do mouse, setas e indicadores.
- Revisão mobile-first: hero, tratamentos, serviços, horários, jornada, espaço, FAQ, contato e rodapé.
