/**
 * Contrato de datos y normalizador para `CertificationPrograms`
 * (Acordeones numerados 01/02 de Certificaciones y Preparación CFA + Formas de pago PowerPay + Notas legales).
 *
 * Figma ESAN-University-v2:
 *   - Certificaciones: 3262:5701 (1366) | 3552:14982 (768) | 3543:39895 (360)
 *   - CFA Nivel I y II: 3262:17330 (1366) | 3552:14987 (768) | 3543:40738 (360)
 */
import { normalizeLinkTarget, type LinkTarget } from '../../../../helpers/linkTarget';
import {
  resolveBundledImageFallback,
  stripBundledAssetForStorage,
} from '../../../../helpers/bundledAssets';
import powerPayLogoDefault from '../../../../assets/images/logos/logo-powerpay.svg';

export type CertificationInfoValueStyle = 'auto' | 'display' | 'body' | 'bullets';
export type CertificationCalendarVariant = 'link' | 'outline';

export interface CertificationBulletSection {
  id: string;
  title: string;
  items: string[];
}

export interface CertificationInfoRow {
  id: string;
  label: string;
  value: string;
  valueStyle: CertificationInfoValueStyle;
}

export interface CertificationProgramItem {
  id: string;
  number: string;
  title: string;
  defaultOpen: boolean;
  description: string;
  methodologyTitle: string;
  methodologyText: string;
  calendarLabel: string;
  calendarUrl: string;
  calendarTarget: LinkTarget;
  calendarVariant: CertificationCalendarVariant;
  secondaryActionLabel: string;
  secondaryActionUrl: string;
  secondaryActionTarget: LinkTarget;
  bulletSections: CertificationBulletSection[];
  infoTitle: string;
  infoRows: CertificationInfoRow[];
}

export interface CertificationProgramsData {
  eyebrow: string;
  title: string;
  programs: CertificationProgramItem[];
  showPaymentMethods: boolean;
  paymentLabel: string;
  paymentText: string;
  paymentLogo: string;
  paymentLogoAlt: string;
  footnotes: string;
}

export const CERTIFICATION_PROGRAMS_RULES = {
  eyebrow: { maxLength: 80 },
  title: { maxLength: 140 },
  program: {
    number: { maxLength: 8 },
    title: { maxLength: 180 },
    description: { maxLength: 2400 },
    methodologyTitle: { maxLength: 80 },
    methodologyText: { maxLength: 1200 },
    actionLabel: { maxLength: 80 },
    sectionTitle: { maxLength: 100 },
    infoTitle: { maxLength: 80 },
    rowLabel: { maxLength: 80 },
    rowValue: { maxLength: 500 },
  },
  paymentLabel: { maxLength: 60 },
  paymentText: { maxLength: 200 },
  paymentLogoAlt: { maxLength: 80 },
  footnotes: { maxLength: 2000 },
  maxPrograms: 12,
  maxBulletSections: 4,
  maxInfoRows: 12,
} as const;

export const POWERPAY_DEFAULT_LOGO = powerPayLogoDefault;

