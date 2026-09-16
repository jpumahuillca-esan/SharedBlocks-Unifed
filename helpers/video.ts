/**
 * Resolución de la fuente de un video a partir de un enlace pegado a mano.
 *
 * Vive en helpers/ y no en la carpeta de un bloque porque lo consumen tanto las
 * moléculas (components/molecules) como los editores de los bloques, y una
 * molécula no puede depender de un bloque: va por debajo en la jerarquía.
 */

/**
 * Cómo se reproduce un video.
 *
 * Se distingue el `iframe` del archivo porque no se montan igual: el primero es
 * un reproductor de terceros con su propia interfaz, el segundo es un <video>
 * del navegador y necesita el atributo `controls`.
 */
export type VideoSource =
    | { kind: 'none' }
    | { kind: 'iframe'; src: string }
    | { kind: 'file'; src: string };

const YOUTUBE_HOSTS = new Set([
    'youtube.com', 'www.youtube.com', 'm.youtube.com',
    'youtu.be', 'www.youtu.be',
    'youtube-nocookie.com', 'www.youtube-nocookie.com',
]);

const VIMEO_HOSTS = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']);

/** Extensiones que el navegador reproduce por sí solo con <video>. */
const VIDEO_FILE = /\.(mp4|webm|ogv|ogg|mov)(\?.*)?$/i;

/** Un id de YouTube son 11 caracteres de un alfabeto acotado. */
const YOUTUBE_ID = /^[\w-]{11}$/;

/** Saca el id de video de cualquiera de las formas de enlace de YouTube. */
const youtubeId = (url: URL): string => {
    // youtu.be/<id>
    if (url.hostname.endsWith('youtu.be')) {
        return url.pathname.slice(1).split('/')[0] ?? '';
    }

    // youtube.com/watch?v=<id>
    const fromQuery = url.searchParams.get('v');
    if (fromQuery) return fromQuery;

    // youtube.com/{embed,shorts,live,v}/<id>
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length >= 2 && ['embed', 'shorts', 'live', 'v'].includes(segments[0])) {
        return segments[1];
    }

    return '';
};

/** Saca el id numérico de cualquiera de las formas de enlace de Vimeo. */
const vimeoId = (url: URL): string => {
    const segments = url.pathname.split('/').filter(Boolean);

    /*
     * Se busca el ÚLTIMO segmento que sea solo dígitos: Vimeo antepone rutas
     * como /channels/<nombre>/<id> o /groups/<nombre>/videos/<id>, y
     * player.vimeo.com usa /video/<id>. El id es siempre el numérico final.
     */
    for (let i = segments.length - 1; i >= 0; i -= 1) {
        if (/^\d+$/.test(segments[i])) return segments[i];
    }

    return '';
};

/**
 * Traduce lo que se pegó en el editor a algo reproducible.
 *
 * Se acepta el enlace tal cual se copia del navegador (el de "compartir", el de
 * la barra de direcciones o el de incrustar) en lugar de exigir un formato
 * concreto: quien carga el contenido no tiene por qué saber cuál de todos es.
 *
 * `autoplay` va activo en el enlace que se devuelve porque esta función se usa
 * para montar el reproductor DESPUÉS de que alguien pulsó reproducir — no
 * provoca reproducción no solicitada al cargar la página.
 */
export const toVideoSource = (raw: unknown): VideoSource => {
    const value = typeof raw === 'string' ? raw.trim() : '';
    if (!value) return { kind: 'none' };

    let url: URL;
    try {
        url = new URL(value);
    } catch {
        /*
         * No es una URL absoluta. Puede ser una ruta relativa a un archivo
         * subido al gestor de medios, que es un caso legítimo; cualquier otra
         * cosa se descarta en lugar de intentar adivinar.
         */
        return VIDEO_FILE.test(value) ? { kind: 'file', src: value } : { kind: 'none' };
    }

    if (YOUTUBE_HOSTS.has(url.hostname)) {
        const id = youtubeId(url);
        if (!YOUTUBE_ID.test(id)) return { kind: 'none' };

        // nocookie: no deja rastro de seguimiento en quien solo visita la página.
        return {
            kind: 'iframe',
            src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`,
        };
    }

    if (VIMEO_HOSTS.has(url.hostname)) {
        const id = vimeoId(url);
        if (!id) return { kind: 'none' };

        return {
            kind: 'iframe',
            src: `https://player.vimeo.com/video/${id}?autoplay=1&playsinline=1`,
        };
    }

    if (VIDEO_FILE.test(url.pathname)) {
        return { kind: 'file', src: value };
    }

    return { kind: 'none' };
};
