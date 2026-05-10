'use client';

export function SkeletonCard() {
  return (
    <div className="glass-panel rounded-3xl overflow-hidden">
      <div className="aspect-4/5 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 skeleton rounded-full" />
        <div className="h-3 w-full skeleton rounded-full" />
        <div className="h-3 w-2/3 skeleton rounded-full" />
        <div className="h-4 w-1/2 skeleton rounded-full" />
        <div className="h-9 w-full skeleton rounded-full" />
      </div>
    </div>
  );
}
