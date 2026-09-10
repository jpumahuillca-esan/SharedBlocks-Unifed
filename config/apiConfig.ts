// Esta librería la consumen varias apps/tenants (front y public-site, y en el
// futuro potencialmente otros sitios además de RiesGIRD). Antes estas URLs
// estaban fijas en código, lo que ata la librería compartida a un solo
// dominio de producción. Ahora se leen del entorno de la app que la consume
// (Vite expone import.meta.env.VITE_* tanto en front como en public-site/Nuxt),
// con el valor de RiesGIRD como fallback para no romper nada si la app
// consumidora todavía no define la variable.
const env = (typeof import.meta !== 'undefined' ? import.meta.env : {}) as Record<string, string | undefined>;

export const PUBLIC_API_URL =
  env?.VITE_PUBLIC_API_URL || 'https://api.redgirdaccperu.edu.pe/api/public';

export const PUBLIC_STORAGE_URL =
  env?.VITE_PUBLIC_STORAGE_URL || 'https://admin.redgirdaccperu.edu.pe/storage';

export default {
  PUBLIC_API_URL,
  PUBLIC_STORAGE_URL
};