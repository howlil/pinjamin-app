import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { Peminjaman } from '@/apis/interfaces/IPeminjaman';

interface ActionMenuProps {
  peminjaman: Peminjaman;
  onViewDetail: (peminjaman: Peminjaman) => void;
  onApprove: (id: string, isApproved: boolean) => void;
}

/**
 * Simple three-dot menu for item actions
 */
const ActionMenu: React.FC<ActionMenuProps> = ({ 
  peminjaman, 
  onViewDetail, 
  onApprove 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button 
        className="text-gray-500 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Action menu"
      >
        <MoreVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="action-menu-button"
        >
          <div className="py-1" role="none">
            <button
              onClick={() => {
                onViewDetail(peminjaman);
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <Eye className="mr-2 h-4 w-4 text-gray-500" />
              <span>Detail</span>
            </button>
            
            <button
              onClick={() => {
                onApprove(peminjaman.id, true);
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <CheckCircle className="mr-2 h-4 w-4 text-main-green" />
              <span>Setujui</span>
            </button>
            
            <button
              onClick={() => {
                onViewDetail(peminjaman);
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              <XCircle className="mr-2 h-4 w-4 text-red-600" />
              <span>Tolak</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;