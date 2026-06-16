import * as LocalAuthentication from "expo-local-authentication";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { logout as logoutService } from "./services/auth-service";
import {
  clearCredentials,
  readCredentials,
  saveCredentials,
  type StoredCredentials,
} from "./storage";

type AuthStatus = "loading" | "none" | "locked" | "authenticated";

type AuthContextValue = {
  status: AuthStatus;
  userEmail: string | null;
  hasBiometrics: boolean;
  isReady: boolean;
  login: (values: Omit<StoredCredentials, "pin">) => Promise<void>;
  logout: () => Promise<void>;
  unlockApp: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const hardware = await LocalAuthentication.hasHardwareAsync();
        const enrolled =
          hardware && (await LocalAuthentication.isEnrolledAsync());
        setHasBiometrics(Boolean(enrolled));

        const stored = await readCredentials();
        if (stored?.email) {
          setUserEmail(stored.email);
          setStatus("locked");
        } else {
          setStatus("none");
        }
      } catch (error) {
        console.warn("Error inicializando autenticación:", error);
        setStatus("none");
      } finally {
        setIsReady(true);
      }
    }

    void initializeAuth();
  }, []);

  const login = async (values: StoredCredentials) => {
    await saveCredentials(values);
    setUserEmail(values.email);
    setStatus("authenticated");
  };

  const logout = async () => {
    try {
      const stored = await readCredentials();
      await logoutService(stored?.token, stored?.refreshToken);
    } catch (error) {
      console.warn("Error en logout remoto:", error);
    } finally {
      await clearCredentials();
      setUserEmail(null);
      setStatus("none");
    }
  };

  const unlockApp = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Desbloqueá Virtual Pet",
        cancelLabel: "Cancelar",
        disableDeviceFallback: false,
      });

      if (result.success) {
        setStatus("authenticated");
        return true;
      }
    } catch (error) {
      console.warn("Error en autenticación nativa:", error);
    }

    return false;
  };

  const value = useMemo(
    () => ({
      status,
      userEmail,
      hasBiometrics,
      isReady,
      login,
      logout,
      unlockApp,
    }),
    [status, userEmail, hasBiometrics, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
