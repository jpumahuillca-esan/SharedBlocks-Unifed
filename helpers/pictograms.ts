/**
 * Catálogo de pictogramas de marca.
 *
 * Son los dibujos rellenos que acompañan a un dato o a un beneficio: un avión
 * junto a los intercambios, una medalla junto a una titulación. No son íconos
 * de interfaz: esos salen de Lucide a través de AtomIcon, que es la única
 * librería que el kit permite para controles. Los pictogramas son ilustración
 * de la marca, van más grandes y rellenos, y por eso tienen su propio catálogo.
 *
 * Los archivos viven en assets/icons/pictograms/ y se guardan "limpios": sin
 * ancho ni alto fijos y con fill="currentColor". Así el tamaño lo decide quien
 * los usa y el color lo pone un token (ver _pictograms.scss) en lugar de ir
 * escrito dentro de cada archivo. Los originales del diseño traían dos rojos
 * distintos (#E3173E y #E64626); con el token quedan todos iguales.
 *
 * Está en helpers/ y no en la carpeta de un bloque porque lo consumen piezas
 * reutilizables: AtomPictogram para dibujarlos y los editores de cualquier
 * bloque que ofrezca un selector de pictograma. Un átomo no puede depender de
 * un bloque.
 *
 * AGREGAR UNO NUEVO: dejar el .svg limpio en assets/icons/pictograms/,
 * importarlo aquí con ?raw y sumarlo a PICTOGRAMS con su etiqueta. Aparece solo
 * en todos los selectores que usen PICTOGRAM_OPTIONS.
 */
import airplane from '../assets/icons/pictograms/airplane.svg?raw';
import alumni from '../assets/icons/pictograms/alumni.svg?raw';
import awards from '../assets/icons/pictograms/awards.svg?raw';
import chats from '../assets/icons/pictograms/chats.svg?raw';
import familyHold from '../assets/icons/pictograms/family-hold.svg?raw';
import graduateDoc from '../assets/icons/pictograms/graduate-doc.svg?raw';

export interface PictogramDefinition {
    /** Nombre legible para el selector del editor. */
    label: string;
    /** Marcado del SVG tal como está en el archivo. */
    svg: string;
}

/*
 * La clave es lo que se guarda en el contenido del bloque, así que no debe
 * cambiar una vez publicada: renombrarla deja sin ícono a los ítems que ya la
 * usaban. La etiqueta sí se puede cambiar libremente.
 */
export const PICTOGRAMS: Record<string, PictogramDefinition> = {
    airplane: { label: 'Avión — movilidad e intercambios', svg: airplane },
    alumni: { label: 'Egresado — titulación y grados', svg: alumni },
    awards: { label: 'Medalla — reconocimientos y logros', svg: awards },
    chats: { label: 'Comunidad — personas conectadas', svg: chats },
    'family-hold': { label: 'Red — personas acompañadas', svg: familyHold },
    'graduate-doc': { label: 'Documento — programas y certificados', svg: graduateDoc },
};

/** Opciones listas para un <select>, en el orden del catálogo. */
export const PICTOGRAM_OPTIONS = Object.entries(PICTOGRAMS).map(([value, { label }]) => ({
    value,
    label,
}));

/** Marcado del pictograma, o cadena vacía si el nombre no está en el catálogo. */
export const getPictogramSvg = (name?: string | null): string =>
    (name && PICTOGRAMS[name]?.svg) || '';
