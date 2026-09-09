import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '/es';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) => {
    const translations: Record<string, string> = {
      'migrando.title': 'Migrando...',
      'migrando.matching': 'Buscando coincidencias',
      'migrando.done': 'Completado',
      'migrando.migrated': 'canciones migradas',
      'migrando.notFound': 'no encontradas',
      'playlists.title': 'Tus playlists',
      'playlists.select': 'Selecciona las que quieres migrar',
      'playlists.selected': 'seleccionadas',
      'playlists.selectAll': 'Seleccionar todo',
      'playlists.deselectAll': 'Quitar selección',
      'playlists.hide': 'Ocultar',
      'playlists.restore': 'Mostrar',
      'playlists.migrated': 'Migrada',
      'playlists.showHidden': 'Mostrar ocultas ({count})',
      'playlists.hideHidden': 'Ocultar las ocultas',
      'playlists.searchPlaceholder': 'Buscar por nombre o creador...',
      'playlists.searchAria': 'Buscar playlists',
      'playlists.noResults': 'Sin resultados para "{query}"',
    };
    let result = translations[key] || key;
    if (values) {
      Object.entries(values).forEach(([k, v]) => {
        result = result.replace(`{${k}}`, v);
      });
    }
    return result;
  },
}));

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    has: jest.fn(),
  }),
}));

// Global fetch mock
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock).mockReset();
});