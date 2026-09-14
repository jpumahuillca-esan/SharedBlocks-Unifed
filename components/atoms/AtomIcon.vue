<script setup lang="ts">
/**
 * AtomIcon — átomo de ícono (ARCIS Design System).
 *
 * webunificada estipula Lucide (https://lucide.dev/) como única librería de
 * íconos permitida (sección Foundations > Icons de ui-kit.html). Este átomo
 * resuelve un ícono de Lucide por nombre en formato con guiones (el mismo
 * formato que usa webunificada en data-lucide="nombre"), para poder elegirlo
 * dinámicamente por string, igual que hoy se hace con blockIcons[key] en el
 * registry, en vez de tener que importar cada ícono a mano en cada bloque.
 *
 * Usa @lucide/vue (el paquete vigente — lucide-vue-next quedó deprecado en
 * favor de este). Importa explícitamente solo los íconos declarados en
 * ICONS más abajo, en vez de un `import * as` de todo el paquete: así el
 * bundle final solo incluye los íconos que realmente se usan.
 *
 * IMPORTANTE: cualquier ícono nuevo que se necesite en un bloque hay que
 * agregarlo primero a ICONS aquí (import + entrada en el mapa) — si no está
 * en este mapa, AtomIcon no renderiza nada (ver comentario en <template>).
 *
 * Set base: los 24 íconos que webunificada documenta como muestra oficial
 * en Foundations > Icons, más los que van sumando otros Elementos a medida
 * que los necesitan de verdad (ej. Info/AlertTriangle/AlertCircle para
 * Alerts, ver data-lucide en ui-kit.html sección "ALERTS"). La migración
 * completa de los ~168 íconos que hoy usan los bloques (Line Awesome /
 * Bootstrap Icons) es un paso aparte, todavía no hecho.
 */
import { computed } from 'vue';
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Users,
  Globe,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  Star,
  Download,
  ExternalLink,
  Play,
  Info,
  AlertTriangle,
  AlertCircle,
  Link,
  ArrowUp,
  LayoutGrid,
  List,
  User,
  FileText,
  CreditCard,
  FileDown,
  TrendingUp,
  // Sumado por el CTA Band compacto (data-lucide en ui-kit.html, sección CTA BAND).
  HelpCircle,
} from '@lucide/vue';

const ICONS: Record<string, any> = {
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'briefcase': Briefcase,
  'award': Award,
  'users': Users,
  'globe': Globe,
  'calendar': Calendar,
  'clock': Clock,
  'map-pin': MapPin,
  'phone': Phone,
  'mail': Mail,
  'search': Search,
  'menu': Menu,
  'x': X,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'check': Check,
  'check-circle': CheckCircle,
  'star': Star,
  'download': Download,
  'external-link': ExternalLink,
  'play': Play,
  'info': Info,
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  'link': Link,
  'arrow-up': ArrowUp,
  'layout-grid': LayoutGrid,
  'list': List,
  'user': User,
  'file-text': FileText,
  'credit-card': CreditCard,
  'file-down': FileDown,
  'trending-up': TrendingUp,
  'help-circle': HelpCircle,
};

const props = withDefaults(defineProps<{
  /** Nombre del ícono en formato con guiones, ej. "graduation-cap". */
  name: string;
  size?: number;
  strokeWidth?: number;
  /** Por defecto hereda el color del texto (currentColor). */
  color?: string;
}>(), {
  size: 24,
  strokeWidth: 2,
  color: 'currentColor',
});

const resolvedIcon = computed(() => ICONS[props.name] ?? null);

if (import.meta.env?.DEV && !resolvedIcon.value) {
  // eslint-disable-next-line no-console
  console.warn(
    `[AtomIcon] "${props.name}" no está en el mapa ICONS de AtomIcon.vue. ` +
    `Agrégalo ahí (import + entrada) antes de usarlo.`
  );
}
</script>

<template>
  <component
    :is="resolvedIcon"
    v-if="resolvedIcon"
    :size="size"
    :stroke-width="strokeWidth"
    :color="color"
    class="atom-icon"
  />
</template>
