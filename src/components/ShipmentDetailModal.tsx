import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { type Shipment } from "../services/shipment-service";
import { BodyText } from "./ui/BodyText";

interface ShipmentDetailsModalProps {
  pedido: Shipment | null;
  visible: boolean;
  title: string;
  colors: any;
  theme: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ShipmentDetailsModal({
  pedido,
  visible,
  title,
  colors,
  theme,
  onClose,
  children,
}: ShipmentDetailsModalProps) {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderRelease: (e, gestureState) => {
          if (gestureState.dy > 60) {
            onClose();
          }
        },
      }),
    [onClose],
  );

  if (!pedido) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          <View {...panResponder.panHandlers} style={styles.modalHeaderZone}>
            <View style={styles.modalDragIndicator} />
          </View>

          <BodyText style={[styles.modalTitle, { color: colors.text }]}>
            {title}
          </BodyText>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.modalScroll}
          >
            <View
              style={[
                styles.infoBlock,
                { backgroundColor: theme === "dark" ? "#1E293B" : "#F9FAFB" },
              ]}
            >
              <View style={styles.infoRow}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={colors.muted}
                  style={styles.infoIcon}
                />
                <BodyText style={[styles.infoText, { color: colors.text }]}>
                  {pedido.contactName}
                </BodyText>
              </View>
              <View style={styles.infoRow}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={colors.muted}
                  style={styles.infoIcon}
                />
                <BodyText style={[styles.infoText, { color: colors.muted }]}>
                  {pedido.contactEmail}
                </BodyText>
              </View>
            </View>

            <View
              style={[
                styles.infoBlock,
                { backgroundColor: theme === "dark" ? "#1E293B" : "#F9FAFB" },
              ]}
            >
              <View style={styles.infoRow}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={colors.primary}
                  style={styles.infoIcon}
                />
                <View style={styles.addressContainer}>
                  <BodyText
                    style={[styles.addressMain, { color: colors.text }]}
                  >
                    {pedido.shippingAddress.addressLine}
                  </BodyText>
                  <BodyText
                    style={[styles.addressSub, { color: colors.muted }]}
                  >
                    {pedido.shippingAddress.city},{" "}
                    {pedido.shippingAddress.state}
                  </BodyText>
                  <BodyText
                    style={[styles.addressSub, { color: colors.muted }]}
                  >
                    {pedido.shippingAddress.country} (CP:{" "}
                    {pedido.shippingAddress.postalCode})
                  </BodyText>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.paymentBox,
                { borderColor: theme === "light" ? "#334155" : "#E5E7EB" },
              ]}
            >
              <BodyText style={{ color: colors.muted, fontSize: 14 }}>
                Monto del pedido:
              </BodyText>
              <BodyText
                style={{
                  color: colors.text,
                  fontSize: 26,
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                ${Number(pedido.total).toLocaleString("es-AR")}
              </BodyText>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    elevation: 10,
    maxHeight: "85%",
  },
  modalHeaderZone: {
    width: "100%",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalDragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  modalScroll: { marginBottom: 16 },
  infoBlock: { padding: 16, borderRadius: 16, marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  infoIcon: { marginTop: 2, marginRight: 12 },
  infoText: { fontSize: 15, fontWeight: "500" },
  addressContainer: { flex: 1 },
  addressMain: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  addressSub: { fontSize: 14, marginBottom: 2 },
  paymentBox: {
    alignItems: "center",
    paddingVertical: 20,
    borderWidth: 1,
    borderRadius: 16,
    borderStyle: "dashed",
    marginTop: 8,
    marginBottom: 12,
  },
  modalActions: { paddingTop: 8 },
});
