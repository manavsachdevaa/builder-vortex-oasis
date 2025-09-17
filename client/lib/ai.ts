export type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface DonorProfile {
  id: string;
  name: string;
  bloodType: BloodType;
  lat: number;
  lng: number;
  lastDonationDays: number;
  verifiedDonations: number;
  reliability: number; // 0..1
}

export interface BloodRequest {
  id: string;
  hospital: string;
  bloodType: BloodType;
  units: number;
  lat: number;
  lng: number;
  urgency: 1 | 2 | 3; // 1=normal,3=critical
  distanceKm?: number;
}

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const c =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
  return R * d;
}

export function donorScore(d: DonorProfile) {
  // Higher score for more verified donations, reliability and recent availability
  const availability = Math.max(0, 1 - d.lastDonationDays / 56); // 56 days wait period baseline
  return d.verifiedDonations * 0.4 + d.reliability * 0.4 + availability * 0.2;
}

export function isCompatible(donor: BloodType, patient: BloodType) {
  const compat: Record<BloodType, BloodType[]> = {
    "O-": ["O-"],
    "O+": ["O-", "O+"],
    "A-": ["O-", "A-"],
    "A+": ["O-", "O+", "A-", "A+"],
    "B-": ["O-", "B-"],
    "B+": ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  };
  return compat[patient].includes(donor);
}

export function matchRequestsForDonor(
  donor: DonorProfile,
  requests: BloodRequest[],
  maxDistanceKm = 50,
) {
  return requests
    .map((r) => ({
      ...r,
      distanceKm: haversineKm({ lat: donor.lat, lng: donor.lng }, r),
    }))
    .filter(
      (r) =>
        isCompatible(donor.bloodType, r.bloodType) &&
        (r.distanceKm ?? 0) <= maxDistanceKm,
    )
    .sort((a, b) => {
      // Prioritize urgency and proximity
      const scoreA = a.urgency * 10 + (50 - (a.distanceKm ?? 0));
      const scoreB = b.urgency * 10 + (50 - (b.distanceKm ?? 0));
      return scoreB - scoreA;
    });
}

export function predictDemandZones(requests: BloodRequest[]) {
  // Simple clustering by rounding coordinates to ~5km grid (mock predictive heatmap data)
  const buckets = new Map<string, number>();
  for (const r of requests) {
    const key = `${Math.round(r.lat * 20) / 20},${Math.round(r.lng * 20) / 20}`;
    buckets.set(key, (buckets.get(key) || 0) + r.urgency);
  }
  return Array.from(buckets, ([center, weight]) => ({ center, weight }));
}

export function mockRequestsNear(lat: number, lng: number): BloodRequest[] {
  // Deterministic pseudo-random generation based on coords
  const seed = Math.abs(Math.floor((lat * 1000 + lng * 1000) % 97));
  const hospitals = [
    "CityCare Hospital",
    "Unity Health",
    "Sunrise Medical",
    "GreenCross Clinic",
  ];
  const types: BloodType[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  return Array.from({ length: 8 }).map((_, i) => {
    const dx = ((seed + i * 7) % 20) / 200; // ~ up to ~5km
    const dy = ((seed + i * 11) % 20) / 200;
    return {
      id: `req-${seed}-${i}`,
      hospital: hospitals[(seed + i) % hospitals.length]!,
      bloodType: types[(seed + i * 3) % types.length]!,
      units: ((seed + i) % 4) + 1,
      lat: lat + dx,
      lng: lng + dy,
      urgency: (((seed + i) % 3) + 1) as 1 | 2 | 3,
    };
  });
}
