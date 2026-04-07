/** Shared motion tokens — 250ms interactions */
export const tx =
  "transition-[color,background-color,box-shadow,transform,opacity,border-color] duration-250 ease-out";

export const txSidebarSlide =
  "transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)]";

/** Overlays: backdrop blur + opacity, panel motion */
export const txOverlayBackdrop =
  "transition-[opacity,backdrop-filter] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]";

export const txOverlayPanel =
  "transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)]";
