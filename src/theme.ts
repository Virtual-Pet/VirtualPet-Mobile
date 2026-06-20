export type ThemeMode = "light" | "dark";

export const themeColors = {
  light: {
    background: "#F1F5F9", // Gris muy claro. Hace que la app respire.
    card: "#FFFFFF", // Blanco puro para que las tarjetas "floten" sobre el fondo.
    surface: "#F8FAFC", // Un tono apenas distinto para interiores de tarjetas o modales.
    text: "#0F172A", // Negro pizarra. Mucho más elegante que el negro puro #000.
    secondaryText: "#475569", // Gris medio para descripciones o direcciones largas.
    border: "#E2E8F0", // Bordes sutiles que no compiten con el contenido.
    primary: "#059669", // Verde Esmeralda vibrante. Transmite frescura y éxito.
    buttonText: "#FFFFFF", // Blanco puro para máximo contraste en botones.
    muted: "#94A3B8", // Gris claro para íconos inactivos o placeholders.
    accent: "#D1FAE5", // Verde muy lavado para los fondos de los Badges ("En camino").
    shadow: "#000000", // Sombras siempre negras.
  },
  dark: {
    background: "#0F172A", // Gris azulado profundo. El estándar de Apple/Google para dark mode.
    card: "#1E293B", // Gris un tono más claro para separar las tarjetas del fondo.
    surface: "#334155", // Para destacar cajas internas (como la caja de pago).
    text: "#F8FAFC", // Blanco tiza. No quema la retina como el blanco puro.
    secondaryText: "#94A3B8", // Gris claro para lectura cómoda en la oscuridad.
    border: "#334155", // Bordes invisibles pero que estructuran.
    primary: "#059669", // Verde Esmeralda vibrante. Transmite frescura y éxito.
    buttonText: "#022C22", // Texto casi negro para el botón. Esto es CLAVE para que no se vea barato.
    accent: "#166534", // Un verde oscuro real (no pantano) para el fondo de los Badges.
    muted: "#64748B",
    shadow: "#000000",
  },
};
