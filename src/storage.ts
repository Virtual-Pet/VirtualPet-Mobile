import * as SecureStore from "expo-secure-store";

export type StoredCredentials = {
  email: string;
  token?: string;
  refreshToken?: string;
  userId?: string;
};

const CREDENTIALS_KEY = "vp_delivery_credentials";

export async function saveCredentials(values: StoredCredentials) {
  return SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(values), {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function readCredentials(): Promise<StoredCredentials | null> {
  const raw = await SecureStore.getItemAsync(CREDENTIALS_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredCredentials;
  } catch {
    return null;
  }
}

export async function clearCredentials() {
  return SecureStore.deleteItemAsync(CREDENTIALS_KEY);
}

export async function hasStoredCredentials() {
  return (await readCredentials()) !== null;
}
