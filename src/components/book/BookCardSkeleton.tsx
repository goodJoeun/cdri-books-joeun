export default function BookCardSkeleton() {
  return (
    <li className="border-b border-border-card">
      <div className="card-row">
        <div className="shrink-0 w-12 h-thumb-h rounded skeleton" />

        <div className="flex-1 min-w-0 flex flex-col gap-2 sm:gap-2.5">
          <div className="h-4 sm:h-5 w-3/4 sm:w-52 rounded skeleton" />
          <div className="h-3 sm:h-4 w-1/2 sm:w-28 rounded skeleton" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 shrink-0">
          <div className="h-[35px] w-[72px] sm:h-12 sm:w-[115px] rounded-lg skeleton" />
          <div className="h-[35px] w-[72px] sm:h-12 sm:w-[115px] rounded-lg skeleton" />
        </div>
      </div>
    </li>
  );
}
