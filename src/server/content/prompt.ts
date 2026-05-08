import type { BrandBriefInput } from "./schema";

export function buildCampaignPrompt(brief: BrandBriefInput) {
  return `
Genera una campana organica y publicitaria de 30 dias para redes sociales.

Marca: ${brief.brandName}
Descripcion: ${brief.description}
Oferta principal: ${brief.offer}
Audiencia: ${brief.audience}
Objetivo: ${brief.goal}
Paleta permitida: ${brief.palette.join(", ")}

Reglas:
- Escribe en espanol latino, claro y comercial.
- Cada dia debe tener un angulo distinto y accionable.
- Alterna formatos entre Post cuadrado, Story, Reel cover y Carrusel.
- Alterna pilares entre Oferta, Educativo, Prueba social, Objecion y Beneficio.
- Usa CTAs concretos orientados a mensajes, cotizaciones, reservas o compra.
- El copy principal debe ser breve y listo para publicar.
- Cada post debe tener exactamente 5 variantes de tono: Directo, Emocional, Oferta, Educativo y Urgencia.
- imagePrompt debe describir una imagen publicitaria que luego pueda generarse con Higgsfield. No incluyas texto incrustado en la imagen, logos falsos ni claims no mencionados.
- color debe ser uno de los colores de la paleta permitida.
- Devuelve exactamente 30 posts, dias 1 al 30, sin saltos ni duplicados.
`;
}
