import { useAuth } from "@/src/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenWrapper } from "../components/ScreenWrapper";
import { SectionTitle } from "../components/SectionTitle";

export default function UnlockScreen() {
  const router = useRouter();  
  const { status, unlockApp, isReady } = useAuth(); 
  const [error, setError] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (status === "authenticated") {
      router.replace("/home");
    }
    if (status === "none") {
      router.replace("/login");
    }
  }, [status, isReady, router]);

  useEffect(() => {
    if (status === "locked" && !isPrompting) {
      handleNativeAuth();
    }
  }, [status]);

  const handleNativeAuth = async () => {
    setError("");
    setIsPrompting(true);

    const success = await unlockApp();
    
    if (!success) {
      setError("Autenticación cancelada. Por favor, verificá tu identidad para continuar.");
      setIsPrompting(false);
      return;
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: "https://ui-avatars.com/api/?name=%F0%9F%94%92&background=F3F4F6&color=0D8ABC&rounded=true&size=128" }}
            style={styles.icon}
          />
          <SectionTitle 
            title="App Bloqueada" 
            subtitle="Por seguridad, verificá tu identidad." 
          />
        </View>

        <View style={styles.formContainer}>
          <Card style={styles.cardStyle}>
            
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Usá tu huella, rostro o el PIN de tu celular para acceder a tus pedidos.
              </Text>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorLabel}>{error}</Text>
              </View>
            ) : null}

            {/* Este botón solo se usa si el usuario canceló el prompt automático y quiere reintentar */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                label="Desbloquear Virtual Pet"
                onPress={handleNativeAuth}
                disabled={isPrompting}
              />
            </View>

          </Card>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 32,
    paddingTop: 40,
  },
  icon: {
    width: 72,
    height: 72,
    marginBottom: 16,
    borderRadius: 36,
  },
  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  cardStyle: {
    padding: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  infoContainer: {
    marginBottom: 24,
  },
  infoText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 15,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 8,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorLabel: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});