/**
 * Shared chip / wash classes aligned with `tokens.css` and the embedded frontend-design skill.
 * Keeps category accents on-brand (papaya + neutrals) instead of generic Tailwind default blues/oranges.
 */

/** Asset grid: Prop vs Material pill */
export const assetKindPill = {
  prop: "border border-[var(--surface-primary-default-subtle)] bg-[var(--surface-primary-default-subtle)] text-[var(--text-primary-default)]",
  material:
    "border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] text-[var(--text-default-heading)]",
} as const;

/** Props library: SimReady tag by prop category */
export const propTagPill = {
  manipulation:
    "border border-[var(--surface-primary-default-subtle)] bg-[var(--surface-primary-default-subtle)] text-[var(--text-primary-default)]",
  articulated: "border border-[var(--yellow-800)]/20 bg-[var(--yellow-100)] text-[var(--yellow-800)]",
  navigation:
    "border border-[var(--border-default-secondary)] bg-[var(--grey-50)] text-[var(--text-default-body)]",
} as const;

/** Hero image wash behind prop tags */
export const propTagHeroWash = {
  manipulation: "bg-[var(--surface-primary-default-subtle)]",
  articulated: "bg-[var(--yellow-100)]",
  navigation: "bg-[var(--surface-page-secondary)]",
} as const;

/** Materials grid: type-based preview background */
export function materialTypeWash(type: string): string {
  switch (type) {
    case "wood":
      return "bg-[var(--yellow-100)]";
    case "metal":
      return "bg-[var(--grey-50)]";
    case "glass":
      return "bg-[var(--surface-success-default-subtle)]";
    case "stone":
      return "bg-[var(--surface-page)]";
    case "tile":
      return "bg-[var(--surface-primary-default-subtle)]";
    case "plastic":
      return "bg-[var(--surface-page-secondary)]";
    case "fabric":
      return "bg-[var(--surface-page-secondary)]";
    default:
      return "bg-[var(--surface-page-secondary)]";
  }
}
