/**
 * Modelo de datos del bloque Cards Version 2.
 *
 * Sigue la arquitectura de block-beta: tipos e interfaces puros para
 * los datos del editor y el renderizador.
 */

export interface CardVersion2Item {
  id: string;
  icon: string;
  title: string;
  desc?: string;
  href?: string;
  target?: string;
}

export type CardsVersion2Background = '#F1F5F9' | '#FFFFFF';

export interface CardsVersion2Data {
  backgroundColor?: CardsVersion2Background | string;
  eyebrow?: string;
  eyebrowColorToken?: string;
  title: string;
  desc?: string;
  cards: CardVersion2Item[];
}

export const newCardId = (): string =>
  `cv2-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const buildCard = (source: any): CardVersion2Item => ({
  id: source?.id || newCardId(),
  icon: typeof source?.icon === 'string' && source.icon.trim() ? source.icon.trim() : 'graduation-cap',
  title: typeof source?.title === 'string' ? source.title : '',
  desc: typeof source?.desc === 'string' ? source.desc : '',
  href: typeof source?.href === 'string' ? source.href : '',
  target: source?.target === '_blank' ? '_blank' : '',
});

export const buildCardsVersion2Data = (source: any): CardsVersion2Data => ({
  backgroundColor: source?.backgroundColor === '#FFFFFF' ? '#FFFFFF' : '#F1F5F9',
  eyebrow: typeof source?.eyebrow === 'string' ? source.eyebrow : '+ PREGRADO',
  eyebrowColorToken: typeof source?.eyebrowColorToken === 'string'
    ? source.eyebrowColorToken
    : (typeof source?.eyebrowTextColorToken === 'string' ? source.eyebrowTextColorToken : '--ds-color-univ-management'),
  title: typeof source?.title === 'string' ? source.title : '',
  desc: typeof source?.desc === 'string' ? source.desc : '',
  cards: Array.isArray(source?.cards)
    ? source.cards.map(buildCard)
    : [],
});
