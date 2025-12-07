export default function StrainCardSkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-glass-border bg-glass-bg backdrop-blur-xl animate-pulse">
      <div className="relative p-6 flex flex-col justify-between gap-4 min-h-[200px]">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="h-6 bg-glass-heavy rounded-lg w-3/4" />
            <div className="h-6 bg-glass-heavy rounded-full w-16" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="h-4 bg-glass-heavy rounded w-20" />
              <div className="h-4 bg-glass-heavy rounded w-20" />
            </div>
            <div className="h-4 bg-glass-heavy rounded w-32" />
          </div>
        </div>
        
        <div className="h-12 bg-glass-heavy rounded-xl" />
      </div>
    </div>
  );
}