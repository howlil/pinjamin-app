import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface HeaderSectionProps {
    onAddClick: () => void;
  }

  
export default function HeaderSection({ onAddClick }: HeaderSectionProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Gedung</h1>
      <Button 
      className='w-36'
        onClick={onAddClick}
      >
        <Plus className="mr-2 h-4 w-4" /> Tambah
      </Button>
    </div>
  );
}