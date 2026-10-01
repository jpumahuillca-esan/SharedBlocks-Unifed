import { computed, resolveComponent } from 'vue';

export function useDynamicLink(customComponent?: any) {
  const linkTag = computed(() => {
    if (customComponent) return customComponent;

    try {
      const nuxtLink = resolveComponent('NuxtLink');
      if (typeof nuxtLink !== 'string') return nuxtLink;
    } catch (_) {}

    try {
      const routerLink = resolveComponent('RouterLink');
      if (typeof routerLink !== 'string') return routerLink;
    } catch (_) {}

    return 'a';
  });

  const getLinkProps = (url: string | null | undefined, options?: { target?: string; rel?: string }) => {
    const finalUrl = url || '#';
    const common: Record<string, any> = {};
    if (options?.target) common.target = options.target;
    if (options?.rel) {
      common.rel = options.rel;
    } else if (options?.target === '_blank') {
      common.rel = 'noopener noreferrer';
    }

    const isExternal = /^(https?:)?\/\//i.test(finalUrl) || /^mailto:/i.test(finalUrl) || /^tel:/i.test(finalUrl);

    if (linkTag.value === 'a' || (isExternal && typeof linkTag.value !== 'string' && (linkTag.value as any)?.name !== 'NuxtLink')) {
      return { href: finalUrl, ...common };
    }

    return { to: finalUrl, ...common };
  };

  return {
    linkTag,
    getLinkProps,
  };
}