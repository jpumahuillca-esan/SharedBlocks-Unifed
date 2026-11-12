export interface ProgramCardItem {
  id: string;
  image: string;
  imageAlt: string;
  /** Punto focal de la imagen (0-100%). */
  imageFocusX?: number;
  imageFocusY?: number;
  imageFocusProfiles?: any;
  /** Título de la carrera (ej: "ESAN Management"). */
  title: string;
  /** Descripción o área académica (ej: "Carreras de ciencias administrativas"). */
  desc: string;
  /** URL de destino. */
  url: string;
  target?: string;
}

export interface CardsDpaData {
  // Logo
  logoImage: string;
  logoAlt: string;
  logoHeight: number;

  // Encabezado
  title: string;
  desc: string;

  // Enlace derecho
  linkLabel: string;
  linkUrl: string;
  linkTarget?: string;

  // Fondo
  bgType: 'overlay' | 'gradient' | 'color';
  backgroundImage: string;
  backgroundColor: string;
  gradientStart: string;
  gradientEnd: string;
  overlayOpacity: number;

  // Tarjetas
  cards: ProgramCardItem[];
}

export function buildCardItem(raw: any, index: number): ProgramCardItem {
  return {
    id: raw?.id || `dpa-card-${index + 1}-${Date.now().toString(36)}`,
    image: raw?.image || '',
    imageAlt: raw?.imageAlt || '',
    imageFocusX: typeof raw?.imageFocusX === 'number' ? raw.imageFocusX : 50,
    imageFocusY: typeof raw?.imageFocusY === 'number' ? raw.imageFocusY : 20,
    imageFocusProfiles: raw?.imageFocusProfiles,
    title: raw?.title || '',
    desc: raw?.desc || '',
    url: raw?.url || raw?.href || '',
    target: raw?.target || '_self',
  };
}

export function buildCardsDpaData(raw: any = {}): CardsDpaData {
  const defaultCards: ProgramCardItem[] = [
    {
      id: 'dpa-1',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'ESAN Management',
      title: 'ESAN Management',
      desc: 'Carreras de ciencias administrativas',
      url: '/carreras/administracion',
      target: '_self',
    },
    {
      id: 'dpa-2',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'ESAN Engineering',
      title: 'ESAN Engineering',
      desc: 'Carreras de ingeniería',
      url: '/carreras/ingenieria',
      target: '_self',
    },
    {
      id: 'dpa-3',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'ESAN Psychology',
      title: 'ESAN Psychology',
      desc: 'Carreras de ciencias sociales',
      url: '/carreras/psicologia',
      target: '_self',
    },
    {
      id: 'dpa-4',
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=800&auto=format&fit=crop',
      imageAlt: 'ESAN Law',
      title: 'ESAN Law',
      desc: 'Carreras de derecho',
      url: '/carreras/derecho',
      target: '_self',
    },
  ];

  const cardsList = Array.isArray(raw?.cards)
    ? raw.cards.map((c: any, i: number) => buildCardItem(c, i))
    : defaultCards;

  return {
    logoImage: raw?.logoImage || '',
    logoAlt: raw?.logoAlt || 'ESAN DPA - Carreras para gente que trabaja',
    logoHeight: typeof raw?.logoHeight === 'number' ? raw.logoHeight : 44,

    title: raw?.title || 'Carreras para gente que trabaja',
    desc: raw?.desc || 'Diseñado para adultos con experiencia laboral que buscan obtener su título universitario. Estudia a distancia, semipresencial o presencial, con horarios flexibles, y convalida cursos de tus estudios anteriores.',

    linkLabel: raw?.linkLabel || 'Descubre más de ESAN DPA',
    linkUrl: raw?.linkUrl || '',
    linkTarget: raw?.linkTarget || '_self',

    bgType: raw?.bgType || 'overlay',
    backgroundImage: raw?.backgroundImage !== undefined
      ? raw.backgroundImage
      : 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600&auto=format&fit=crop',
    backgroundColor: raw?.backgroundColor || '#0B1B3D',
    gradientStart: raw?.gradientStart || 'rgba(11, 27, 61, 0.94)',
    gradientEnd: raw?.gradientEnd || 'rgba(22, 44, 94, 0.88)',
    overlayOpacity: typeof raw?.overlayOpacity === 'number' ? raw.overlayOpacity : 90,

    cards: cardsList,
  };
}
