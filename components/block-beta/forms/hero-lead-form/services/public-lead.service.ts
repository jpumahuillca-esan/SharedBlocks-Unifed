import type { PublicLeadPayload, PublicLeadResponse } from '../types/lead.types';

export class PublicLeadService {
  static async submit(
    data: PublicLeadPayload,
    academicUnitSlugOrId: string | number,
    apiBase: string = ''
  ): Promise<PublicLeadResponse> {
    // 1. Si no viene apiBase, resolver la URL del backend de Laravel
    let base = apiBase;
    if (!base) {
      if (typeof window !== 'undefined') {
        base = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://127.0.0.1:8000'
          : '';
      } else {
        base = 'http://127.0.0.1:8000';
      }
    }

    const cleanBase = base.replace(/\/+$/, '');
    const endpoint = cleanBase.endsWith('/api') 
      ? `${cleanBase}/public/leads` 
      : `${cleanBase}/api/public/leads`;


    const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Academic-Unit': String(data.academic_unit_id || academicUnitSlugOrId),
    'IdentifyAcademicUnit': String(data.academic_unit_id || academicUnitSlugOrId),
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.message || `Error HTTP ${res.status}`);
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