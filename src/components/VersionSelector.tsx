import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { versions } from '../data/knowledgePoints';
import { useAppStore } from '../store/appStore';
import { clsx } from 'clsx';

export function VersionSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentVersion, setVersion, setKnowledgePoint } = useAppStore();

  const selectedVersion = versions.find((v) => v.id === currentVersion);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (versionId: string) => {
    setVersion(versionId);
    const version = versions.find((v) => v.id === versionId);
    if (version && version.knowledgePoints.length > 0) {
      setKnowledgePoint(version.knowledgePoints[0].id);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-md',
          'border-2 border-transparent hover:border-blue-200',
          'transition-all duration-200 min-w-[200px] justify-between'
        )}
      >
        <span className="text-gray-700 font-medium">
          {selectedVersion?.displayName || '选择版本'}
        </span>
        <ChevronDown
          className={clsx(
            'w-5 h-5 text-gray-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 max-h-[300px] overflow-y-auto">
          {versions.map((version) => (
            <button
              key={version.id}
              onClick={() => handleSelect(version.id)}
              className={clsx(
                'w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors',
                version.id === currentVersion && 'bg-blue-50 text-blue-600 font-medium'
              )}
            >
              {version.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
