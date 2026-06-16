import { useTheme } from "@/src/hooks/theme-context";
import { StyleSheet, Text, View } from "react-native";

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.titleContainer}>
      <Text style={[styles.title, { color: colors.primary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
});
