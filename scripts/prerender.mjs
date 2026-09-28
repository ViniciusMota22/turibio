// Pré-renderiza cada rota em HTML estático (SEO + preview de links) depois do build.
// Gera: dist/index.html, dist/<rota>/index.html, dist/404.html, sitemap.xml e robots.txt.
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE = (process.env.SITE_URL || "https://turibio.vercel.app").replace(/\/$/, "");
const ssrDir = "dist-ssr";
const entry = path.resolve(ssrDir, "entry-server.js");
const server = await import(pathToFileURL(entry).href);
const template = await readFile("dist/index.html", "utf8");

const esc = (t) =>
  t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function head(seo, isHome) {
  const url = SITE + (seo.path === "/" ? "/" : seo.path);
  const image = SITE + "/og-image.jpg";
  const tags = [
    seo.noindex ? "" : `<link rel="canonical" href="${url}" />`,
    seo.noindex ? `<meta name="robots" content="noindex" />` : "",
    `<meta property="og:type" content="website" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:site_name" content="Turíbio Odontologia" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Turíbio Odontologia — cuidado que faz sorrir" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    // Sem JavaScript, o conteúdo revelado por animação continua legível.
    `<noscript><style>[style*="opacity: 0"],[style*="opacity:0"]{opacity:1!important;transform:none!important;clip-path:none!important}</style></noscript>`,
    isHome
      ? `<script type="application/ld+json">${JSON.stringify(server.jsonLd(SITE))}</script>`
      : "",
  ].filter(Boolean);
  return tags.join("\n    ");
}

function page(seo, isHome = false) {
  const body = server.render(seo.path === "404" ? "/__404__" : seo.path);
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${esc(seo.description)}" />`,
    )
    .replace("</head>", `    ${head(seo, isHome)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  return html;
}

async function write(file, content) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

const routes = server.routes();
for (const r of routes) {
  const file =
    r.path === "/" ? "dist/index.html" : `dist${r.path}/index.html`;
  await write(file, page(r, r.path === "/"));
}
// 404 real: hospedagem devolve este arquivo com status 404.
const notFound = { ...server.seo("/__404__"), path: "/__404__" };
await write("dist/404.html", page(notFound));

const today = new Date().toISOString().slice(0, 10);
await write(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(
      (r) =>
        `  <url><loc>${SITE}${r.path === "/" ? "/" : r.path}</loc><lastmod>${today}</lastmod></url>`,
    )
    .join("\n")}\n</urlset>\n`,
);
await write(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
);
await rm(ssrDir, { recursive: true, force: true });
console.log(`Pré-renderizadas ${routes.length} rotas + 404 (${SITE})`);
