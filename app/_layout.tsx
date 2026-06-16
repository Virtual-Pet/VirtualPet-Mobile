import { AuthProvider } from "@/src/hooks/auth-context";
import { ThemeProvider } from "@/src/hooks/theme-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}
