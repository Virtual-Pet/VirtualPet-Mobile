import { useAuth } from "@/src/auth-context";
import { useTheme } from "@/src/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { BodyText } from "../../src/components/BodyText";
import { Card } from "../../src/components/Card";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { SectionTitle } from "../../src/components/SectionTitle";

// MOCK: Esto vendrá de GET /api/v1/assignments?operator_id={userId}
const misAsignaciones = [
  {
    id: "1",
    orderRef: "#4092",
    address: "Las Heras 240",
    client: "Juan Pérez",
    status: "IN_PROGRESS",
    label: "En camino",
  },
  {
    id: "2",
    orderRef: "#4095",
    address: "San Martín 1234",
    client: "María Gómez",
    status: "ASSIGNED",
    label: "En tu baúl",
  },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  // const router = useRouter();
  const { status, userEmail } = useAuth();

  if (status !== "authenticated" && !__DEV__) return null;

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <SectionTitle
          title={`Hola, ${userEmail?.split("@")[0] ?? "repartidor"} 👋`}
          subtitle="Tenés 2 entregas asignadas para tu turno actual."
        />

        {misAsignaciones.length === 0 ? (
          <BodyText style={[styles.emptyText, { color: colors.muted }]}>
            No tenés pedidos asignados. Revisá la pestaña de Depósito.
          </BodyText>
        ) : (
          misAsignaciones.map((pedido) => (
            <TouchableOpacity
              key={pedido.id}
              activeOpacity={0.8}
              // onPress={() => router.push(`/pedido/${pedido.id}`)} // Futura pantalla de detalle
            >
              <Card style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <BodyText style={[styles.title, { color: colors.text }]}>
                    Pedido {pedido.orderRef}
                  </BodyText>

                  {/* Badge dinámico según el estado en la BD */}
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          pedido.status === "IN_PROGRESS"
                            ? "#FEF08A"
                            : "#DCFCE7",
                      },
                    ]}
                  >
                    <BodyText
                      style={[
                        styles.badgeText,
                        {
                          color:
                            pedido.status === "IN_PROGRESS"
                              ? "#854D0E"
                              : "#166534",
                        },
                      ]}
                    >
                      {pedido.label}
                    </BodyText>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={colors.muted}
                  />
                  <BodyText style={[styles.address, { color: colors.muted }]}>
                    {pedido.address}
                  </BodyText>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={colors.muted}
                  />
                  <BodyText style={[styles.client, { color: colors.muted }]}>
                    {pedido.client}
                  </BodyText>
                </View>

                <View style={styles.divider} />

                <BodyText
                  style={[styles.actionText, { color: colors.primary }]}
                >
                  Ver detalles y accionar →
                </BodyText>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 24,
  },
  cardContainer: {
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  address: {
    fontSize: 15,
    marginLeft: 6,
  },
  client: {
    fontSize: 14,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  actionText: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
});
