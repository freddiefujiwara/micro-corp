import { onMounted, ref } from 'vue';

const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const THEME_KEY = 'theme';

const setDocumentTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

export const useAppTheme = () => {
  const theme = ref(DARK_THEME);

  const toggleTheme = () => {
    theme.value = theme.value === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    localStorage.setItem(THEME_KEY, theme.value);
    setDocumentTheme(theme.value);
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const preferredLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    theme.value = savedTheme ?? (preferredLight ? LIGHT_THEME : DARK_THEME);
    setDocumentTheme(theme.value);
  });

  return {
    theme,
    toggleTheme,
  };
};
