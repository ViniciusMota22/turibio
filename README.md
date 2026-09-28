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
- Lighthouse 13.5.0, Chrome headless, em build de produção local, configuração mobile padrão: **Performance 94 / Acessibilidade 100**.
- **180.410 bytes** de imagens transferidas na auditoria (aproximadamente 180 KB); CLS **0**; LCP **2,9 s**.
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
