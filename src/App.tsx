/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Eye, Download, Printer } from 'lucide-react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import { InvoiceData } from './types';

const initialData: InvoiceData = {
  details: {
    invoiceNumber: 'INV-001',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    documentTitle: 'FAKTUR',
    paymentStatus: 'Belum Dibayar',
  },
  business: {
    name: '',
    logo: '',
    address: '',
    email: '',
    phone: '',
  },
  client: {
    name: '',
    logo: '',
    address: '',
    email: '',
    phone: '',
  },
  items: [
    {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      quantity: 1,
      price: 0,
    }
  ],
  taxes: [],
  discount: 0,
  payment: {
    method: 'Transfer Bank',
    accountName: '',
    accountNumber: '',
    bankName: '',
    notes: 'Terima kasih atas kerja sama Anda!',
  },
  currencySymbol: 'Rp',
};

export default function App() {
  const [data, setData] = useState<InvoiceData>(initialData);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-gray-900 font-sans">
      {/* Header - Hidden when printing */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileText size={20} />
            </div>
            <h1 className="text-lg sm:text-xl font-semibold tracking-tight">InvoiceGen</h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setMode('edit')}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === 'edit' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setMode('preview')}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${
                  mode === 'preview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye size={16} className="mr-1.5" />
                Pratinjau
              </button>
            </div>
            
            {mode === 'preview' && (
              <button
                onClick={handlePrint}
                className="flex items-center px-3 sm:px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                <Printer size={16} className="mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Cetak / PDF</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:m-0">
        {mode === 'edit' ? (
          <InvoiceForm data={data} onChange={setData} />
        ) : (
          <InvoicePreview data={data} />
        )}
      </main>
    </div>
  );
}
