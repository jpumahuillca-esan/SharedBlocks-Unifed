import {
  normalizeImageFocus,
  normalizeImageFocusProfiles,
  type ImageFocusProfiles,
} from '../../../../helpers/imageFocus';
import { normalizeLinkTarget, type LinkTarget } from '../../../../helpers/linkTarget';

export interface CourseFacultyMember {
  id: string;
  name: string;
  bio: string;
  image: string;
  imageAlt: string;
  imageFocusX: number;
  imageFocusY: number;
  imageFocusProfiles: ImageFocusProfiles;
  profileUrl: string;
  profileTarget: LinkTarget;
}

export interface CourseFacultyData {
  title: string;
  teachers: CourseFacultyMember[];
}

export const COURSE_FACULTY_RULES = {
  title: { maxLength: 100 },
  name: { maxLength: 120 },
  bio: { maxLength: 600 },
  maxTeachers: 12,
} as const;

export const DEFAULT_COURSE_FACULTY_DATA: CourseFacultyData = {
  title: 'Docente',
  teachers: [
    {
      id: 'teacher-1',
      name: 'Jorge Valerio Araoz',
      bio: 'Estudios de Maestría en Ingeniería Mecatrónica en la Pontificia Universidad Católica del Perú y Automática e Instrumentación en la Universidad Nacional de Ingeniería.',
      image: '/storage/media/autores/0bjF6j.jpg',
      imageAlt: 'Jorge Valerio Araoz',
      imageFocusX: 50,
      imageFocusY: 30,
      imageFocusProfiles: normalizeImageFocusProfiles(undefined, 50, 30),
      profileUrl: '',
      profileTarget: '',
    },
  ],
};

export const normalizeCourseFacultyData = (raw: any): CourseFacultyData => {
  const source = raw && typeof raw === 'object' ? raw : {};

  const teachers: CourseFacultyMember[] = Array.isArray(source.teachers)
    ? source.teachers.slice(0, COURSE_FACULTY_RULES.maxTeachers).map((t: any, i: number) => {
        const focusX = normalizeImageFocus(t?.imageFocusX);
        const focusY = normalizeImageFocus(t?.imageFocusY);
        return {
          id: typeof t?.id === 'string' && t.id ? t.id : `teacher-${i + 1}`,
          name: String(t?.name ?? '').slice(0, COURSE_FACULTY_RULES.name.maxLength),
          bio: String(t?.bio ?? '').slice(0, COURSE_FACULTY_RULES.bio.maxLength),
          image: typeof t?.image === 'string' ? t.image.trim() : '',
          imageAlt: typeof t?.imageAlt === 'string' ? t.imageAlt.trim() : '',
          imageFocusX: focusX,
          imageFocusY: focusY,
          imageFocusProfiles: normalizeImageFocusProfiles(t?.imageFocusProfiles, focusX, focusY),
          profileUrl: typeof t?.profileUrl === 'string' ? t.profileUrl.trim() : '',
          profileTarget: normalizeLinkTarget(t?.profileTarget),
        };
      })
    : DEFAULT_COURSE_FACULTY_DATA.teachers;

  return {
    title:
      typeof source.title === 'string'
        ? source.title.slice(0, COURSE_FACULTY_RULES.title.maxLength)
        : DEFAULT_COURSE_FACULTY_DATA.title,
    teachers,
  };
};
