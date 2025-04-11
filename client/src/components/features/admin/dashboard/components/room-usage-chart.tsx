import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Sample data for the charts
const roomData = [
  { name: 'Ruang', peminjaman: 21000 },
  { name: 'Ruang', peminjaman: 14000 },
  { name: 'Ruang', peminjaman: 21000 },
];


// Room Usage Chart Component
const RoomUsageChart = () => {
  const [timeOption, setTimeOption] = useState('bulan'); // Options: hari, bulan, tahun
  const themeColor = '#749C73';

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Grafik Jumlah Peminjaman Ruangan</h3>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 rounded-md ${timeOption === 'hari' ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => setTimeOption('hari')}
            >
              Hari
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${timeOption === 'bulan' ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => setTimeOption('bulan')}
            >
              Bulan
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${timeOption === 'tahun' ? 'bg-gray-200' : 'bg-white'}`}
              onClick={() => setTimeOption('tahun')}
            >
              Tahun
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roomData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis 
              ticks={[0, 7000, 14000, 21000, 210000]} 
              domain={[0, 210000]}
              tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}k`}
            />
            <Tooltip formatter={(value) => [`${value}`, 'Peminjaman']} />
            <Bar dataKey="peminjaman" fill={themeColor} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default RoomUsageChart