import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const q1TransactionData = [
  { name: 'Januari', transactions: 3000 },
  { name: 'Februari', transactions: 7000 },
  { name: 'Maret', transactions: 3000 },
];

const q2TransactionData = [
  { name: 'April', transactions: 5000 },
  { name: 'Mei', transactions: 14000 },
  { name: 'Juni', transactions: 5000 },
];

const q3TransactionData = [
  { name: 'Juli', transactions: 5000 },
  { name: 'Agustus', transactions: 21000 },
  { name: 'September', transactions: 15000 },
];

const q4TransactionData = [
  { name: 'Oktober', transactions: 18000 },
  { name: 'November', transactions: 25000 },
  { name: 'Desember', transactions: 210000 },
];


const transactionData = [
  { name: 'Januari', transactions: 3000 },
  { name: 'Februari', transactions: 7000 },
  { name: 'Maret', transactions: 3000 },
  { name: 'April', transactions: 5000 },
  { name: 'May', transactions: 14000 },
  { name: 'Juni', transactions: 5000 },
  { name: 'Juli', transactions: 5000 },
  { name: 'Agus', transactions: 21000 },
  { name: 'Agus', transactions: 210000 },
];


const TransactionChart = () => {
    const [quarterOption, setQuarterOption] = useState('q1'); // Options: q1, q2, q3, q4
    
    // Select the appropriate data based on the selected quarter
    const getQuarterData = () => {
      switch(quarterOption) {
        case 'q1': return q1TransactionData;
        case 'q2': return q2TransactionData;
        case 'q3': return q3TransactionData;
        case 'q4': return q4TransactionData;
        default: return q1TransactionData;
      }
    };
  
    // Get quarter title text
    const getQuarterTitle = () => {
      switch(quarterOption) {
        case 'q1': return 'Q1 2025';
        case 'q2': return 'Q2 2025';
        case 'q3': return 'Q3 2025';
        case 'q4': return 'Q4 2025';
        default: return 'Q1 2025';
      }
    };
  
    return (
      <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Grafik Transaksi</h3>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 rounded-md ${quarterOption === 'q1' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => setQuarterOption('q1')}
              >
                Q1
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${quarterOption === 'q2' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => setQuarterOption('q2')}
              >
                Q2
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${quarterOption === 'q3' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => setQuarterOption('q3')}
              >
                Q3
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${quarterOption === 'q4' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => setQuarterOption('q4')}
              >
                Q4
              </button>
            </div>
          </div>
          <div className="mb-2 text-gray-500 font-semibold">{getQuarterTitle()}</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getQuarterData()}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis dataKey="name" />
              <YAxis 
                ticks={[0, 7000, 14000, 21000, 210000]} 
                domain={[0, 210000]}
                tickFormatter={(value) => value === 0 ? '0' : `${value / 1000}k`}
              />
              <Tooltip formatter={(value) => [`${value}`, 'Transaksi']} />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#000000" 
                strokeWidth={1.5} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
export default TransactionChart  