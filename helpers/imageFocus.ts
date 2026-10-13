/**
 * Punto focal de una imagen: qué parte de la foto debe quedar a la vista cuando
 * el bloque la recorta (`object-fit: cover`).
 *
 * Se guarda como dos porcentajes, `imageFocusX` e `imageFocusY` (0 a 100), junto
 * a la `image` que gobiernan, y se aplica con `object-position`. El centro, 50 y
 * 50, es el comportamiento normal del navegador: una imagen guardada sin punto
 * focal se ve igual que siempre.
 *
 * Vive en helpers/ y no en un bloque porque lo consumen las moléculas
 * (tarjeta de evento, de publicación, testimonio, banner, video) y una molécula
 * no puede depender de la carpeta de un bloque.
 */

export const DEFAULT_IMAGE_FOCUS = 50;

export const IMAGE_FOCUS_PROFILE_KEYS = ['web', 'tablet', 'mobile'] as const;

export type ImageFocusMode = (typeof IMAGE_FOCUS_PROFILE_KEYS)[number];

export type ImageFocusPoint = {
  x: number;
  y: number;
};

export type ImageFocusProfiles = Record<ImageFocusMode, ImageFocusPoint>;

/** Un porcentaje válido (0-100); lo que no lo sea cae al centro. */
export const normalizeImageFocus = (value: unknown): number => {
  const number = Number(value);
  if (value === null || value === undefined || value === '' || !Number.isFinite(number)) {
    return DEFAULT_IMAGE_FOCUS;
  }
  return Math.min(100, Math.max(0, number));
};

/**
 * Normaliza los tres encuadres. Los bloques antiguos solo guardaban X/Y; esos
 * valores se usan como valor inicial para los tres perfiles y no se pierde el
 * encuadre que ya tenían.
 */
export const normalizeImageFocusProfiles = (
  source?: Partial<Record<ImageFocusMode, Partial<ImageFocusPoint>>> | null,
  fallbackX?: unknown,
  fallbackY?: unknown,
): ImageFocusProfiles => {
  const fallback = {
    x: normalizeImageFocus(fallbackX),
    y: normalizeImageFocus(fallbackY),
  };

  const normalizePoint = (point?: Partial<ImageFocusPoint> | null): ImageFocusPoint => ({
    x: normalizeImageFocus(point?.x ?? fallback.x),
    y: normalizeImageFocus(point?.y ?? fallback.y),
  });

  return {
    web: normalizePoint(source?.web),
    tablet: normalizePoint(source?.tablet),
    mobile: normalizePoint(source?.mobile),
  };
};

/** Crea los perfiles que `EditorImage` muestra en su selector responsive. */
export const createImageFocusModes = (
  ratios: string | Partial<Record<ImageFocusMode, string>>,
) => IMAGE_FOCUS_PROFILE_KEYS.map((key) => {
  const ratio = typeof ratios === 'string' ? ratios : ratios[key];
  return {
    key,
    label: key === 'web' ? 'Web' : key === 'tablet' ? 'Tablet' : 'Móvil',
    ...(ratio ? { ratio } : {}),
  };
});

/** Convierte los perfiles guardados en variables para la imagen del bloque. */
export const imageFocusProfilesStyle = (
  profiles?: Partial<Record<ImageFocusMode, Partial<ImageFocusPoint>>> | null,
  fallbackX?: unknown,
  fallbackY?: unknown,
): Record<string, string> => {
  const normalized = normalizeImageFocusProfiles(profiles, fallbackX, fallbackY);
  const toPosition = ({ x, y }: ImageFocusPoint) => `${x}% ${y}%`;

  return {
    '--image-focus-web': toPosition(normalized.web),
    '--image-focus-tablet': toPosition(normalized.tablet),
    '--image-focus-mobile': toPosition(normalized.mobile),
  };
};

/** Guarda perfiles y mantiene los campos X/Y antiguos como alias del perfil web. */
export const saveImageFocusProfiles = <T extends {
  imageFocusX?: number;
  imageFocusY?: number;
  imageFocusProfiles?: ImageFocusProfiles;
}>(target: T, profiles: unknown): void => {
  const normalized = normalizeImageFocusProfiles(
    profiles as Partial<Record<ImageFocusMode, Partial<ImageFocusPoint>>>,
    target.imageFocusX,
    target.imageFocusY,
  );

  target.imageFocusProfiles = normalized;
  target.imageFocusX = normalized.web.x;
  target.imageFocusY = normalized.web.y;
};

/**
 * Estilo para el `<img>`. Con el punto en el centro (o sin ningún valor)
 * devuelve `undefined`: el elemento no lleva `style` y el HTML de todo lo que
 * se guardó antes del punto focal queda exactamente igual.
 */
export const imageFocusStyle = (
  x?: number | null,
  y?: number | null,
): { objectPosition: string } | undefined => {
  const fx = normalizeImageFocus(x);
  const fy = normalizeImageFocus(y);
  if (fx === DEFAULT_IMAGE_FOCUS && fy === DEFAULT_IMAGE_FOCUS) return undefined;
  return { objectPosition: `${fx}% ${fy}%` };
};
