import * as SecureStore from "expo-secure-store";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { ThemeMode, themeColors } from "../theme";

const THEME_KEY = "vp_delivery_theme";

type ThemeContextValue = {
  theme: ThemeMode;
  colors: typeof themeColors.light;
  setTheme: (nextTheme: ThemeMode) => void;
  toggleTheme: () => void;
  loaded: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("light");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      try {
        const storedTheme = await SecureStore.getItemAsync(THEME_KEY);
        if (storedTheme === "dark" || storedTheme === "light") {
          setThemeState(storedTheme);
        }
      } catch (error) {
        console.warn("No se pudo cargar el tema:", error);
      } finally {
        setLoaded(true);
      }
    }

    void loadTheme();
  }, []);

  const setTheme = async (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    try {
      await SecureStore.setItemAsync(THEME_KEY, nextTheme);
    } catch (error) {
      console.warn("No se pudo guardar el tema:", error);
    }
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const value = useMemo(
    () => ({
      theme,
      colors: themeColors[theme],
      setTheme,
      toggleTheme,
      loaded,
    }),
    [theme, loaded],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return context;
}
