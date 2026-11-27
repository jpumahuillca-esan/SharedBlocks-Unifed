<script setup lang="ts">
/**
 * AtomIcon — átomo de ícono (ARCIS Design System).
 *
 * Resuelve cualquier ícono de Lucide (@lucide/vue) por su nombre en kebab-case:
 *  - Los ~119 íconos más frecuentes se importan estáticamente para renderizado
 *    síncrono en SSR (sin parpadeo ni descarga adicional en el visitante).
 *  - Cualquier otro ícono de los ~1,800 disponibles en @lucide/vue se carga
 *    automáticamente bajo demanda mediante lucideDynamic.ts (incluyendo SSR).
 */
import { computed, defineAsyncComponent, type Component } from 'vue';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Atom,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Book,
  Bookmark,
  BookOpen,
  Brain,
  Briefcase,
  BriefcaseBusiness,
  Building,
  Building2,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Code2,
  Coins,
  Compass,
  Cpu,
  CreditCard,
  Crown,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileDown,
  FileText,
  Filter,
  Flag,
  Flame,
  Folder,
  Globe,
  Globe2,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  HeartHandshake,
  HelpCircle,
  Image,
  Info,
  Key,
  Landmark,
  Laptop,
  Layers,
  LayoutGrid,
  Leaf,
  Library,
  Lightbulb,
  Link,
  List,
  Lock,
  Mail,
  Map as LucideMap,
  MapPin,
  Megaphone,
  Menu,
  MessageCircle,
  Mic,
  Microscope,
  Minus,
  Monitor,
  Newspaper,
  NotebookPen,
  Pencil,
  Percent,
  Phone,
  PhoneCall,
  PieChart,
  Play,
  PlayCircle,
  Plus,
  Presentation,
  Rocket,
  Scale,
  School,
  Search,
  Send,
  Settings,
  Share2,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Stethoscope,
  Tablet,
  Target,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Trophy,
  University,
  Unlock,
  User,
  UserCheck,
  UserPlus,
  Users,
  UsersRound,
  Video,
  Wallet,
  Wifi,
  Wrench,
  X,
  Zap,
} from '@lucide/vue';
import {
  ensureLucideLibraryLoaded,
  getDynamicLucideIcon,
  isLucideLibraryLoaded,
} from '../../helpers/lucideDynamic';

const ICONS: Record<string, any> = {
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'book': Book,
  'library': Library,
  'school': School,
  'university': University,
  'briefcase': Briefcase,
  'briefcase-business': BriefcaseBusiness,
  'award': Award,
  'badge-check': BadgeCheck,
  'trophy': Trophy,
  'notebook-pen': NotebookPen,
  'presentation': Presentation,
  'brain': Brain,
  'atom': Atom,
  'microscope': Microscope,
  'stethoscope': Stethoscope,
  'scale': Scale,
  'bookmark': Bookmark,
  'users': Users,
  'users-round': UsersRound,
  'user': User,
  'user-check': UserCheck,
  'user-plus': UserPlus,
  'heart-handshake': HeartHandshake,
  'globe': Globe,
  'globe-2': Globe2,
  'calendar': Calendar,
  'clock': Clock,
  'map-pin': MapPin,
  'map': LucideMap,
  'phone': Phone,
  'phone-call': PhoneCall,
  'mail': Mail,
  'message-circle': MessageCircle,
  'send': Send,
  'share-2': Share2,
  'megaphone': Megaphone,
  'newspaper': Newspaper,
  'video': Video,
  'headphones': Headphones,
  'mic': Mic,
  'camera': Camera,
  'image': Image,
  'bell': Bell,
  'search': Search,
  'filter': Filter,
  'menu': Menu,
  'x': X,
  'plus': Plus,
  'minus': Minus,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  'arrow-up': ArrowUp,
  'check': Check,
  'check-circle': CheckCircle,
  'check-square': CheckSquare,
  'star': Star,
  'heart': Heart,
  'thumbs-up': ThumbsUp,
  'shield': Shield,
  'shield-check': ShieldCheck,
  'lock': Lock,
  'unlock': Unlock,
  'key': Key,
  'eye': Eye,
  'flag': Flag,
  'flame': Flame,
  'crown': Crown,
  'target': Target,
  'rocket': Rocket,
  'compass': Compass,
  'layers': Layers,
  'sparkles': Sparkles,
  'zap': Zap,
  'download': Download,
  'external-link': ExternalLink,
  'play': Play,
  'play-circle': PlayCircle,
  'info': Info,
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  'link': Link,
  'layout-grid': LayoutGrid,
  'list': List,
  'file-text': FileText,
  'file-check': FileCheck,
  'file-down': FileDown,
  'folder': Folder,
  'credit-card': CreditCard,
  'coins': Coins,
  'wallet': Wallet,
  'percent': Percent,
  'trending-up': TrendingUp,
  'bar-chart-3': BarChart3,
  'pie-chart': PieChart,
  'help-circle': HelpCircle,
  'cpu': Cpu,
  'laptop': Laptop,
  'monitor': Monitor,
  'smartphone': Smartphone,
  'tablet': Tablet,
  'code-2': Code2,
  'database': Database,
  'cloud': Cloud,
  'wifi': Wifi,
  'sliders-horizontal': SlidersHorizontal,
  'wrench': Wrench,
  'settings': Settings,
  'pencil': Pencil,
  'trash-2': Trash2,
  'leaf': Leaf,
  'handshake': Handshake,
  'lightbulb': Lightbulb,
  'building': Building,
  'building-2': Building2,
  'landmark': Landmark,
};

const props = withDefaults(defineProps<{
  /** Nombre del ícono en formato kebab-case, ej. "graduation-cap". */
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

const cleanName = computed(() => (props.name || '').trim().toLowerCase());

const dynamicComponentCache = new Map<string, Component>();

const getAsyncFallbackIcon = (key: string): Component => {
  let cached = dynamicComponentCache.get(key);
  if (!cached) {
    cached = defineAsyncComponent(async () => {
      try {
        await ensureLucideLibraryLoaded();
        const resolved = getDynamicLucideIcon(key);
        if (!resolved && import.meta.env?.DEV) {
          // eslint-disable-next-line no-console
          console.warn(`[AtomIcon] "${key}" no existe en @lucide/vue.`);
        }
        return resolved ?? { render: () => null };
      } catch {
        return { render: () => null };
      }
    });
    dynamicComponentCache.set(key, cached);
  }
  return cached;
};

const resolvedIcon = computed(() => {
  const key = cleanName.value;
  if (!key) return null;
  if (ICONS[key]) return ICONS[key];
  // Si el catálogo completo ya cargó en memoria, resuelve síncrono; si no, usa componente async (seguro en SSR/hidratación).
  return getDynamicLucideIcon(key) ?? getAsyncFallbackIcon(key);
});
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
