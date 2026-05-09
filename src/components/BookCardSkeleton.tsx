export default function BookCardSkeleton() {
  return (
    <li className="border-b border-[#D2D6DA]">
      <div className="flex items-center gap-[45px] px-12 py-2 h-[100px]">
        <div className="shrink-0 w-12 h-[68px] rounded skeleton" />

        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <div className="h-5 w-52 rounded skeleton" />
          <div className="h-4 w-28 rounded skeleton" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-9 w-[72px] rounded skeleton" />
          <div className="h-9 w-[72px] rounded skeleton" />
        </div>
      </div>
    </li>
  )
}
