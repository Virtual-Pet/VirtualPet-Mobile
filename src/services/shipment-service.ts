export type ShipmentStatus =
  | "PREPARED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "RETURNED";

export interface ShippingAddress {
  addressLine: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface RiderInfo {
  name: string;
  lastname: string;
  phone: string;
  vehicleType: string;
}

export interface Shipment {
  shipmentId: string;
  orderId: string;
  status: ShipmentStatus;
  updatedAt: string;
  contactName: string;
  contactEmail: string;
  total: string;
  shippingAddress: ShippingAddress;
  rider?: RiderInfo | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Error en la petición: ${response.status}`,
    );
  }
  return response.json();
}

/**
 *  Trae todos los pedidos listos (PREPARED)
 */
export async function getAvailableShipments(
  token: string,
): Promise<Shipment[]> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const [preparedRes, returnedRes] = await Promise.all([
    fetch(`${API_URL}/api/v1/shipments?status=PREPARED`, { method: "GET", headers }),
    fetch(`${API_URL}/api/v1/shipments?status=RETURNED`, { method: "GET", headers }),
  ]);
  const prepared = ((await handleResponse(preparedRes)) as PaginatedResponse<Shipment>).data;
  const returned = ((await handleResponse(returnedRes)) as PaginatedResponse<Shipment>).data;
  return [...prepared, ...returned];
}

/**
 * Asigna un pedido al repartidor actual
 */
export async function assignShipmentToMe(
  token: string,
  shipmentId: string,
): Promise<Shipment> {
  const response = await fetch(
    `${API_URL}/api/v1/shipments/${shipmentId}/assign`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return handleResponse(response);
}

export async function getMyShipments(
  token: string,
  operatorId: string,
): Promise<Shipment[]> {
  const response = await fetch(
    `${API_URL}/api/v1/shipments?rider_id=${operatorId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );
  const paginatedResult = (await handleResponse(
    response,
  )) as PaginatedResponse<Shipment>;
  return paginatedResult.data;
}

export async function updateShipmentStatus(
  token: string,
  response: "DELIVERED" | "RETURNED",
  shipmentId: string,
): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/shipments/${shipmentId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: response }),
  });

  await handleResponse(res);
}
