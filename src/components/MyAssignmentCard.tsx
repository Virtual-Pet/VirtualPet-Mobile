import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { type Shipment } from "../services/shipment-service";
import { BodyText } from "./ui/BodyText";
import { Card } from "./ui/Card";

interface MyAssignmentCardProps {
  pedido: Shipment;
  colors: any;
  onPress: () => void;
}

export function MyAssignmentCard({
  pedido,
  colors,
  onPress,
}: MyAssignmentCardProps) {
  const shortOrderRef = pedido.orderId.substring(0, 8);
  const isDeliveryInProgress = pedido.status === "IN_PROGRESS";
  const badgeBg = isDeliveryInProgress ? "#FEF08A" : "#E2E8F0";
  const badgeTextColor = isDeliveryInProgress ? "#854D0E" : "#475569";

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <BodyText style={[styles.title, { color: colors.text }]}>
            #{shortOrderRef}
          </BodyText>
          <View style={[styles.badge, { backgroundColor: badgeBg }]}>
            <BodyText style={[styles.badgeText, { color: badgeTextColor }]}>
              {isDeliveryInProgress ? "En camino" : "En tu baúl"}
            </BodyText>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={18} color={colors.primary} />
          <BodyText style={[styles.address, { color: colors.text }]}>
            {pedido.shippingAddress.addressLine}, {pedido.shippingAddress.city}
          </BodyText>
        </View>

        <View style={styles.divider} />
        <BodyText style={[styles.actionText, { color: colors.primary }]}>
          Tocar para gestionar entrega
        </BodyText>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  title: { fontWeight: "700", fontSize: 18 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  address: { fontSize: 15, marginLeft: 8, flex: 1, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 12 },
  actionText: { fontWeight: "600", fontSize: 14, textAlign: "center" },
});