const uid = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const normalizeBulletItems = (rawItems: unknown): string[] => {
  if (typeof rawItems === 'string') {
    return rawItems
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .map((entry) => {
      if (typeof entry === 'string') return entry.trim();
      if (entry && typeof entry === 'object' && typeof (entry as any).text === 'string') {
        return (entry as any).text.trim();
      }
      return '';
    })
    .filter(Boolean);
};

export const normalizeCertificationInfoRow = (raw: any, index = 0): CertificationInfoRow => {
  const vs = raw?.valueStyle;
  const valueStyle: CertificationInfoValueStyle =
    vs === 'display' || vs === 'body' || vs === 'bullets' ? vs : 'auto';
  return {
    id: typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : `cert-row-${index + 1}`,
    label:
      typeof raw?.label === 'string'
        ? raw.label.slice(0, CERTIFICATION_PROGRAMS_RULES.program.rowLabel.maxLength)
        : '',
    value:
      typeof raw?.value === 'string'
        ? raw.value.slice(0, CERTIFICATION_PROGRAMS_RULES.program.rowValue.maxLength)
        : '',
    valueStyle,
  };
};

export const normalizeCertificationBulletSection = (raw: any, index = 0): CertificationBulletSection => ({
  id: typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : `cert-sec-${index + 1}`,
  title:
    typeof raw?.title === 'string'
      ? raw.title.slice(0, CERTIFICATION_PROGRAMS_RULES.program.sectionTitle.maxLength)
      : '',
  items: normalizeBulletItems(raw?.items),
});

export const normalizeCertificationProgramItem = (raw: any, index = 0): CertificationProgramItem => ({
  id: typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : `cert-prog-${index + 1}`,
  number:
    typeof raw?.number === 'string'
      ? raw.number.slice(0, CERTIFICATION_PROGRAMS_RULES.program.number.maxLength)
      : String(index + 1).padStart(2, '0'),
  title:
    typeof raw?.title === 'string'
      ? raw.title.slice(0, CERTIFICATION_PROGRAMS_RULES.program.title.maxLength)
      : '',
  defaultOpen: raw?.defaultOpen === true || (raw?.defaultOpen === undefined && index === 0),
  description:
    typeof raw?.description === 'string'
      ? raw.description.slice(0, CERTIFICATION_PROGRAMS_RULES.program.description.maxLength)
      : '',
  methodologyTitle:
    typeof raw?.methodologyTitle === 'string'
      ? raw.methodologyTitle.slice(0, CERTIFICATION_PROGRAMS_RULES.program.methodologyTitle.maxLength)
      : '',
  methodologyText:
    typeof raw?.methodologyText === 'string'
      ? raw.methodologyText.slice(0, CERTIFICATION_PROGRAMS_RULES.program.methodologyText.maxLength)
      : '',
  calendarLabel:
    typeof raw?.calendarLabel === 'string'
      ? raw.calendarLabel.slice(0, CERTIFICATION_PROGRAMS_RULES.program.actionLabel.maxLength)
      : '',
  calendarUrl: typeof raw?.calendarUrl === 'string' ? raw.calendarUrl.trim() : '',
  calendarTarget: normalizeLinkTarget(raw?.calendarTarget),
  calendarVariant: raw?.calendarVariant === 'outline' ? 'outline' : 'link',
  secondaryActionLabel:
    typeof raw?.secondaryActionLabel === 'string'
      ? raw.secondaryActionLabel.slice(0, CERTIFICATION_PROGRAMS_RULES.program.actionLabel.maxLength)
      : '',
  secondaryActionUrl: typeof raw?.secondaryActionUrl === 'string' ? raw.secondaryActionUrl.trim() : '',
  secondaryActionTarget: normalizeLinkTarget(raw?.secondaryActionTarget),
  bulletSections: Array.isArray(raw?.bulletSections)
    ? raw.bulletSections
        .slice(0, CERTIFICATION_PROGRAMS_RULES.maxBulletSections)
        .map(normalizeCertificationBulletSection)
    : [],
  infoTitle:
    typeof raw?.infoTitle === 'string'
      ? raw.infoTitle.slice(0, CERTIFICATION_PROGRAMS_RULES.program.infoTitle.maxLength)
      : 'Información general',
  infoRows: Array.isArray(raw?.infoRows)
    ? raw.infoRows
        .slice(0, CERTIFICATION_PROGRAMS_RULES.maxInfoRows)
        .map(normalizeCertificationInfoRow)
    : [],
});

export const createEmptyCertificationProgram = (index = 0): CertificationProgramItem => ({
  id: uid('cert-prog'),
  number: String(index + 1).padStart(2, '0'),
  title: 'Nueva Certificación',
  defaultOpen: index === 0,
  description: '',
  methodologyTitle: 'Metodología',
  methodologyText: '',
  calendarLabel: 'Ver calendario de clases',
  calendarUrl: '',
  calendarTarget: '',
  calendarVariant: 'link',
  secondaryActionLabel: '',
  secondaryActionUrl: '',
  secondaryActionTarget: '',
  bulletSections: [
    {
      id: uid('cert-sec'),
      title: 'Objetivos de aprendizaje',
      items: ['Objetivo principal de aprendizaje'],
    },
  ],
  infoTitle: 'Información general',
  infoRows: [
    { id: uid('cert-row'), label: 'Modalidad:', value: 'Virtual', valueStyle: 'auto' },
    { id: uid('cert-row'), label: 'Inversión:', value: 'S/. 1,335.00', valueStyle: 'auto' },
  ],
});

export const normalizeCertificationProgramsData = (raw: any): CertificationProgramsData => {
  const source = raw && typeof raw === 'object' ? raw : {};

  return {
    eyebrow:
      typeof source.eyebrow === 'string'
        ? source.eyebrow.slice(0, CERTIFICATION_PROGRAMS_RULES.eyebrow.maxLength)
        : '',
    title:
      typeof source.title === 'string'
        ? source.title.slice(0, CERTIFICATION_PROGRAMS_RULES.title.maxLength)
        : 'Certificaciones disponibles:',
    programs: Array.isArray(source.programs)
      ? source.programs
          .slice(0, CERTIFICATION_PROGRAMS_RULES.maxPrograms)
          .map(normalizeCertificationProgramItem)
      : [],
    showPaymentMethods: source.showPaymentMethods !== false,
    paymentLabel:
      typeof source.paymentLabel === 'string'
        ? source.paymentLabel.slice(0, CERTIFICATION_PROGRAMS_RULES.paymentLabel.maxLength)
        : 'Formas de pago:',
    paymentText:
      typeof source.paymentText === 'string'
        ? source.paymentText.slice(0, CERTIFICATION_PROGRAMS_RULES.paymentText.maxLength)
        : 'Realiza tu pago con Power Pay en 3 cuotas sin intereses',
    paymentLogo: stripBundledAssetForStorage(source.paymentLogo, [POWERPAY_DEFAULT_LOGO]),
    paymentLogoAlt:
      typeof source.paymentLogoAlt === 'string'
        ? source.paymentLogoAlt.slice(0, CERTIFICATION_PROGRAMS_RULES.paymentLogoAlt.maxLength)
        : 'PowerPay',
    footnotes:
      typeof source.footnotes === 'string'
        ? source.footnotes.slice(0, CERTIFICATION_PROGRAMS_RULES.footnotes.maxLength)
        : '',
  };
};

/** Resuelve el logo PowerPay para render público sin guardar URLs con hash en BD. */
export const resolvePaymentLogoUrl = (rawUrl: unknown): string =>
  resolveBundledImageFallback(rawUrl, POWERPAY_DEFAULT_LOGO, {
    'logo-powerpay': POWERPAY_DEFAULT_LOGO,
  });

/** Determina si una fila de Información General debe mostrarse como lista con viñetas. */
export const parseInfoBulletLines = (value: string, style: CertificationInfoValueStyle): string[] => {
  const lines = value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const hasExplicitBullets = lines.some((l) => /^[-*•]\s+/.test(l));
  if (style === 'bullets' || (style === 'auto' && hasExplicitBullets)) {
    return lines.map((l) => l.replace(/^[-*•]\s+/, '').trim()).filter(Boolean);
  }
  return [];
};
