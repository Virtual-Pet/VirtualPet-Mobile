import { useTheme } from "@/src/theme-context";
import { ReactNode } from "react";
import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native";

export function BodyText({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  const { colors } = useTheme();

  return <Text style={[styles.bodyText, { color: colors.secondaryText }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
