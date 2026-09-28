# Turíbio Odontologia — acabamento e performance

Projeto local revisado. Nenhuma publicação foi realizada.

## Executar

```sh
npm ci
npm run dev
npm run build
npm run preview -- --port 4173
```

## Entrega

1. Imagens WebP + AVIF com tamanhos responsivos, dimensões intrínsecas, lazy loading e prioridade/preload do hero. Originais preservadas em `originals/`, fora de `public/` e `dist/`. Sem ampliação artificial: algumas fotografias recebidas têm baixa resolução. Conversão reproduzível: `node scripts/images.mjs`.
2. Loader removido; LazyMotion/domAnimation e componentes m. Coverflow com eventos nativos de ponteiro para dispensar domMax.
3. Hero com texto fixo solicitado, entrada por palavras, foto com deslocamento de até 40px e selo em velocidade diferente. Legenda e scroll-cue removidos.
4. Grids com stagger, jornada com progresso, rotas com AnimatePresence, menu com spring, indicador compartilhado e botões com feedback. O indicador mantém layoutId e anima posição/largura explicitamente, pois domAnimation não inclui projeção de layout.
5. Spotlight dourado, magnet de até 8px no CTA principal, marquee pausado em hover; máscaras e zoom das fotos. Efeitos de ponteiro restritos a hover/pointer fino.
6. Cormorant Garamond + Manrope locais, ritmo vertical ampliado, foco dourado, correções de contraste e teclado. O ZIP recebido tinha uma sobrescrita Montserrat; foi removida para atender à especificação atual.

O gradiente animado opcional de contato foi omitido para evitar outra animação contínua. Não foram criados dados ou imagens da clínica. Tratamentos, telefone e horários comparados ao commit original. O conteúdo editorial foi preservado, exceto as alterações de hero autorizadas.

## Validação

- Build Vite concluído sem erros ou warnings. A configuração filtra somente o aviso de diretivas `use client` em dependências num build exclusivo de cliente; demais avisos continuam ativos.
- Lighthouse 13.5.0, Chrome headless, em build de produção local, configuração mobile padrão: **Performance 93 / Acessibilidade 100**.
- **180.410 bytes** de imagens transferidas na auditoria (aproximadamente 180 KB); CLS **0**; LCP **2.9 s**.
- Larguras **360, 768 e 1440px** sem transbordamento horizontal. Capturas do hero e das seções em `reports/`.
- FAQ por Enter e atributo inert; menu por Enter/Escape; coverflow por setas, arraste e clique; todas as sete imagens da equipe; rotas e retorno por âncora verificados.
- Movimento reduzido: zero animações do navegador, transições CSS desativadas, máscaras abertas e componentes visíveis, interações Motion com duração zero.
- Números de Lighthouse são medições locais e variam com dispositivo, hospedagem e rede. Não representam medição de um site publicado.

Relatório navegável: `reports/lighthouse-mobile.report.html`.

Com a prévia em execução e Chrome instalado:

```sh
node scripts/verify.mjs
node scripts/interactions.mjs
node scripts/visual-check.mjs
node scripts/content-check.mjs
node scripts/audit.mjs
```

As ferramentas sharp, Playwright, Prettier e Lighthouse são dependências de desenvolvimento e não entram no JavaScript entregue ao paciente. `reports/images.json` registra também imagens lazy ainda fora da viewport; o teste de teclado visita e decodifica todas as sete fotos.

## Histórico

O repositório contém o baseline original e seis commits de implementação, um por bloco solicitado. O sexto inclui a verificação integrada e correções encontradas nela. `turibio-history.bundle` acompanha o ZIP como cópia portátil do histórico Git.

## Revisão da primeira dobra

### 1. Foto substituível

**Trocar o print por uma foto original bem iluminada é o maior ganho visual possível.** O arquivo recebido tem 749 px de largura; não é ampliado artificialmente.

Substitua somente `originals/hero-consultorio.png` por uma foto original PNG, mantendo o nome. `npm run dev` e `npm run build` geram WebP/AVIF até 1600px e atualizam dimensões, srcset e preload automaticamente, sem editar JSX ou HTML. Os originais ficam fora do build. O enquadramento usa object-fit: cover; mantenha o assunto principal próximo ao centro.

### 2–4. Entrada, título e contraste

Uma sequência de 0,98 s coordena máscara da foto, palavras e parágrafo. O CTA permanece visível e clicável desde o primeiro quadro; somente seu deslocamento termina por último. A home não recebe uma segunda animação de entrada da rota. Com reduced-motion, tudo aparece imediatamente.

O h1 usa Cormorant Garamond maior com clamp, três linhas e a última frase em itálico dourado. O detalhe dourado conduz ao WhatsApp. A sombra da foto foi suavizada; a nota mantém fundo sólido e texto contrastante. Fontes, equipe, FAQ e conteúdo da clínica foram preservados.

### 5. Parallax preservado

O parallax existente foi mantido: foto até 40px e selo até -16px, ambos estáticos com reduced-motion. O teste `scripts/hero-check.mjs` verifica o limite, o CTA inicial, as três larguras e a ausência de animações no modo reduzido.

### 6. Menos ruído

Foto, selo e nota foram mantidos. A legenda e o scroll-cue já estavam ausentes; estilos e ícone sem uso foram removidos. Nenhum novo elemento decorativo foi adicionado à foto.

### 7. Vídeo e entrega

Vídeo não incluído: não foi fornecido material original adequado. A foto está preparada para substituição; não houve criação de imagens ou de dados da clínica. Parallax, selo e redução de ruído já existentes foram preservados.

A revisão do hero tem sete commits por item, incluindo validação dos itens já atendidos e este registro da decisão sobre vídeo. O pacote contém fonte, imagens, originais, relatórios e bundle Git atualizado. Nada foi publicado.

Validação final: build sem erros/warnings; Lighthouse mobile local 93/100 em Performance e 100/100 em Acessibilidade; 360, 768 e 1440px com e sem reduced-motion; CTA visível e clicável na primeira verificação (0,26–0,47s no ambiente local). Esse tempo depende do dispositivo e da rede; não é uma garantia de carregamento em toda conexão 4G. Equipe, FAQ, tratamentos, privacidade e rodapé foram comparados ao commit anterior e permanecem idênticos. Testes de teclado, arraste e âncoras passaram.

Capturas desta revisão: `reports/hero-focus-360.png`, `reports/hero-focus-768.png` e `reports/hero-focus-1440.png`. Resultados detalhados em `reports/hero-focus.json`.
