import { useAuth } from "@/src/auth-context";
import {
  login as loginService,
  type LoginCredentials,
} from "@/src/services/auth-service";
import { isValidEmail } from "@/src/utils/validation";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Card } from "../components/Card";
import { InputField } from "../components/InputField";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenWrapper } from "../components/ScreenWrapper";
import { SectionTitle } from "../components/SectionTitle";

export default function LoginScreen() {
  const router = useRouter();
  const { status, login, isReady } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (status === "authenticated") {
      router.replace("/home");
    }
    if (status === "locked") {
      router.replace("/unlock");
    }
  }, [status, isReady, router]);

  const handleSubmit = async () => {
    if (!isValidEmail(email) || password.length < 4) {
      setError("Ingresá un email válido y una contraseña correcta.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = {
        email: email.trim(),
        password,
      };

      const authData = await loginService(credentials);

      await login({
        email: email.trim(),
        token: authData.accessToken,
        refreshToken: authData.refreshToken,
        userId: authData.userId,
      });
    } catch {
      setError("Credenciales incorrectas o error de red. Intentá de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flexFill}
        >
          {/* Header con Logo y Título */}
          <View style={styles.headerContainer}>
            <Image
              // CAmbiar logoo
              source={{
                uri: "https://ui-avatars.com/api/?name=VP&background=0D8ABC&color=fff&rounded=true&size=128",
              }}
              style={styles.logo}
            />
            <SectionTitle
              title="Virtual Pet"
              subtitle="Portal de Repartidores"
            />
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            <Card style={styles.cardStyle}>
              <InputField
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError("");
                }}
                placeholder="rider@virtualpet.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <InputField
                label="Contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError("");
                }}
                placeholder="••••••••"
                isPassword={true}
                autoCapitalize="none"
              />

              {/* Mensaje de error con mejor UI */}
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorLabel}>{error}</Text>
                </View>
              ) : null}

              <View style={styles.buttonContainer}>
                <PrimaryButton
                  label={isLoading ? "Verificando..." : "Iniciar sesión"}
                  onPress={handleSubmit}
                  disabled={isLoading}
                />
              </View>

              {/* Botón secundario para recuperar clave */}
              {/* <TouchableOpacity style={styles.forgotPasswordButton}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity> */}
            </Card>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  flexFill: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContainer: {
    flex: 0.8,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 32,
    paddingTop: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 20,
  },
  formContainer: {
    flex: 1.2,
  },
  cardStyle: {
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorLabel: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 8,
  },
  forgotPasswordButton: {
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
});
