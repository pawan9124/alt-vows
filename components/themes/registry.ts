// Theme Component Imports
import { VintageVinylTheme } from './vintage-vinyl';
import TheVoyagerThemePkg from './the-voyager';

// =============================================================================
// THEME REGISTRY
// Maps archetypeIds (from niches.json) to Theme Components
// =============================================================================

// The Menu of available themes - keyed by archetypeId
export const THEMES: Record<string, any> = {
  'vintage-vinyl': { component: VintageVinylTheme }, // Maintain backward compat structure if needed elsewhere
  'the-voyager': TheVoyagerThemePkg,
};

// Registry for Dynamic Page Controller (Components Only)
export const registry: Record<string, React.ComponentType<any>> = {
  'vintage-vinyl': VintageVinylTheme,
  // 'the-voyager': TheVoyagerThemePkg.component, // Uncomment when Voyager is ready for dynamic routing
};

// Helper to get the theme component by archetypeId
export const getThemeComponent = (archetypeId: string) => {
  const theme = THEMES[archetypeId];
  if (!theme) {
    console.warn(`Theme not found for archetypeId: ${archetypeId}`);
    return null;
  }
  return theme.component;
};

// Helper to get the theme config by archetypeId
export const getThemeConfig = (archetypeId: string) => {
  const theme = THEMES[archetypeId];
  if (!theme) {
    console.warn(`Config not found for archetypeId: ${archetypeId}`);
    return null;
  }
  return theme.config;
};

// Get list of all available archetypeIds
export const getAvailableArchetypes = () => {
  return Object.keys(THEMES);
};