export type BadgeLevel = "Bronze" | "Silver" | "Gold";

export interface BadgeInfo {
  level: BadgeLevel;
  minDonations: number;
  discountPercent: number;
  color: string; // tailwind class suffix
}

export const BADGES: BadgeInfo[] = [
  { level: "Bronze", minDonations: 1, discountPercent: 15, color: "amber" },
  { level: "Silver", minDonations: 3, discountPercent: 30, color: "zinc" },
  { level: "Gold", minDonations: 5, discountPercent: 50, color: "yellow" },
];

export function currentBadge(verifiedDonations: number): BadgeInfo {
  let badge = BADGES[0]!;
  for (const b of BADGES) {
    if (verifiedDonations >= b.minDonations) badge = b;
  }
  return badge;
}
