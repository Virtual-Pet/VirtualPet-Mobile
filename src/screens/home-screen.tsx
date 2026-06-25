import { useAuth } from "@/src/hooks/auth-context";
import { useTheme } from "@/src/hooks/theme-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MyAssignmentCard } from "../components/MyAssignmentCard";
import { ShipmentDetailsModal } from "../components/ShipmentDetailModal";
import { BodyText } from "../components/ui/BodyText";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { SectionTitle } from "../components/ui/SectionTitle";
import {
  getMyShipments,
  updateShipmentStatus,
  type Shipment,
} from "../services/shipment-service";

export default function HomeScreen() {
  const { colors, theme } = useTheme();
  const { status, userProfile, token } = useAuth();

  const [misAsignaciones, setMisAsignaciones] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);

  const loadMyShipments = async () => {
    if (!token || !userProfile?.id) return;
    try {
      const data = await getMyShipments(token, userProfile.id);
      setMisAsignaciones(data);
    } catch (error) {
      console.error("Error trayendo mis pedidos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (status === "authenticated")
        loadMyShipments().finally(() => setLoading(false));
    }, [token, userProfile?.id, status]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyShipments();
    setRefreshing(false);
  };

  const handleResolution = async (
    shipmentId: string,
    resolution: "DELIVERED" | "RETURNED",
  ) => {
    if (!token) return;
    try {
      await updateShipmentStatus(token, resolution, shipmentId);
      setMisAsignaciones((prev) =>
        prev.filter((s) => s.shipmentId !== shipmentId),
      );
      setActiveShipment(null);
    } catch (error) {
      console.error("Error al procesar la entrega:", error);
    }
  };

  if (status !== "authenticated") return null;

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
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
          subtitle={`Tenés ${misAsignaciones.length} entregas en curso.`}
        />

        {misAsignaciones.length === 0 ? (
          <BodyText style={[styles.emptyText, { color: colors.muted }]}>
            Hoja de ruta limpia. ¡Buen trabajo!
          </BodyText>
        ) : (
          misAsignaciones.map((pedido) => (
            <MyAssignmentCard
              key={pedido.shipmentId}
              pedido={pedido}
              colors={colors}
              onPress={() => setActiveShipment(pedido)}
            />
          ))
        )}
      </ScrollView>

      <ShipmentDetailsModal
        pedido={activeShipment}
        visible={!!activeShipment}
        title={`Entregar Pedido #${activeShipment?.orderId.substring(0, 8)}`}
        colors={colors}
        theme={theme}
        onClose={() => setActiveShipment(null)}
      >
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#FEE2E2" }]}
            onPress={() =>
              activeShipment &&
              handleResolution(activeShipment.shipmentId, "RETURNED")
            }
          >
            <Ionicons name="close-circle" size={24} color="#DC2626" />
            <BodyText
              style={{ color: "#DC2626", fontWeight: "700", marginTop: 4 }}
            >
              No Entregado
            </BodyText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#DCFCE7" }]}
            onPress={() =>
              activeShipment &&
              handleResolution(activeShipment.shipmentId, "DELIVERED")
            }
          >
            <Ionicons name="checkmark-circle" size={24} color="#166534" />
            <BodyText
              style={{ color: "#166534", fontWeight: "700", marginTop: 4 }}
            >
              Entregado
            </BodyText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.closeModalBtn}
          onPress={() => setActiveShipment(null)}
        >
          <BodyText style={{ color: colors.muted }}>Cancelar</BodyText>
        </TouchableOpacity>
      </ShipmentDetailsModal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 24, paddingHorizontal: 24, paddingTop: 8 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 15 },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeModalBtn: { marginTop: 16, alignItems: "center", padding: 12 },
});
