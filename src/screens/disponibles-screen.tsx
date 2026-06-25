import { useTheme } from "@/src/hooks/theme-context";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ShipmentCard } from "../components/ShipmentCard";
import { ShipmentDetailsModal } from "../components/ShipmentDetailModal";
import { BodyText } from "../components/ui/BodyText";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { SectionTitle } from "../components/ui/SectionTitle";
import { useFocusEffect } from "expo-router";
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

  const [selectedPedido, setSelectedPedido] = useState<Shipment | null>(null);

  const loadShipments = async () => {
    if (!token) return;
    try {
      const data = await getAvailableShipments(token);
      setDisponibles(data);
    } catch (error) {
      console.error("Error trayendo pedidos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadShipments().finally(() => setLoading(false));
    }, [token]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadShipments();
    setRefreshing(false);
  };

  const handleTomarPedido = async (id_shipment: string) => {
    if (!token || !userProfile?.id) return;

    setLoadingId(id_shipment);
    try {
      await assignShipmentToMe(token, id_shipment);
      setDisponibles((prev) =>
        prev.filter((pedido) => pedido.shipmentId !== id_shipment),
      );
      setSelectedPedido(null);
      Alert.alert("¡Asignado!", `El pedido ya está en tu lista.`);
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
          subtitle="Pedidos listos o retornados en el depósito. Asignate los que vayas a entregar."
        />

        {disponibles.length === 0 ? (
          <BodyText style={[styles.emptyText, { color: colors.muted }]}>
            No hay pedidos disponibles en el depósito en este momento.
          </BodyText>
        ) : (
          disponibles.map((pedido) => (
            <ShipmentCard
              key={pedido.shipmentId}
              pedido={pedido}
              isLoading={loadingId === pedido.shipmentId}
              colors={colors}
              onPressCard={() => setSelectedPedido(pedido)}
              onPressAssign={() => handleTomarPedido(pedido.shipmentId)}
            />
          ))
        )}
      </ScrollView>

      <ShipmentDetailsModal
        pedido={selectedPedido}
        visible={!!selectedPedido}
        title={`Pedido #${selectedPedido?.orderId.substring(0, 8)}`}
        colors={colors}
        theme={theme}
        onClose={() => setSelectedPedido(null)}
      >
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.modalCancelBtn}
            onPress={() => setSelectedPedido(null)}
          >
            <BodyText style={{ color: colors.muted, fontWeight: "600" }}>
              Cerrar
            </BodyText>
          </TouchableOpacity>

          <PrimaryButton
            label={
              loadingId === selectedPedido?.shipmentId
                ? "Asignando..."
                : "Asignarme este pedido"
            }
            style={{ flex: 1 }}
            disabled={loadingId !== null}
            onPress={() =>
              selectedPedido && handleTomarPedido(selectedPedido.shipmentId)
            }
          />
        </View>
      </ShipmentDetailsModal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { margin: 0, paddingHorizontal: 24, paddingTop: 8 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 16, fontSize: 15 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 15 },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
  },
  modalCancelBtn: { padding: 16, paddingHorizontal: 20, marginRight: 8 },
});
