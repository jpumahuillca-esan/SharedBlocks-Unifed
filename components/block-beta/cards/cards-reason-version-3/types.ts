/**
 * Modelo de datos del bloque Cards Reason Version 3.
 *
 * Muestra métricas o razones clave de elección (ej. "1º", "3º", "11", "+130")
 * con sus respectivas descripciones explicativas.
 */

export interface CardReasonItem {
  id: string;
  number: string;
  label: string;
  href?: string;
  target?: string;
}

export interface CardsReasonVersion3Data {
  eyebrow?: string;
  title: string;
  desc?: string;
  cards: CardReasonItem[];
}

export const newReasonCardId = (): string =>
  `cr3-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const buildReasonCard = (source: any): CardReasonItem => ({
  id: source?.id || newReasonCardId(),
  number: typeof source?.number === 'string' || typeof source?.number === 'number'
    ? String(source.number)
    : '1º',
  label: typeof source?.label === 'string' ? source.label : '',
  href: typeof source?.href === 'string' ? source.href : '',
  target: source?.target === '_blank' ? '_blank' : '',
});

export const buildCardsReasonVersion3Data = (source: any): CardsReasonVersion3Data => ({
  eyebrow: typeof source?.eyebrow === 'string' ? source.eyebrow : '',
  title: typeof source?.title === 'string' ? source.title : '¿Por qué elegir a ESAN?',
  desc: typeof source?.desc === 'string' ? source.desc : '',
  cards: Array.isArray(source?.cards)
    ? source.cards.map(buildReasonCard)
    : [],
});
