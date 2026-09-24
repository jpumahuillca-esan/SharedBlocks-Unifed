export type FieldType = 'text' | 'number' | 'tel' | 'email' | 'date' | 'textarea' | 'select';

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface DynamicFormField {
  name: string;          // Key enviada en payload (ej: "first_name", "document_number")
  label: string;         // Etiqueta UI visible
  type: FieldType;       // text, email, select, etc.
  placeholder?: string;
  required: boolean;
  col_span?: number;     // 6 (mitad de fila) o 12 (fila completa)
  options?: FormFieldOption[]; // Opciones si es tipo 'select'
}

export interface FormConfig {
  academic_unit_id?: number | null;
  campaign_id: number | null;
  study_program_id?: number | null;
  mainTitle?: string;
  subTitle?: string;
  button_text?: string;
  condition?: string;
  success_title?: string;
  success_message?: string;
  themeColor?: string;
  fields: DynamicFormField[];
  cod_form_old?: number | string;
}

export type ScreenAction = 'alert' | 'redirect' | 'download';

export interface LeadAutoresponderDirective {
  type: ScreenAction;
  title: string;
  message: string;
  redirect_url?: string | null;
  download_url?: string | null;
}

export interface PublicLeadPayload {
  academic_unit_id?: number | null;
  campaign_id: number | null;
  study_program_id?: number | null;
  first_name: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  last_name: string;
  email: string;
  phone?: string;
  slug_carrera?: string;
  recaptcha_token: string;
  document_type?: string;
  document_number?: string;
  payload: Record<string, any>;
  marketing_metadata?: Record<string, any>;
}

// Respuesta normalizada que entrega el servicio al formulario
export interface PublicLeadResponse {
  success: boolean;
  lead_id?: number;
  message: string;
  action: LeadAutoresponderDirective;
}