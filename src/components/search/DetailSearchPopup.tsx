import Button from '../ui/Button';
import Input from '../ui/Input';
import { cn } from '@/lib/cn';
import { strings } from '@/resource/strings';

export type DetailTarget = 'title' | 'person' | 'publisher';

export const TARGET_OPTIONS: { value: DetailTarget; label: string }[] = [
  { value: 'title', label: strings.search.targetOptions.title },
  { value: 'person', label: strings.search.targetOptions.person },
  { value: 'publisher', label: strings.search.targetOptions.publisher },
];

interface DetailSearchPopupProps {
  target: DetailTarget;
  query: string;
  onTargetChange: (target: DetailTarget) => void;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export default function DetailSearchPopup({
  target,
  query,
  onTargetChange,
  onQueryChange,
  onSearch,
  onKeyDown,
  onClose,
}: DetailSearchPopupProps) {
  return (
    <div
      className={cn(
        'absolute top-full right-0 mt-2 z-20',
        'bg-white border border-gray-200 rounded-lg shadow-lg',
        'p-4 w-[calc(100vw-2rem)] max-w-80 sm:w-80',
      )}
    >
      <div className="flex justify-end mb-4">
        <Button
          variant="ghost"
          size="auto"
          onClick={onClose}
          className="p-0 text-xl leading-none text-gray-400 hover:text-gray-600 hover:bg-transparent"
          label="×"
        />
      </div>
      <div
        className={cn(
          'flex items-center gap-2',
          'border-b border-palette-primary pb-1.5 mb-4',
        )}
      >
        <select
          value={target}
          onChange={(e) => onTargetChange(e.target.value as DetailTarget)}
          className={cn(
            'text-sm text-gray-700 bg-transparent',
            'outline-none cursor-pointer',
          )}
        >
          {TARGET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Input
          variant="sm"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={strings.search.detailPlaceholder}
          autoFocus
          className="flex-1"
        />
      </div>
      <Button
        variant="primary"
        className="w-full"
        onClick={onSearch}
        label={strings.search.searchButton}
      />
    </div>
  );
}
