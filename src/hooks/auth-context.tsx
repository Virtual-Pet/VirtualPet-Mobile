import * as LocalAuthentication from "expo-local-authentication";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { logout as logoutService } from "../services/auth-service";
import {
    clearCredentials,
    readCredentials,
    saveCredentials,
    type StoredCredentials,
} from "../storage";

type AuthStatus = "loading" | "none" | "locked" | "authenticated";

type AuthContextValue = {
  status: AuthStatus;
  userEmail: string | null;
  userProfile: UserProfile | null;
  token: string | null;
  hasBiometrics: boolean;
  isReady: boolean;
  login: (values: Omit<StoredCredentials, "pin">) => Promise<void>;
  logout: () => Promise<void>;
  unlockApp: () => Promise<boolean>;
};

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasBiometrics, setHasBiometrics] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.warn("No se pudo obtener el perfil del usuario", error);
    }
  };

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
          setToken(stored.token ?? null);
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
    setToken(values.token ?? null);

    if (values.token) {
      await fetchUserProfile(values.token);
    }
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
      setUserProfile(null);
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
        const stored = await readCredentials();
        if (stored?.token) {
          await fetchUserProfile(stored.token);
        }
        setToken(stored?.token ?? null);
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
      token,
      userProfile,
      hasBiometrics,
      isReady,
      login,
      logout,
      unlockApp,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [status, userEmail, token, userProfile, hasBiometrics, isReady],
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
