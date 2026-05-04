/** Shown on library cards when no 3D preview model is available yet — heavy blur lets the thumbnail bleed through behind the lock glyph. */
export function AssetCardLockOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center bg-white/[0.4] backdrop-blur-[6px] dark:bg-black/[0.4]"
      aria-label="Preview unavailable"
      role="img"
    >
      <span className="material-symbols-outlined text-[28px] text-[var(--text-default-heading)]" aria-hidden>
        lock
      </span>
    </div>
  );
}

/** Shown when a GLB exists but downloads require full access. */
export function AssetLibraryAccessOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center gap-[var(--s-100)] bg-black/35 backdrop-blur-[2px]">
      <span className="material-symbols-outlined text-[28px] text-white" aria-hidden>
        lock
      </span>
      <span className="max-w-[160px] px-[var(--s-200)] text-center text-[11px] font-semibold leading-snug text-white drop-shadow">
        Available with full access
      </span>
    </div>
  );
}
