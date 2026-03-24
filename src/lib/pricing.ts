export function formatCfa(amount: number) {
  return `${amount.toLocaleString("fr-FR")} CFA`;
}

export const ROOM_PRICE_CFA: Record<string, number> = {
  Standard: 25000,
  Deluxe: 40000,
  Suite: 65000,
};

export const OFFER_PRICE_CFA: Record<string, number> = {
  "Escapade romantique": 85000,
  "Séjour business": 60000,
  "Pack famille": 75000,
  "Suite prestige": 120000,
};

export function getRoomPriceCfa(roomType: string) {
  return ROOM_PRICE_CFA[roomType] ?? 0;
}

export function getOfferPriceCfa(offerTitle?: string) {
  if (!offerTitle) return 0;
  return OFFER_PRICE_CFA[offerTitle] ?? 0;
}

