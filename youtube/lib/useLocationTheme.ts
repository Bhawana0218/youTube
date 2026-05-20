/**
 * Determines theme and region based on:
 * - IST time window: 10:00 AM – 12:00 PM
 * - Location: South Indian states (TN, KL, KA, AP, TG)
 *
 * Light theme only when BOTH conditions are true.
 * South India flag drives OTP channel (email vs mobile).
 */

export const SOUTH_INDIA_STATES = [
  "tamil nadu",
  "kerala",
  "karnataka",
  "andhra pradesh",
  "telangana",
];

/** Returns current IST hour (0–23) */
export function getISTHour(): number {
  const now = new Date();
  // IST = UTC + 5:30
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const istMs = utcMs + 5.5 * 60 * 60_000;
  return new Date(istMs).getHours();
}

/** True if current IST time is between 10:00 and 11:59 */
export function isLightTimeWindow(): boolean {
  const hour = getISTHour();
  return hour >= 10 && hour < 12;
}

export interface LocationInfo {
  state: string;
  isSouthIndia: boolean;
}

/** Reverse-geocode browser coords using nominatim (free, no key needed) */
export async function getLocationInfo(): Promise<LocationInfo> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ state: "", isSouthIndia: false });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
          const res = await fetch(url, {
            headers: { "Accept-Language": "en" },
          });
          const data = await res.json();
          const state: string = (
            data?.address?.state || ""
          ).toLowerCase();
          const isSouthIndia = SOUTH_INDIA_STATES.some((s) =>
            state.includes(s)
          );
          resolve({ state, isSouthIndia });
        } catch {
          resolve({ state: "", isSouthIndia: false });
        }
      },
      () => resolve({ state: "", isSouthIndia: false }),
      { timeout: 8000 }
    );
  });
}

/**
 * Resolves the full theme + region context.
 * Light theme = South India AND 10–12 AM IST.
 */
export async function resolveThemeAndRegion(): Promise<{
  theme: "light" | "dark";
  isSouthIndia: boolean;
  state: string;
}> {
  const [locationInfo] = await Promise.all([getLocationInfo()]);
  const inTimeWindow = isLightTimeWindow();
  const theme =
    locationInfo.isSouthIndia && inTimeWindow ? "light" : "dark";
  return { theme, isSouthIndia: locationInfo.isSouthIndia, state: locationInfo.state };
}
