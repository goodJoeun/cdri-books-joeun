'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Text from '../ui/Text';
import Input from '../ui/Input';
import { cn } from '@/lib/cn';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { strings } from '@/resource/strings';

type DetailTarget = 'title' | 'person' | 'publisher';

const TARGET_OPTIONS: { value: DetailTarget; label: string }[] = [
  { value: 'title', label: strings.search.targetOptions.title },
  { value: 'person', label: strings.search.targetOptions.person },
  { value: 'publisher', label: strings.search.targetOptions.publisher },
];

interface SearchBarProps {
  defaultQuery?: string;
  defaultTarget?: string;
}

export default function SearchBar({
  defaultQuery = '',
  defaultTarget,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [showHistory, setShowHistory] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [detailTarget, setDetailTarget] = useState<DetailTarget>(
    (defaultTarget as DetailTarget) ?? 'title',
  );
  const [detailQuery, setDetailQuery] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const { history, addHistory, removeHistory, clearHistory } =
    useSearchHistory();

  // URL이 바뀔 때 (뒤로가기, 히스토리 클릭 등) 입력값 동기화
  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  const navigate = (term: string, target?: string) => {
    const params = new URLSearchParams({ q: term });
    if (target) params.set('target', target);
    const href = `/?${params}`;
    sessionStorage.setItem('lastSearchHref', href);
    window.dispatchEvent(new CustomEvent('search:navigate', { detail: href }));
    router.push(href);
  };

  const handleSearch = (term?: string) => {
    const trimmed = (term ?? query).trim();
    if (!trimmed) return;
    addHistory(trimmed);
    setQuery(trimmed);
    setShowHistory(false);
    setShowDetailPopup(false);
    navigate(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setShowHistory(false);
  };

  const handleToggleDetailPopup = () => {
    const opening = !showDetailPopup;
    if (opening && query) setQuery('');
    setShowDetailPopup(opening);
    setShowHistory(false);
  };

  const handleDetailSearch = () => {
    if (!detailQuery.trim()) return;
    navigate(detailQuery.trim(), detailTarget);
    setDetailQuery('');
    setShowDetailPopup(false);
  };

  const handleDetailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleDetailSearch();
    if (e.key === 'Escape') setShowDetailPopup(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowHistory(false);
      }
      if (detailRef.current && !detailRef.current.contains(e.target as Node)) {
        setShowDetailPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldShowHistory = showHistory && history.length > 0 && !query.trim();

  return (
    <div className="flex items-center gap-2 mb-3 w-full max-w-[700px] mx-auto border border-palette-gray px-[10px] py-[2px] rounded-lg">
      <div className="flex-1 relative" ref={containerRef}>
        <div
          className={cn(
            'flex items-center rounded',
            'px-3 py-2 gap-[11px] h-[50px] w-full',
          )}
        >
          <Button
            variant="ghost"
            size="auto"
            onClick={() => handleSearch()}
            className="shrink-0 p-0 text-gray-400 hover:text-gray-600 hover:bg-transparent"
            icon={<img src="/icon/search.svg" alt="" className="w-5 h-5" />}
          />
          <Input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) {
                setDetailQuery('');
                setDetailTarget('title');
                setShowDetailPopup(false);
              }
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowHistory(true)}
            placeholder={strings.search.placeholder}
            className="flex-1"
          />
        </div>

        {shouldShowHistory && (
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
              <Text
                size="xs"
                color="subTitle"
                text={strings.search.recentHistory}
              />
              <Button
                className="p-0 text-xs text-gray-400 hover:text-gray-600 hover:bg-transparent"
                variant="ghost"
                size="auto"
                onMouseDown={(e) => e.preventDefault()}
                onClick={clearHistory}
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
                onClick={() => handleSearch(term)}
              >
                <Text size="sm" weight="medium" color="subTitle" text={term} />
                <Button
                  className="px-1 py-0 text-base leading-none text-gray-300 hover:text-gray-500 hover:bg-transparent"
                  variant="ghost"
                  size="auto"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeHistory(term);
                  }}
                  label="×"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={detailRef}>
        <Button
          variant="outline"
          size="sm"
          className="text-text-subTitle whitespace-nowrap"
          onClick={handleToggleDetailPopup}
          label={strings.search.detailSearch}
        />

        {showDetailPopup && (
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
                onClick={() => setShowDetailPopup(false)}
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
                value={detailTarget}
                onChange={(e) =>
                  setDetailTarget(e.target.value as DetailTarget)
                }
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
                value={detailQuery}
                onChange={(e) => setDetailQuery(e.target.value)}
                onKeyDown={handleDetailKeyDown}
                placeholder={strings.search.detailPlaceholder}
                autoFocus
                className="flex-1"
              />
            </div>
            <Button
              variant="primary"
              className="w-full"
              onClick={handleDetailSearch}
              label={strings.search.searchButton}
            />
          </div>
        )}
      </div>
    </div>
  );
}
