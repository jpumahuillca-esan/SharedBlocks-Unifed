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

/** Un porcentaje válido (0-100); lo que no lo sea cae al centro. */
export const normalizeImageFocus = (value: unknown): number => {
  const number = Number(value);
  if (value === null || value === undefined || value === '' || !Number.isFinite(number)) {
    return DEFAULT_IMAGE_FOCUS;
  }
  return Math.min(100, Math.max(0, number));
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
