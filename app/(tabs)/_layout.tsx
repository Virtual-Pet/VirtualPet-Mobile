import { useTheme } from "@/src/hooks/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function TabsLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          elevation: 0,
        },
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: "700", color: colors.text },
        headerTitle: "Virtual Pet",

        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            style={{ marginRight: 16, padding: 8 }}
          >
            <View
              style={{
                backgroundColor: colors.primary,
                padding: 6,
                borderRadius: 20,
              }}
            >
              <Ionicons name="person" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        ),
      }}
    >
      {/* Pestaña 1: Apunta al archivo home.tsx */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Mis Viajes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={24} color={color} />
          ),
        }}
      />

      {/* Pestaña 2: Apunta al archivo disponibles.tsx */}
      <Tabs.Screen
        name="disponibles"
        options={{
          title: "Depósito",
          tabBarIcon: ({ color }) => (
            <Ionicons name="cube" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
