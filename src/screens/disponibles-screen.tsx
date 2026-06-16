import { useTheme } from "@/src/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { BodyText } from "../../src/components/BodyText";
import { Card } from "../../src/components/Card";
import { PrimaryButton } from "../../src/components/PrimaryButton";
import { ScreenWrapper } from "../../src/components/ScreenWrapper";
import { SectionTitle } from "../../src/components/SectionTitle";

// MOCK: Esto vendrá de GET /api/v1/shipments/available (status = PREPARED)
const pedidosEnDeposito = [
  {
    id: "101",
    orderRef: "#5012",
    zone: "Centro",
    packages: 2,
    weight: "4.5 kg",
  },
  {
    id: "102",
    orderRef: "#5015",
    zone: "Constitución",
    packages: 1,
    weight: "1.2 kg",
  },
  {
    id: "103",
    orderRef: "#5018",
    zone: "Puerto",
    packages: 3,
    weight: "12 kg",
  },
];

export default function DisponiblesScreen() {
  const { colors } = useTheme();
  // Estado local para simular que un pedido desaparece de la lista al tomarlo
  const [disponibles, setDisponibles] = useState(pedidosEnDeposito);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleTomarPedido = async (id: string, orderRef: string) => {
    setLoadingId(id);

    try {
      // 🚀 FUTURO FETCH A SPRING BOOT:
      // await fetch(`${process.env.EXPO_PUBLIC_API_URL}/assignments`, {
      //   method: 'POST',
      //   body: JSON.stringify({ shipment_id: id, operator_id: userId })
      // });

      // Simulamos demora de red
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Si el backend responde OK, lo sacamos de esta lista visualmente
      setDisponibles((prev) => prev.filter((pedido) => pedido.id !== id));

      Alert.alert(
        "¡Pedido Asignado!",
        `El pedido ${orderRef} ya está en tu lista de viajes. Podés pasar a retirarlo.`,
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo asignar el pedido. Otro repartidor pudo haberlo tomado.",
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
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
          disponibles.map((pedido) => (
            <Card key={pedido.id} style={styles.cardContainer}>
              <View style={styles.cardHeader}>
                <BodyText style={[styles.title, { color: colors.text }]}>
                  Pedido {pedido.orderRef}
                </BodyText>
                <View style={styles.zoneBadge}>
                  <Ionicons
                    name="map-outline"
                    size={14}
                    color="#0D8ABC"
                    style={{ marginRight: 4 }}
                  />
                  <BodyText style={styles.zoneText}>{pedido.zone}</BodyText>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailBox}>
                  <BodyText
                    style={[styles.detailLabel, { color: colors.muted }]}
                  >
                    Bultos
                  </BodyText>
                  <BodyText
                    style={[styles.detailValue, { color: colors.text }]}
                  >
                    {pedido.packages}
                  </BodyText>
                </View>
                <View style={styles.detailBox}>
                  <BodyText
                    style={[styles.detailLabel, { color: colors.muted }]}
                  >
                    Peso total
                  </BodyText>
                  <BodyText
                    style={[styles.detailValue, { color: colors.text }]}
                  >
                    {pedido.weight}
                  </BodyText>
                </View>
              </View>

              <PrimaryButton
                label={
                  loadingId === pedido.id
                    ? "Asignando..."
                    : "Asignarme este pedido"
                }
                onPress={() => handleTomarPedido(pedido.id, pedido.orderRef)}
                disabled={loadingId !== null} // Bloqueamos todos los botones si está cargando uno
                style={styles.buttonSpacing}
              />
            </Card>
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
    borderLeftWidth: 4,
    borderLeftColor: "#0D8ABC", // Identificador visual lateral
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
  },
  zoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE", // Azul clarito
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoneText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0D8ABC",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  detailBox: {
    flex: 1,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
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
