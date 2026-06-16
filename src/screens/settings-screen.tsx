import { useAuth } from "@/src/auth-context";
import { useTheme } from "@/src/theme-context";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Switch, View } from "react-native";
import { BodyText } from "../components/BodyText";
import { Card } from "../components/Card";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenWrapper } from "../components/ScreenWrapper";
import { SectionTitle } from "../components/SectionTitle";

// Podés reemplazar esto por datos dinámicos del backend más adelante
const deliveryInfo = [
  { label: "Zona de reparto", value: "Mar del Plata - Centro" }, 
  { label: "Puntos activos", value: "18 comercios" },
  { label: "Tiempo estimado", value: "35 min promedio" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const { logout, userEmail } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <ScreenWrapper>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionTitle 
          title="Mi Perfil" 
          subtitle="Gestioná tu cuenta y preferencias de la aplicación." 
        />

        {/* 1. Tarjeta de Cuenta con Avatar */}
        <Card style={styles.cardSpacing}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${userEmail?.charAt(0) || 'R'}&background=0D8ABC&color=fff&rounded=true&size=128` }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <BodyText style={[styles.heading, { color: colors.text }]}>
                Cuenta de Repartidor
              </BodyText>
              <BodyText style={[styles.accountText, { color: colors.primary }]}>
                {userEmail}
              </BodyText>
              <BodyText style={[styles.description, { color: colors.muted }]}>
                Autenticación biométrica activada
              </BodyText>
            </View>
          </View>
        </Card>

        {/* 2. Tarjeta de Preferencias (Tema) */}
        <Card style={styles.cardSpacing}>
          <BodyText style={[styles.heading, { color: colors.text }]}>Preferencias</BodyText>
          <View style={styles.themeRow}>
            <View style={styles.themeTextContainer}>
              <BodyText style={[styles.themeTitle, { color: colors.text }]}>
                {theme === "dark" ? "Modo Oscuro" : "Modo Claro"}
              </BodyText>
              <BodyText style={[styles.description, { color: colors.muted }]}>
                Ajustá la interfaz para cuidar tu vista.
              </BodyText>
            </View>
            <Switch
              value={theme === "dark"}
              onValueChange={toggleTheme}
              thumbColor={theme === "dark" ? colors.primary : "#f4f3f4"}
              trackColor={{ false: "#d1fae5", true: "#166534" }}
            />
          </View>
        </Card>

        {/* 3. Tarjeta de Estadísticas de Delivery */}
        <Card style={styles.cardSpacing}>
          <BodyText style={[styles.heading, { color: colors.text, marginBottom: 16 }]}>
            Datos del turno actual
          </BodyText>
          
          <View style={styles.statsContainer}>
            {deliveryInfo.map((item, index) => (
              <View 
                key={item.label} 
                style={[
                  styles.deliveryRow, 
                  // Agregamos un borde separador sutil, excepto al último elemento
                  index !== deliveryInfo.length - 1 && { 
                    borderBottomWidth: 1, 
                    borderBottomColor: theme === 'dark' ? '#334155' : '#E5E7EB' 
                  }
                ]}
              >
                <BodyText style={[styles.label, { color: colors.muted }]}>{item.label}</BodyText>
                <BodyText style={[styles.value, { color: colors.text }]}>{item.value}</BodyText>
              </View>
            ))}
          </View>
        </Card>

        {/* Botón de Logout destructivo */}
        <PrimaryButton 
          label="Cerrar sesión" 
          onPress={handleLogout} 
          style={styles.logoutButton} 
          textStyle={styles.logoutText} 
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40, 
  },
  cardSpacing: {
    marginBottom: 24,
  },
  heading: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  accountText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
  },

  // Estilos del tema
  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  themeTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  themeTitle: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 2,
  },
  statsContainer: {
    backgroundColor: 'transparent',
  },
  deliveryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontWeight: "600",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    marginTop: 8,
  },
  logoutText: {
    color: "#FFFFFF",
  },
});