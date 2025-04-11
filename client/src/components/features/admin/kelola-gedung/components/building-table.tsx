// BuildingTable.tsx - Component for displaying buildings in a table
import React from 'react';
import { MoreVertical } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from '@/components/ui/table';

export interface Building {
    id: number;
    name: string;
    description: string;
    capacity: string;
    location: string;
    manager?: string;
    facilities?: string;
    price?: string;
    type?: string;
    photo?: File | null;
  }

export interface BuildingTableProps {
    buildings: Building[];
    onEditClick: (id: number) => void;
    onDeleteClick: (id: number) => void;
    activeDropdown: number | null;
    toggleDropdown: (id: number) => void;
  }
  

export default function BuildingTable({ 
  buildings, 
  onEditClick, 
  onDeleteClick, 
  activeDropdown, 
  toggleDropdown 
}: BuildingTableProps) {
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-200">
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Gedung</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {buildings.map((building) => (
            <TableRow key={building.id}>
              <TableCell>{building.id}</TableCell>
              <TableCell>{building.name}</TableCell>
              <TableCell>{building.description || '-'}</TableCell>
              <TableCell>{building.capacity || '-'}</TableCell>
              <TableCell>{building.location || '-'}</TableCell>
              <TableCell className="text-right relative">
                <button
                  onClick={() => toggleDropdown(building.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                
                {activeDropdown === building.id && (
                  <div className="absolute right-8 z-10 mt-1 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <button
                        onClick={() => onEditClick(building.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteClick(building.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}