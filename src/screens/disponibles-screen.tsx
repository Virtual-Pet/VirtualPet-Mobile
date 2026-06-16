import { useTheme } from "@/src/hooks/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { BodyText } from "../../src/components/BodyText";
import { Card } from "../../src/components/Card";
import { PrimaryButton } from "../../src/components/PrimaryButton";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { SectionTitle } from "../../src/components/SectionTitle";
import { useAuth } from "../hooks/auth-context";
import {
  assignShipmentToMe,
  getAvailableShipments,
  type Shipment,
} from "../services/shipment-service";

export default function DisponiblesScreen() {
  const { colors, theme } = useTheme();
  const { token, userProfile } = useAuth();

  const [disponibles, setDisponibles] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadShipments = async () => {
    if (!token) return;
    try {
      const data = await getAvailableShipments(token);
      setDisponibles(data);
    } catch (error) {
      console.error("Error trayendo pedidos:", error);
    }
  };

  useEffect(() => {
    loadShipments().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadShipments();
    setRefreshing(false);
  };

  const handleTomarPedido = async (id: string, orderRef: string) => {
    if (!token || !userProfile?.id) return;

    setLoadingId(id);
    try {
      await assignShipmentToMe(token, id, userProfile.id);

      setDisponibles((prev) =>
        prev.filter((pedido) => pedido.shipmentId !== id),
      );

      Alert.alert(
        "¡Pedido Asignado!",
        `El pedido #${orderRef} ya está en tu lista de viajes.`,
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo asignar. Otro repartidor pudo haberlo tomado.",
      );
      console.error("Error asignando pedido:", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <BodyText style={[styles.loadingText, { color: colors.muted }]}>
            Buscando pedidos disponibles...
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
          title="Pedidos Disponibles"
          subtitle="Cajas listas en el depósito. Asignate las que vayas a entregar."
        />

        {disponibles.length === 0 ? (
          <BodyText style={[styles.emptyText, { color: colors.muted }]}>
            No hay pedidos pendientes en el depósito en este momento.
          </BodyText>
        ) : (
          disponibles.map((pedido) => {
            // Recortamos el UUID para que visualmente se vea limpio (ej: #10000000)
            const shortOrderRef = pedido.orderId.substring(0, 8);

            return (
              <Card key={pedido.shipmentId} style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <BodyText style={[styles.title, { color: colors.text }]}>
                    Pedido #{shortOrderRef}
                  </BodyText>
                </View>

                {/* Info Principal: Dirección */}
                <View style={styles.addressRow}>
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={colors.muted}
                  />
                  <BodyText
                    style={[styles.addressText, { color: colors.text }]}
                  >
                    {pedido.shippingAddress.addressLine}
                  </BodyText>
                </View>

                {/* Detalles secundarios (Cliente y Total) */}
                <View
                  style={[
                    styles.detailsRow,
                    {
                      backgroundColor: theme === "dark" ? "#1E293B" : "#F9FAFB",
                    },
                  ]}
                >
                  <View style={styles.detailBox}>
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color={colors.muted}
                      style={{ marginBottom: 4 }}
                    />
                    <BodyText
                      style={[styles.detailLabel, { color: colors.muted }]}
                    >
                      Cliente
                    </BodyText>
                    <BodyText
                      style={[styles.detailValue, { color: colors.text }]}
                    >
                      {pedido.contactName}
                    </BodyText>
                  </View>

                  <View
                    style={[
                      styles.verticalDivider,
                      {
                        backgroundColor:
                          theme === "dark" ? "#334155" : "#E5E7EB",
                      },
                    ]}
                  />

                  <View style={styles.detailBox}>
                    <Ionicons
                      name="cash-outline"
                      size={16}
                      color={colors.muted}
                      style={{ marginBottom: 4 }}
                    />
                    <BodyText
                      style={[styles.detailLabel, { color: colors.muted }]}
                    >
                      Cobro
                    </BodyText>
                    <BodyText
                      style={[styles.detailValue, { color: colors.text }]}
                    >
                      ${Number(pedido.total).toLocaleString("es-AR")}
                    </BodyText>
                  </View>
                </View>

                <PrimaryButton
                  label={
                    loadingId === pedido.shipmentId
                      ? "Asignando..."
                      : "Asignarme este pedido"
                  }
                  onPress={() =>
                    handleTomarPedido(pedido.shipmentId, shortOrderRef)
                  }
                  disabled={loadingId !== null}
                  style={styles.buttonSpacing}
                />
              </Card>
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
    borderLeftWidth: 4,
    borderLeftColor: "#0D8ABC",
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
  zoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoneText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0D8ABC",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addressText: {
    fontSize: 15,
    marginLeft: 6,
    fontWeight: "500",
    flex: 1,
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  detailBox: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  verticalDivider: {
    width: 1,
    height: "80%",
    alignSelf: "center",
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontWeight: "700",
    fontSize: 15,
  },
  buttonSpacing: {
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 15,
  },
});
