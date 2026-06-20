import { AuthProvider, useAuth } from "@/src/hooks/auth-context";
import { ThemeProvider } from "@/src/hooks/theme-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

function RouterGuard() {
  const { status, isReady } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const inAuthScreen = segments[0] === "login" || segments[0] === "unlock";

    if (status === "none" && !inAuthScreen) {
      router.replace("/login");
    } else if (status === "locked" && segments[0] !== "unlock") {
      router.replace("/unlock");
    } else if (status === "authenticated" && inAuthScreen) {
      router.replace("/home");
    }
  }, [status, isReady, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterGuard />
      </AuthProvider>
    </ThemeProvider>
  );
}
