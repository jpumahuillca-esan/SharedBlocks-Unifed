export const ECOSYSTEM_ESAN_CONTENT_RULES = {
  eyebrow: {
    maxLength: 40,
  },

  title: {
    maxLength: 60,
  },

  desc: {
    maxLength: 150,
  },

  card: {
    title: {
      maxLength: 40,
    },

    desc: {
      maxLength: 45,
    },

    imageAlt: {
      maxLength: 150,
    },

    href: {
      maxLength: 500,
    },
  },

  link: {
    label: {
      maxLength: 80,
    },

    href: {
      maxLength: 500,
    },
  },
} as const;