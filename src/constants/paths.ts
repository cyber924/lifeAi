export const PATHS = {
  // Layout
  LAYOUT: {
    ROOT: '/',
    DASHBOARD: '/dashboard',
  },
  
  // Components
  COMPONENTS: {
    LAYOUT: {
      HEADER: '@/components/layout/Header',
      BOTTOM_NAV: '@/components/layout/BottomNavigation',
    },
  },
  
  // Assets
  ASSETS: {
    STYLES: {
      GLOBAL: '@/app/globals.css',
    },
  },
} as const;
