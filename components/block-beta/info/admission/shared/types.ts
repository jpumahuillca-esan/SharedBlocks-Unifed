import { normalizeLinkTarget, type LinkTarget } from '../../../../../helpers/linkTarget';
import { normalizeImageFocus, normalizeImageFocusProfiles, type ImageFocusProfiles } from '../../../../../helpers/imageFocus';
import { normalizeBrandColorToken } from '../../../../editor-beta/EditorBrandColor/brandColors';

export interface AdmissionCard {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  imageFocusX: number;
  imageFocusY: number;
  imageFocusProfiles: ImageFocusProfiles;
  backgroundToken: string;
  buttonLabel: string;
  buttonUrl: string;
  buttonTarget: LinkTarget | '';
}

export interface AdmissionScheduleItem {
  id: string;
  label: string;
  value: string;
}

export interface AdmissionStep {
  id: string;
  title: string;
  description: string;
  linkLabel: string;
  linkUrl: string;
  linkTarget: LinkTarget | '';
}

export interface AdmissionModality {
  id: string;
  label: string;
  url: string;
  target: LinkTarget | '';
}

export interface AdmissionData {
  eyebrow: string;
  title: string;
  description: string;
  schedule: AdmissionScheduleItem[];
  stepsTitle: string;
  steps: AdmissionStep[];
  modalitiesTitle: string;
  modalities: AdmissionModality[];
  cardsTitle: string;
  cards: AdmissionCard[];
}

export const createAdmissionCard = (): AdmissionCard => ({
  id: `admission-card-${Date.now()}`,
  eyebrow: '',
  title: 'Nueva modalidad',
  description: '',
  image: '',
  imageAlt: '',
  imageFocusX: 50,
  imageFocusY: 50,
  imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
  backgroundToken: '--ds-color-esan-corp',
  buttonLabel: 'Conoce más',
  buttonUrl: '',
  buttonTarget: '',
});

export const createAdmissionScheduleItem = (): AdmissionScheduleItem => ({
  id: `admission-date-${Date.now()}`,
  label: 'Nueva fecha',
  value: '',
});

export const createAdmissionStep = (): AdmissionStep => ({
  id: `admission-step-${Date.now()}`,
  title: 'Nuevo paso',
  description: '',
  linkLabel: '',
  linkUrl: '',
  linkTarget: '',
});

export const createAdmissionModality = (): AdmissionModality => ({
  id: `admission-modality-${Date.now()}`,
  label: 'Nueva modalidad',
  url: '',
  target: '',
});

export const DEFAULT_ADMISSION_DATA: AdmissionData = {
  eyebrow: 'Admisión 2027-I',
  title: 'Postula en 4 pasos',
  description: 'El examen regular es para estudiantes de quinto de secundaria. Las clases empiezan en marzo de 2027.',
  schedule: [
    { id: 'admission-date-1', label: 'Examen de admisión regular', value: '26 de septiembre de 2026' },
    { id: 'admission-date-2', label: 'Inscripción', value: '28 de septiembre de 2026' },
    { id: 'admission-date-3', label: 'Inscripción extemporánea', value: '16 de octubre de 2026' },
    { id: 'admission-date-4', label: 'Publicación de resultados', value: '26 de octubre de 2026' },
    { id: 'admission-date-5', label: 'Inicio de clases', value: 'Marzo de 2027 - I' },
  ],
  stepsTitle: 'Pasos para postular',
  steps: [
    { id: 'admission-step-1', title: 'Preinscríbete', description: 'Completa el formulario con tus datos y la carrera que te interesa.', linkLabel: 'Preinscríbete aquí', linkUrl: '', linkTarget: '' },
    { id: 'admission-step-2', title: 'Completa tu ficha', description: 'Recibirás por correo tu usuario y contraseña del portal del postulante.', linkLabel: '', linkUrl: '', linkTarget: '' },
    { id: 'admission-step-3', title: 'Envía tus documentos', description: 'En PDF o JPG, al correo de admisión.', linkLabel: '', linkUrl: '', linkTarget: '' },
    { id: 'admission-step-4', title: 'Paga tu derecho de postulación', description: 'Te enviamos las cuentas bancarias después del paso 3.', linkLabel: '', linkUrl: '', linkTarget: '' },
  ],
  modalitiesTitle: 'Elige tu modalidad',
  modalities: [
    { id: 'admission-modality-1', label: 'Examen de Admisión Regular', url: '', target: '' },
    { id: 'admission-modality-2', label: 'Reconocimiento al Rendimiento Escolar (REE)', url: '', target: '' },
    { id: 'admission-modality-3', label: 'PRE Universidad ESAN', url: '', target: '' },
    { id: 'admission-modality-4', label: 'Bachillerato Internacional', url: '', target: '' },
    { id: 'admission-modality-5', label: 'Convenios con Colegios', url: '', target: '' },
    { id: 'admission-modality-6', label: 'Traslado Externo', url: '', target: '' },
    { id: 'admission-modality-7', label: 'Otras modalidades', url: '', target: '' },
  ],
  cardsTitle: '',
  cards: [
    {
      id: 'admission-card-1',
      eyebrow: 'Modalidad de titulación',
      title: 'Curso de Actualización para titulación',
      description: 'Para bachilleres de ESAN que quieren obtener su título profesional.',
      image: '',
      imageAlt: '',
      imageFocusX: 50,
      imageFocusY: 50,
      imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
      backgroundToken: '--ds-color-esan-corp',
      buttonLabel: 'Conoce el curso',
      buttonUrl: '',
      buttonTarget: '',
    },
    {
      id: 'admission-card-2',
      eyebrow: 'Sistema de aprendizaje',
      title: 'Sistema de aprendizaje ESAN - SAE',
      description: 'Suma certificaciones y especializaciones durante la carrera, con mentorías personalizadas y la Global Week.',
      image: '',
      imageAlt: '',
      imageFocusX: 50,
      imageFocusY: 50,
      imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 50),
      backgroundToken: '--ds-color-univ-management',
      buttonLabel: 'Conoce SAE',
      buttonUrl: '',
      buttonTarget: '',
    },
  ],
};

