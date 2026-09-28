import { clinic, streetLine } from "./data/clinic";

export const SITE_NAME = clinic.name;
export const HOME_TITLE = "Turíbio Odontologia · Cuidado que faz sorrir";
export const HOME_DESCRIPTION =
  "Conheça a Turíbio Odontologia no Setor Garavelo, Aparecida de Goiânia. Implantes, próteses, estética dental e cuidados com seu sorriso. Fale pelo WhatsApp.";

// Rotas indexáveis. `services` vem de App.jsx (slug, title, summary).
export function buildRoutes(services) {
  return [
    { path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION },
    ...services.map((s) => ({
      path: `/tratamentos/${s.slug}`,
      title: `${s.title} | ${SITE_NAME}`,
      description: `${s.title} na Turíbio Odontologia, Setor Garavelo, Aparecida de Goiânia. ${s.summary} Fale pelo WhatsApp.`,
    })),
    {
      path: "/privacidade",
      title: `Privacidade | ${SITE_NAME}`,
      description:
        "Como o site da Turíbio Odontologia trata contatos pelo WhatsApp e informações de navegação.",
    },
  ];
}

export function seoFor(pathname, services) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  const found = buildRoutes(services).find((r) => r.path === clean);
  return (
    found || {
      path: clean,
      title: `Página não encontrada | ${SITE_NAME}`,
      description: HOME_DESCRIPTION,
      noindex: true,
    }
  );
}

// Atualiza <head> durante a navegação no navegador (o HTML estático já vem pronto por rota).
export function applyHead(seo) {
  if (typeof document === "undefined") return;
  document.title = seo.title;
  const set = (selector, create, value) => {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = create();
      document.head.appendChild(el);
    }
    el.setAttribute(el.tagName === "LINK" ? "href" : "content", value);
  };
  const meta = (attr, key) => () => {
    const el = document.createElement("meta");
    el.setAttribute(attr, key);
    return el;
  };
  const url = location.origin + (seo.path === "/" ? "/" : seo.path);
  set('meta[name="description"]', meta("name", "description"), seo.description);
  set('meta[property="og:title"]', meta("property", "og:title"), seo.title);
  set('meta[property="og:description"]', meta("property", "og:description"), seo.description);
  set('meta[property="og:url"]', meta("property", "og:url"), url);
  set('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), url);
}

// Dados estruturados (só com o que está confirmado em data/clinic.js).
export function jsonLd(siteUrl) {
  const a = clinic.address;
  const groups = new Map();
  for (const h of clinic.hours) {
    const key = `${h.opens}-${h.closes}`;
    if (!groups.has(key)) groups.set(key, { days: [], opens: h.opens, closes: h.closes });
    groups.get(key).days.push(h.day);
  }
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: clinic.name,
    url: siteUrl + "/",
    image: siteUrl + "/og-image.jpg",
    telephone: "+" + clinic.phone,
    address: {
      "@type": "PostalAddress",
      ...(a.street ? { streetAddress: streetLine(a) } : {}),
      addressLocality: a.city,
      addressRegion: a.region,
      ...(a.postalCode ? { postalCode: a.postalCode } : {}),
      addressCountry: "BR",
    },
    hasMap: clinic.mapsUrl,
    sameAs: [clinic.instagram],
    openingHoursSpecification: [...groups.values()].map((g) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: g.days,
      opens: g.opens,
      closes: g.closes,
    })),
  };
}
