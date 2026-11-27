export interface FrequentlyAskedQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface FrequentlyAskedQuestionsData {
  title: string;
  items: FrequentlyAskedQuestion[];
}

export const createQuestion = (): FrequentlyAskedQuestion => ({
  id: `faq-info-${Date.now()}`,
  question: 'Nueva pregunta',
  answer: '',
});

export const DEFAULT_FREQUENTLY_ASKED_QUESTIONS: FrequentlyAskedQuestionsData = {
  title: 'Preguntas Frecuentes',
  items: [
    {
      id: 'faq-info-1',
      question: '¿Cuánto cuesta estudiar Administración?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. La inversión depende de la escala asignada y de las condiciones vigentes para cada ciclo académico.',
    },
    {
      id: 'faq-info-2',
      question: '¿Cómo se asigna mi escala de pago?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. La escala se determina durante el proceso de admisión y se comunica al postulante antes del inicio de clases.',
    },
    {
      id: 'faq-info-3',
      question: '¿Qué necesito para postular por examen regular?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Revisa los requisitos y documentos solicitados para completar tu inscripción dentro de las fechas establecidas.',
    },
    {
      id: 'faq-info-4',
      question: '¿Cómo es el examen de admisión?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. La evaluación considera conocimientos y habilidades necesarias para iniciar tu formación universitaria.',
    },
    {
      id: 'faq-info-5',
      question: '¿Qué es el Ciclo 0 y puedo convalidarlo?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consulta las condiciones de convalidación y las asignaturas disponibles con el equipo de admisión.',
    },
  ],
};

export const normalizeFrequentlyAskedQuestions = (
  raw?: Partial<FrequentlyAskedQuestionsData> | null,
): FrequentlyAskedQuestionsData => {
  const source = raw ?? {};
  const items = Array.isArray(source.items) ? source.items : DEFAULT_FREQUENTLY_ASKED_QUESTIONS.items;

  return {
    title: typeof source.title === 'string' ? source.title : DEFAULT_FREQUENTLY_ASKED_QUESTIONS.title,
    items: items.map((item, index) => ({
      id: String(item?.id || `faq-info-${index + 1}`),
      question: typeof item?.question === 'string' ? item.question : '',
      answer: typeof item?.answer === 'string' ? item.answer : '',
    })),
  };
};
