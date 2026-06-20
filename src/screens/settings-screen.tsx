import { useAuth } from "@/src/hooks/auth-context";
import { useTheme } from "@/src/hooks/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, Switch, View } from "react-native";
import { BodyText } from "../components/ui/BodyText";
import { Card } from "../components/ui/Card";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { SectionTitle } from "../components/ui/SectionTitle";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, theme, toggleTheme } = useTheme();
  const { logout, userEmail, userProfile } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const firstName = userProfile?.firstName || "Repartidor";
  const lastName = userProfile?.lastName || "";
  const initials = `${firstName.charAt(0)}${lastName ? lastName.charAt(0) : ""}`;

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

        <Card style={styles.cardSpacing}>
          <View style={styles.profileHeader}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff&rounded=true&size=128`,
              }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <BodyText
                style={[styles.heading, { color: colors.text, fontSize: 18 }]}
              >
                {firstName} {lastName}
              </BodyText>
              <BodyText style={[styles.accountText, { color: colors.primary }]}>
                {userEmail}
              </BodyText>
              <View style={styles.roleBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#0D8ABC" />
                <BodyText style={styles.roleText}>
                  Rol: {userProfile?.role || "RIDER"}
                </BodyText>
              </View>
            </View>
          </View>
        </Card>

        <Card style={styles.cardSpacing}>
          <View style={styles.cardTitleRow}>
            <Ionicons
              name="color-palette-outline"
              size={20}
              color={colors.text}
            />
            <BodyText
              style={[styles.heading, { color: colors.text, marginLeft: 8 }]}
            >
              Apariencia
            </BodyText>
          </View>

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
              style={{ transform: [{ scale: 1.2 }, { scaleY: 1.2 }] }}
            />
          </View>
        </Card>

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
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  cardSpacing: {
    marginBottom: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontWeight: "700",
    fontSize: 16,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#F3F4F6",
  },
  profileInfo: {
    flex: 1,
  },
  accountText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0D8ABC",
    marginLeft: 4,
  },

  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  description: {
    fontSize: 13,
  },

  logoutButton: {
    backgroundColor: "#EF4444",
    marginTop: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
