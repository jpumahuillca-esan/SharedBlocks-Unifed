export interface AudienceCardItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  imageAlt?: string;
  href?: string;
  target?: string;
}

export interface AudienceSwitcherData {
  title?: string;
  cards?: AudienceCardItem[];
}

export const normalizeAudienceSwitcherData = (raw: unknown): Required<AudienceSwitcherData> => {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;

  const defaultCards: AudienceCardItem[] = [
    {
      id: 'as-1',
      title: 'Terminé el colegio',
      desc: 'Conoce la carreras de pregrado para empezar tu vida universitaria.',
      image: '/storage/media/main/2026/09/1790349849_banner-image-wide.webp',
      imageAlt: 'Estudiantes de pregrado ESAN',
      href: '#pregrado',
      target: '_self',
    },
    {
      id: 'as-2',
      title: 'Ya trabajo',
      desc: 'Conoce las carreras universitarias para adultos con experiencia laboral.',
      image: '/storage/media/main/2026/09/1790349853_banner-image-wide-1.webp',
      imageAlt: 'Estudiantes DPA ESAN',
      href: '#dpa',
      target: '_self',
    },
  ];

  return {
    title: typeof data.title === 'string' ? data.title : '¿En qué momento estás?',
    cards: Array.isArray(data.cards) && data.cards.length > 0 ? (data.cards as AudienceCardItem[]) : defaultCards,
  };
};

