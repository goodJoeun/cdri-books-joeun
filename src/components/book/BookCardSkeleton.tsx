export default function BookCardSkeleton() {
  return (
    <li className="border-b border-border-card">
      <div className="card-row">
        <div className="shrink-0 w-12 h-thumb-h rounded skeleton" />

        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <div className="h-5 w-52 rounded skeleton" />
          <div className="h-4 w-28 rounded skeleton" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-9 w-18 rounded skeleton" />
          <div className="h-9 w-18 rounded skeleton" />
        </div>
      </div>
    </li>
  );
}
