import { countries as rawCountries } from "countries-list";

export interface CountryData {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

// Convert the library object into a sorted array for our dropdown
export const countries: CountryData[] = Object.entries(rawCountries).map(
  ([code, data]: [string, any]) => ({
    name: data.name,
    code: code,
    // Handle both array and string formats for phone codes
    dialCode: `+${Array.isArray(data.phone) ? data.phone[0] : data.phone}`,
    // We use 'any' above so we can access .emoji without TS complaining
    flag: data.emoji as any, 
  })
).sort((a, b) => {
  // Luxury UX: Put your main target markets at the very top
  const priority = ["PK", "AE", "GB", "US", "SA"];
  const aIndex = priority.indexOf(a.code);
  const bIndex = priority.indexOf(b.code);

  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;

  // Others stay in alphabetical order
  return a.name.localeCompare(b.name);
});