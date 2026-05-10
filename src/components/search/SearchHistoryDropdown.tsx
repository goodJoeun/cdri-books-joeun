import Button from '../ui/Button';
import Text from '../ui/Text';
import { cn } from '@/lib/cn';
import { strings } from '@/resource/strings';

interface SearchHistoryDropdownProps {
  history: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
  onClear: () => void;
}

export default function SearchHistoryDropdown({
  history,
  onSelect,
  onRemove,
  onClear,
}: SearchHistoryDropdownProps) {
  return (
    <div
      className={cn(
        'absolute top-full left-0 right-0 mt-1 z-10',
        'bg-white border border-gray-200 rounded shadow-md',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between',
          'px-3 py-2 border-b border-gray-100',
        )}
      >
        <Text size="xs" color="subTitle" text={strings.search.recentHistory} />
        <Button
          className="p-0 text-xs text-gray-400 hover:text-gray-600 hover:bg-transparent"
          variant="ghost"
          size="auto"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClear}
          label={strings.search.clearAll}
        />
      </div>
      {history.map((term) => (
        <div
          key={term}
          className={cn(
            'flex items-center justify-between',
            'px-3 py-2 hover:bg-gray-50 cursor-pointer',
          )}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSelect(term)}
        >
          <Text size="sm" weight="medium" color="subTitle" text={term} />
          <Button
            className="px-1 py-0 text-base leading-none text-gray-300 hover:text-gray-500 hover:bg-transparent"
            variant="ghost"
            size="auto"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(term);
            }}
            label="×"
          />
        </div>
      ))}
    </div>
  );
}
