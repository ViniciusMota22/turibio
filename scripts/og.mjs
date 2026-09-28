// Gera public/og-image.jpg (1200x630) para o preview do WhatsApp/Instagram/Google.
// Uso: node scripts/og.mjs   (usa originals/hero-consultorio.png e a fonte Cormorant Garamond instalada no sistema)
import sharp from "sharp";
const W = 1200, H = 630, PHOTO_W = 481;
const photo = await sharp("originals/hero-consultorio.png")
  .resize({ width: PHOTO_W, height: H, fit: "cover", position: "centre" })
  .toBuffer();
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="fade" x1="0" x2="1">
      <stop offset="0" stop-color="#102c38" stop-opacity="1"/>
      <stop offset="1" stop-color="#102c38" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect x="${W - PHOTO_W}" width="120" height="${H}" fill="url(#fade)"/>
  <g transform="translate(80 118) scale(2.3)" fill="none" stroke="#ab8953" stroke-width="1.4">
    <path d="M22 7C15 2 5 2 4 12c-1 8 5 13 6 20s2 13 5 13c4 0 3-18 8-18s4 18 8 18c3 0 4-9 5-15s6-12 4-19C37 0 27 5 22 7Z"/>
    <path d="M9 15c7-3 12 7 24-4M16 7c4 4 7 5 12 5"/>
  </g>
  <text x="80" y="342" font-family="Cormorant Garamond" font-size="104" letter-spacing="12" fill="#f0ede6">TURÍBIO</text>
  <text x="84" y="394" font-family="Cormorant Garamond" font-size="27" letter-spacing="13" fill="#ab8953">ODONTOLOGIA</text>
  <text x="80" y="486" font-family="Cormorant Garamond" font-style="italic" font-size="50" fill="#ab8953">Cuidado que faz sorrir</text>
  <text x="80" y="566" font-family="Cormorant Garamond" font-size="28" letter-spacing="2" fill="#c9d3d6">Setor Garavelo · Aparecida de Goiânia</text>
</svg>`;
await sharp({
  create: { width: W, height: H, channels: 3, background: "#102c38" },
})
  .composite([
    { input: photo, left: W - PHOTO_W, top: 0 },
    { input: Buffer.from(svg), left: 0, top: 0 },
  ])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile("public/og-image.jpg");
console.log("public/og-image.jpg gerado");
