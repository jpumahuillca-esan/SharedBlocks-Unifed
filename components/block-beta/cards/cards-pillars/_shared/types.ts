import { CARDS_PILLARS_CONTENT_RULES } from './rules';

export interface PillarCard {
  id: string;
  icon: string;
  title: string;
}

export interface CardsPillarsData {
  title: string;
  cards: PillarCard[];
}

const normalizeLimitedString = (value: unknown, maxLength: number): string =>
  typeof value === 'string' ? value.slice(0, maxLength) : '';

export const newPillarCardId = (): string =>
  'pillar-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

export const buildPillarCard = (source: any = {}, fallbackId?: string): PillarCard => ({
  id: source?.id || fallbackId || newPillarCardId(),
  icon: typeof source?.icon === 'string' && source.icon ? source.icon : 'graduation-cap',
  title: normalizeLimitedString(source?.title, CARDS_PILLARS_CONTENT_RULES.card.title.maxLength),
});

export const buildCardsPillarsData = (source: any = {}): CardsPillarsData => ({
  title: normalizeLimitedString(source?.title ?? 'Nuestros pilares', CARDS_PILLARS_CONTENT_RULES.title.maxLength),
  cards: Array.isArray(source?.cards)
    ? source.cards.map((card: any, index: number) =>
        buildPillarCard(card, 'pillar-' + (index + 1))
      )
    : [],
});
