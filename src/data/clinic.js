// Dados da clínica em um só lugar. Site, dados estruturados (JSON-LD) e mapa leem daqui.
// Só preencha o que a clínica confirmar: campos vazios não aparecem em lugar nenhum.
export const clinic = {
  name: "Turíbio Odontologia",
  phone: "5562981195003",
  phoneDisplay: "(62) 98119-5003",
  mapsUrl: "https://maps.app.goo.gl/z1x1SN4i8SE5iHdq6",
  instagram: "https://www.instagram.com/turibio_odontologia/",
  address: {
    street: "", // ex.: "Rua X"  (preencher quando confirmado)
    number: "", // ex.: "123"
    complement: "",
    postalCode: "", // ex.: "74000-000"
    neighborhood: "Setor Garavelo",
    city: "Aparecida de Goiânia",
    region: "GO",
  },
  hours: [
    { label: "Segunda-feira", text: "08:00 às 18:00", day: "Monday", opens: "08:00", closes: "18:00" },
    { label: "Terça-feira", text: "08:00 às 18:00", day: "Tuesday", opens: "08:00", closes: "18:00" },
    { label: "Quarta-feira", text: "08:00 às 18:00", day: "Wednesday", opens: "08:00", closes: "18:00" },
    { label: "Quinta-feira", text: "08:00 às 18:00", day: "Thursday", opens: "08:00", closes: "18:00" },
    { label: "Sexta-feira", text: "08:00 às 18:00", day: "Friday", opens: "08:00", closes: "18:00" },
    { label: "Sábado", text: "08:00 às 12:30", day: "Saturday", opens: "08:00", closes: "12:30" },
  ],
};

export function streetLine(a = clinic.address) {
  if (!a.street) return "";
  return `${a.street}${a.number ? `, ${a.number}` : ""}${a.complement ? ` – ${a.complement}` : ""}`;
}

export function fullAddress(a = clinic.address) {
  return [streetLine(a), a.neighborhood, `${a.city} - ${a.region}`, a.postalCode]
    .filter(Boolean)
    .join(", ");
}
