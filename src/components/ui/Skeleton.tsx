export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-br100 bg-[var(--grey-100)] ${className}`}
      aria-hidden
    />
  );
}