export const normalizeAdmissionData = (raw?: Partial<AdmissionData> | null): AdmissionData => {
  const source = raw ?? {};
  return {
    eyebrow: typeof source.eyebrow === 'string' ? source.eyebrow : DEFAULT_ADMISSION_DATA.eyebrow,
    title: typeof source.title === 'string' ? source.title : DEFAULT_ADMISSION_DATA.title,
    description: typeof source.description === 'string' ? source.description : DEFAULT_ADMISSION_DATA.description,
    schedule: (Array.isArray(source.schedule) ? source.schedule : DEFAULT_ADMISSION_DATA.schedule).map((item, index) => ({
      id: String(item?.id || `admission-date-${index + 1}`),
      label: typeof item?.label === 'string' ? item.label : '',
      value: typeof item?.value === 'string' ? item.value : '',
    })),
    stepsTitle: typeof source.stepsTitle === 'string' ? source.stepsTitle : DEFAULT_ADMISSION_DATA.stepsTitle,
    steps: (Array.isArray(source.steps) ? source.steps : DEFAULT_ADMISSION_DATA.steps).map((step, index) => ({
      id: String(step?.id || `admission-step-${index + 1}`),
      title: typeof step?.title === 'string' ? step.title : '',
      description: typeof step?.description === 'string' ? step.description : '',
      linkLabel: typeof step?.linkLabel === 'string' ? step.linkLabel : '',
      linkUrl: typeof step?.linkUrl === 'string' ? step.linkUrl : '',
      linkTarget: normalizeLinkTarget(step?.linkTarget),
    })),
    modalitiesTitle: typeof source.modalitiesTitle === 'string' ? source.modalitiesTitle : DEFAULT_ADMISSION_DATA.modalitiesTitle,
    modalities: (Array.isArray(source.modalities) ? source.modalities : DEFAULT_ADMISSION_DATA.modalities).map((item, index) => ({
      id: String(item?.id || `admission-modality-${index + 1}`),
      label: typeof item?.label === 'string' ? item.label : '',
      url: typeof item?.url === 'string' ? item.url : '',
      target: normalizeLinkTarget(item?.target),
    })),
    cardsTitle: typeof source.cardsTitle === 'string' ? source.cardsTitle : DEFAULT_ADMISSION_DATA.cardsTitle,
    cards: (Array.isArray(source.cards) ? source.cards : DEFAULT_ADMISSION_DATA.cards).map((card, index) => {
      const imageFocusX = normalizeImageFocus(card?.imageFocusX);
      const imageFocusY = normalizeImageFocus(card?.imageFocusY);
      return {
        id: String(card?.id || `admission-card-${index + 1}`),
        eyebrow: typeof card?.eyebrow === 'string' ? card.eyebrow : '',
        title: typeof card?.title === 'string' ? card.title : '',
        description: typeof card?.description === 'string' ? card.description : '',
        image: typeof card?.image === 'string' ? card.image : '',
        imageAlt: typeof card?.imageAlt === 'string' ? card.imageAlt : '',
        imageFocusX,
        imageFocusY,
        imageFocusProfiles: normalizeImageFocusProfiles(card?.imageFocusProfiles, imageFocusX, imageFocusY),
        backgroundToken: typeof card?.backgroundToken === 'string'
          && normalizeBrandColorToken(card.backgroundToken) === card.backgroundToken
          ? card.backgroundToken
          : '--ds-color-esan-corp',
        buttonLabel: typeof card?.buttonLabel === 'string' ? card.buttonLabel : '',
        buttonUrl: typeof card?.buttonUrl === 'string' ? card.buttonUrl : '',
        buttonTarget: normalizeLinkTarget(card?.buttonTarget),
      };
    }),
  };
};
