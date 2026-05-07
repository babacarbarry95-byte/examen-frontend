import { getStoredArray } from "./storage";

export const RESERVATIONS_KEY = "faby_reservations";

export const ROOM_INVENTORY = {
  Standard: 6,
  Deluxe: 9,
  Suite: 12,
} as const;

export type RoomType = keyof typeof ROOM_INVENTORY;
export type ReservationStatus =
  | "en_attente"
  | "confirmee"
  | "payee"
  | "annulee"
  | "terminee";

export type ReservationRecord = {
  id: number;
  userId?: string;
  name: string;
  email: string;
  city: string;
  roomType: RoomType;
  guests: number;
  startDate: string;
  endDate: string;
  duration: number;
  status: ReservationStatus;
  offer?: string;
  unitPriceCfa?: number;
  totalPriceCfa?: number;
  priceSource?: "offre" | "chambre";
};

export function getReservationStatusLabel(status: ReservationStatus) {
  switch (status) {
    case "en_attente":
      return "En attente";
    case "confirmee":
      return "Confirmee";
    case "payee":
      return "Payee";
    case "annulee":
      return "Annulee";
    case "terminee":
      return "Terminee";
  }
}

function normalizeReservationStatus(status: string | undefined): ReservationStatus {
  switch (status) {
    case "en attente":
    case "en_attente":
      return "en_attente";
    case "confirmée":
    case "confirmÃ©e":
    case "confirmee":
      return "confirmee";
    case "payée":
    case "payÃ©e":
    case "payee":
      return "payee";
    case "annulée":
    case "annulÃ©e":
    case "annulee":
      return "annulee";
    case "terminée":
    case "terminÃ©e":
    case "terminee":
      return "terminee";
    default:
      return "en_attente";
  }
}

export function getReservations() {
  return getStoredArray<ReservationRecord>(RESERVATIONS_KEY).map((reservation) => ({
    ...reservation,
    status: normalizeReservationStatus(reservation.status),
  }));
}

export function saveReservations(reservations: ReservationRecord[]) {
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}

export function isActiveReservation(status: ReservationStatus) {
  return status !== "annulee" && status !== "terminee";
}

export function datesOverlap(startA: string, endA: string, startB: string, endB: string) {
  if (!startA || !endA || !startB || !endB) return false;

  const aStart = new Date(startA);
  const aEnd = new Date(endA);
  const bStart = new Date(startB);
  const bEnd = new Date(endB);

  if (
    Number.isNaN(aStart.getTime()) ||
    Number.isNaN(aEnd.getTime()) ||
    Number.isNaN(bStart.getTime()) ||
    Number.isNaN(bEnd.getTime())
  ) {
    return false;
  }

  return aStart < bEnd && bStart < aEnd;
}

export function getAvailableRoomsCount(
  roomType: RoomType,
  startDate: string,
  endDate: string,
  reservations: ReservationRecord[] = getReservations(),
  options?: { excludeReservationId?: number },
) {
  const totalRooms = ROOM_INVENTORY[roomType] ?? 0;

  if (!startDate || !endDate) {
    return totalRooms;
  }

  const bookedRooms = reservations.filter((reservation) => {
    return (
      reservation.roomType === roomType &&
      reservation.id !== options?.excludeReservationId &&
      isActiveReservation(reservation.status) &&
      datesOverlap(startDate, endDate, reservation.startDate, reservation.endDate)
    );
  }).length;

  return Math.max(0, totalRooms - bookedRooms);
}

export function isRoomAvailable(
  roomType: RoomType,
  startDate: string,
  endDate: string,
  reservations?: ReservationRecord[],
  options?: { excludeReservationId?: number },
) {
  return getAvailableRoomsCount(roomType, startDate, endDate, reservations, options) > 0;
}
