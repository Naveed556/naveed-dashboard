const LABELS: Record<"male" | "female", string> = {
  male: "Male",
  female: "Female",
};

/** Display label for stored gender values (`male` / `female` and legacy values). */
export function formatGenderLabel(gender: string | null | undefined): string {
  if (!gender) return "";
  const key = gender.toLowerCase();
  if (key === "male" || key === "female") return LABELS[key];
  return (
    gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
  );
}

/** Map stored value to a valid select value (legacy `other` → male). */
export function normalizeGenderSelect(
  gender: string | null | undefined,
): "male" | "female" {
  return gender?.toLowerCase() === "female" ? "female" : "male";
}

export function isAllowedGender(gender: string): boolean {
  const k = gender.toLowerCase();
  return k === "male" || k === "female";
}
