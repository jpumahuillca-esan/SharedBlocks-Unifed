/**
 * Formato de fechas para las secciones de tarjetas.
 *
 * El editor guarda la fecha en formato ISO (AAAA-MM-DD), que es lo que produce
 * y consume el selector nativo del navegador. De ahí se derivan los formatos de
 * presentación, para que exista una sola fuente de verdad.
 *
 * IMPORTANTE — por qué no se usa `new Date(iso)`:
 * ese constructor interpreta "2026-03-12" como medianoche UTC. En una zona con
 * desfase negativo, como Lima (UTC-5), `getDate()` devolvería el día anterior y
 * la tarjeta mostraría el 11 en vez del 12. Por eso la cadena se parte a mano:
 * no interviene ninguna zona horaria.
 */

const MONTHS_SHORT = [
    'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
    'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

/** ¿La cadena tiene forma de fecha ISO? */
export const isIsoDate = (value: unknown): value is string =>
    typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

interface DateParts {
    year: string;
    month: string;
    day: string;
}

const splitIso = (iso: string): DateParts | null => {
    if (!isIsoDate(iso)) return null;

    const [year, month, day] = iso.split('-');
    const monthNumber = Number(month);
    if (monthNumber < 1 || monthNumber > 12) return null;

    return { year, month, day };
};

/**
 * Día y mes abreviado para el bloque de fecha de la tarjeta de evento.
 * Devuelve null si la cadena no es una fecha ISO válida.
 */
export const toEventDateParts = (iso: string): { day: string; month: string } | null => {
    const parts = splitIso(iso);
    if (!parts) return null;

    return {
        day: parts.day,
        month: MONTHS_SHORT[Number(parts.month) - 1],
    };
};

/**
 * Fecha en formato de lectura para la tarjeta de publicación, ej. 09/07/2026.
 * Devuelve null si la cadena no es una fecha ISO válida.
 */
export const toDisplayDate = (iso: string): string | null => {
    const parts = splitIso(iso);
    if (!parts) return null;

    return `${parts.day}/${parts.month}/${parts.year}`;
};
