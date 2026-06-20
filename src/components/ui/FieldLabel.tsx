import { useTheme } from "@/src/hooks/theme-context";
import { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

export function FieldLabel({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.fieldLabel, { color: colors.text }]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    marginBottom: 8,
    fontWeight: "600",
  },
});
