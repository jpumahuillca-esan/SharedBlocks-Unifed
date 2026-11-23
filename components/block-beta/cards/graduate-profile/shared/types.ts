export interface GraduateProfileCard {
  id: string;
  title: string;
  intro: string;
  items: Array<{ id: string; text: string }>;
}

export interface GraduateProfileData {
  title: string;
  cards: GraduateProfileCard[];
}

export const createGraduateProfileItem = (index = 0) => ({
  id: `graduate-profile-item-${Date.now()}-${index}`,
  text: '',
});

export const createGraduateProfileCard = (): GraduateProfileCard => ({
  id: `graduate-profile-card-${Date.now()}`,
  title: 'Nueva tarjeta',
  intro: '',
  items: [],
});

export const DEFAULT_GRADUATE_PROFILE: GraduateProfileData = {
  title: 'Perfil del egresado',
  cards: [
    {
      id: 'graduate-profile-card-1',
      title: 'Lo que vas a lograr',
      intro: 'Al terminar la carrera, podrás:',
      items: [
        { id: 'graduate-profile-item-1', text: 'Liderar equipos diversos, gestionar proyectos con liderazgo transformador y comunicar ideas con claridad, resolviendo problemas y negociando con eficacia en entornos multiculturales.' },
        { id: 'graduate-profile-item-2', text: 'Tomar decisiones estratégicas a partir de técnicas estadísticas y de los fundamentos teóricos y prácticos de la contabilidad financiera y de gestión, apoyado en la tecnología y la innovación empresarial.' },
      ],
    },
    {
      id: 'graduate-profile-card-2',
      title: 'Dónde vas a trabajar',
      intro: 'Podrás desempeñarte en:',
      items: [
        { id: 'graduate-profile-item-3', text: 'Roles directivos y de asesoramiento en diversos sectores empresariales, como gerente de operaciones, consultor empresarial y analista de procesos.' },
        { id: 'graduate-profile-item-4', text: 'El sector público o entidades sin fines de lucro.' },
        { id: 'graduate-profile-item-5', text: 'La docencia y la investigación en gestión empresarial.' },
      ],
    },
  ],
};

export const normalizeGraduateProfile = (raw?: Partial<GraduateProfileData> | null): GraduateProfileData => {
  const source = raw ?? {};
  const cards = Array.isArray(source.cards) ? source.cards : DEFAULT_GRADUATE_PROFILE.cards;
  return {
    title: typeof source.title === 'string' ? source.title : DEFAULT_GRADUATE_PROFILE.title,
    cards: cards.map((card, cardIndex) => ({
      id: String(card?.id || `graduate-profile-card-${cardIndex + 1}`),
      title: typeof card?.title === 'string' ? card.title : '',
      intro: typeof card?.intro === 'string' ? card.intro : '',
      items: (Array.isArray(card?.items) ? card.items : []).map((item, itemIndex) => ({
        id: String(item?.id || `graduate-profile-${cardIndex}-${itemIndex}`),
        text: typeof item?.text === 'string' ? item.text : '',
      })),
    })),
  };
};
