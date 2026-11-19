import type { PublicLeadPayload, PublicLeadResponse } from '../types/lead.types';

const resolveDefaultLaravelBase = (explicitBase = ''): string => {
  if (explicitBase) return explicitBase;

  if (typeof window !== 'undefined') {
    const nuxtLaravel = (window as any).__NUXT__?.config?.public?.laravelApiUrl;
    if (typeof nuxtLaravel === 'string' && nuxtLaravel.trim()) {
      return nuxtLaravel.trim();
    }
  }

  const viteApiUrl = (import.meta as any)?.env?.VITE_API_URL;
  if (typeof viteApiUrl === 'string' && viteApiUrl.trim()) {
    return viteApiUrl.trim();
  }

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://127.0.0.1:8000';
    }
    return '';
  }

  return 'http://127.0.0.1:8000';
};

export class PublicLeadService {
  static async submit(
    data: PublicLeadPayload,
    academicUnitSlugOrId: string | number,
    apiBase: string = ''
  ): Promise<PublicLeadResponse> {
    const base = resolveDefaultLaravelBase(apiBase);
    const cleanBase = base.replace(/\/+$/, '');
    const endpoint = cleanBase.endsWith('/api')
      ? `${cleanBase}/public/leads`
      : `${cleanBase}/api/public/leads`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Academic-Unit': String(data.academic_unit_id || academicUnitSlugOrId),
      IdentifyAcademicUnit: String(data.academic_unit_id || academicUnitSlugOrId),
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const rawText = await res.text();
    let json: any = {};
    if (rawText) {
      try {
        json = JSON.parse(rawText);
      } catch {
        json = {};
      }
    }

    if (!res.ok) {
      throw new Error(json?.message || `Error HTTP ${res.status}`);
    }

    return {
      success: json.status === 'success' || res.ok,
      lead_id: json.lead_id,
      message: json.message || 'Registro completado exitosamente.',
      action: {
        type: json.action || 'alert',
        title: json.title || '¡Registro completado!',
        message: json.message || 'Gracias por contactar a la Universidad ESAN.',
        redirect_url: json.redirect_url || null,
        download_url: json.download_url || null,
      },
    };
  }
}
