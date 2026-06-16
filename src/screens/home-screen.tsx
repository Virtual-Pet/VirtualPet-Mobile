import { useAuth } from "@/src/hooks/auth-context";
import { useTheme } from "@/src/hooks/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BodyText } from "../../src/components/BodyText";
import { Card } from "../../src/components/Card";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { SectionTitle } from "../../src/components/SectionTitle";
import { getMyShipments, type Shipment } from "../services/shipment-service";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { status, userProfile, token } = useAuth();

  const [misAsignaciones, setMisAsignaciones] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMyShipments = async () => {
    if (!token || !userProfile?.id) return;
    try {
      const data = await getMyShipments(token, userProfile.id);
      setMisAsignaciones(data);
    } catch (error) {
      console.error("Error trayendo mis pedidos:", error);
    }
  };

  // Carga inicial
  useEffect(() => {
    if (status === "authenticated") {
      loadMyShipments().finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, userProfile?.id, status]);

  // Recarga al deslizar hacia abajo
  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyShipments();
    setRefreshing(false);
  };

  if (status !== "authenticated") return null;

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <BodyText style={[styles.loadingText, { color: colors.muted }]}>
            Cargando tu hoja de ruta...
          </BodyText>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        <SectionTitle
          title={`Hola, ${userProfile?.firstName} 👋`}
          subtitle={`Tenés ${misAsignaciones.length} entregas en curso para tu turno actual.`}
        />

        {misAsignaciones.length === 0 ? (
          <BodyText style={[styles.emptyText, { color: colors.muted }]}>
            No tenés pedidos asignados. Revisá la pestaña de Depósito para tomar
            nuevos viajes.
          </BodyText>
        ) : (
          misAsignaciones.map((pedido) => {
            const shortOrderRef = pedido.orderId.substring(0, 8);

            const isDeliveryInProgress = pedido.status === "IN_PROGRESS";
            const badgeBg = isDeliveryInProgress ? "#FEF08A" : "#DCFCE7";
            const badgeTextColor = isDeliveryInProgress ? "#854D0E" : "#166534";
            const badgeLabel = isDeliveryInProgress
              ? "En camino"
              : "En tu baúl";

            return (
              <TouchableOpacity
                key={pedido.shipmentId}
                activeOpacity={0.8}
                // onPress={() => router.push(`/pedido/${pedido.shipmentId}`)}
              >
                <Card style={styles.cardContainer}>
                  <View style={styles.cardHeader}>
                    <BodyText style={[styles.title, { color: colors.text }]}>
                      Pedido #{shortOrderRef}
                    </BodyText>

                    <View style={[styles.badge, { backgroundColor: badgeBg }]}>
                      <BodyText
                        style={[styles.badgeText, { color: badgeTextColor }]}
                      >
                        {badgeLabel}
                      </BodyText>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color={colors.muted}
                    />
                    {/* Concatenamos la dirección para que sea bien específica */}
                    <BodyText style={[styles.address, { color: colors.muted }]}>
                      {pedido.shippingAddress.addressLine},{" "}
                      {pedido.shippingAddress.city}
                    </BodyText>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={colors.muted}
                    />
                    <BodyText style={[styles.client, { color: colors.muted }]}>
                      {pedido.contactName}
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
            );
          })
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
  },
  cardContainer: {
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
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
    flex: 1,
  },
  client: {
    fontSize: 14,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
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
