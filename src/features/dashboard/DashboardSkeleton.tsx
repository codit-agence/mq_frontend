
export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-20 bg-slate-100 rounded-[24px]" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-40 bg-slate-100 rounded-[32px]" />
        <div className="h-40 bg-slate-100 rounded-[32px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-slate-100 rounded-[32px]" />
        <div className="h-64 bg-slate-100 rounded-[32px]" />
      </div>
    </div>
  );
}