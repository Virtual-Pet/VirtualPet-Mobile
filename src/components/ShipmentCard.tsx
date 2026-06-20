import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { BodyText } from "../components/ui/BodyText";
import { Card } from "../components/ui/Card";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { type Shipment } from "../services/shipment-service";

interface ShipmentCardProps {
  pedido: Shipment;
  isLoading: boolean;
  colors: any;
  onPressCard: () => void;
  onPressAssign: () => void;
}

export function ShipmentCard({
  pedido,
  isLoading,
  colors,
  onPressCard,
  onPressAssign,
}: ShipmentCardProps) {
  const shortOrderRef = pedido.orderId.substring(0, 8);

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPressCard}>
      <Card style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <BodyText style={[styles.title, { color: colors.text }]}>
            #{shortOrderRef}
          </BodyText>
          <View style={styles.zoneBadge}>
            <Ionicons
              name="map-outline"
              size={12}
              color="#0D8ABC"
              style={{ marginRight: 4 }}
            />
            <BodyText style={styles.zoneText}>
              {pedido.shippingAddress.city}
            </BodyText>
          </View>
        </View>

        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={18} color={colors.muted} />
          <BodyText style={[styles.addressText, { color: colors.text }]}>
            {pedido.shippingAddress.addressLine}
          </BodyText>
        </View>

        <PrimaryButton
          label={isLoading ? "Asignando..." : "Asignarme Pedido"}
          onPress={onPressAssign}
          disabled={isLoading}
          style={styles.quickAssignButton}
        />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  title: { fontWeight: "700", fontSize: 18 },
  zoneBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoneText: { fontSize: 12, fontWeight: "700", color: "#0D8ABC" },
  addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  addressText: { fontSize: 15, marginLeft: 6, fontWeight: "500", flex: 1 },
  quickAssignButton: { paddingVertical: 10 },
});
