export type AuthLoginData = {
  accessToken: string;
  refreshToken: string;
  userId: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export async function login({
  email,
  password,
}: LoginCredentials): Promise<AuthLoginData> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Credenciales inválidas");
  }

  const data = await response.json();

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    userId: data.user?.id ?? "",
  };
}

export async function logout(
  accessToken?: string,
  refreshToken?: string,
): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/logout`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ refreshToken: refreshToken }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Error al cerrar sesión");
  }
}
