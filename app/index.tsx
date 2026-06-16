import { useAuth } from "@/src/auth-context";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const { status, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;

    if (status === "authenticated") {
      router.replace("/home");
    } else if (status === "locked") {
      router.replace("/unlock");
    } else {
      router.replace("/login");
    }
  }, [status, isReady, router]);

  return null;
}
