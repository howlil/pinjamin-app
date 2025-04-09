import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
  debounceTime?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  onSearch,
  className = '',
  debounceTime = 500, 
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState<string>(searchValue);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setDebouncedValue(searchValue);
        onSearch?.(searchValue);
      }
    },
    [searchValue, onSearch]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchValue, debounceTime]);

  useEffect(() => {
    onSearch?.(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={`relative w-64 ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="pl-10"
      />
    </div>
  );
};

export default SearchInput;